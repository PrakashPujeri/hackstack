from fastapi import APIRouter
from typing import Dict
from app.models.risk import RiskMetrics
from app.services.risk import RiskManager
import pandas as pd
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/risk", tags=["risk"])

risk_manager = RiskManager()


@router.get("/metrics")
async def get_risk_metrics():
    """Get all risk metrics for the portfolio."""
    # Generate mock portfolio values for demonstration
    np.random.seed(42)
    portfolio_values = pd.Series(
        1000000 * (1 + np.random.normal(0.001, 0.02, 252)).cumprod()
    )
    
    metrics = risk_manager.calculate_all_metrics(portfolio_values)
    
    return metrics


@router.get("/var")
async def get_var():
    """Get Value at Risk (VaR)."""
    np.random.seed(42)
    returns = pd.Series(np.random.normal(0.001, 0.02, 252))
    
    var_95 = risk_manager.calculate_var(returns, 0.95)
    var_99 = risk_manager.calculate_var(returns, 0.99)
    
    return {
        "var_95": var_95,
        "var_99": var_99,
        "confidence_levels": [0.95, 0.99]
    }


@router.get("/drawdown")
async def get_drawdown():
    """Get drawdown metrics."""
    np.random.seed(42)
    portfolio_values = pd.Series(
        1000000 * (1 + np.random.normal(0.001, 0.02, 252)).cumprod()
    )
    
    max_drawdown = risk_manager.calculate_max_drawdown(portfolio_values)
    current_drawdown = risk_manager.calculate_max_drawdown(portfolio_values.tail(30))
    
    return {
        "max_drawdown": max_drawdown,
        "current_drawdown": current_drawdown
    }
