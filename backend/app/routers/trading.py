from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.models.trading import TradingSignal, Trade
from app.services.trading import TradingEngine
from app.services.data_loader import DataLoader
from app.services.feature_engineering import FeatureEngineering
import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/trading", tags=["trading"])

trading_engine = TradingEngine()


@router.get("/signals")
async def get_trading_signals():
    """Get current trading signals."""
    # Load and process data to generate signals
    data_loader = DataLoader("../data/raw")
    datasets = data_loader.load_all_datasets()
    
    signals = []
    
    for name, df in datasets.items():
        if len(df) > 0:
            # Preprocess and engineer features
            df = data_loader.preprocess_dataset(df)
            feature_engineer = FeatureEngineering()
            df = feature_engineer.engineer_features(df)
            
            # Generate signals
            asset_signals = trading_engine.generate_signals(df)
            signals.extend(asset_signals)
    
    return [
        {
            "asset": s["asset"],
            "signal": s["signal"],
            "confidence": s["confidence"],
            "rationale": s["rationale"],
            "timestamp": s["timestamp"].isoformat()
        }
        for s in signals
    ]


@router.get("/trades")
async def get_trades():
    """Get trade history."""
    trades = trading_engine.get_trade_log()
    
    return [
        {
            "id": t["id"],
            "date": t["date"],
            "asset": t["asset"],
            "signal": t["signal"],
            "quantity": t["quantity"],
            "price": t["price"],
            "total_value": t["total_value"],
            "rationale": t["rationale"]
        }
        for t in trades
    ]


@router.post("/execute")
async def execute_trade(trade_request: Dict):
    """Execute a trade."""
    signal = {
        "asset": trade_request.get("asset", "UNKNOWN"),
        "signal": trade_request.get("signal", "HOLD"),
        "confidence": trade_request.get("confidence", 0.5),
        "rationale": trade_request.get("rationale", "Manual execution"),
        "timestamp": pd.Timestamp.now()
    }
    
    price = trade_request.get("price", 100.0)
    portfolio_value = trade_request.get("portfolio_value", 1000000.0)
    asset_volatility = trade_request.get("asset_volatility", 0.15)
    max_position_size = trade_request.get("max_position_size", 0.2)
    transaction_cost = trade_request.get("transaction_cost", 0.001)
    slippage = trade_request.get("slippage", 0.0005)
    
    trade = trading_engine.execute_trade(
        signal, price, portfolio_value, asset_volatility,
        max_position_size, transaction_cost, slippage
    )
    
    if trade:
        return {
            "status": "success",
            "trade": trade
        }
    else:
        return {
            "status": "failed",
            "message": "Trade could not be executed"
        }
