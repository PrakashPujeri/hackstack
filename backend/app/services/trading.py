import pandas as pd
import numpy as np
from typing import List, Dict, Tuple
from datetime import datetime
import logging
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TradingEngine:
    """Generates trading signals based on rule-based strategy."""
    
    def __init__(self, risk_tolerance: float = 0.15):
        self.risk_tolerance = risk_tolerance
        self.trade_log = []
    
    def generate_signals(self, df: pd.DataFrame) -> List[Dict]:
        """Generate trading signals based on technical indicators."""
        signals = []
        
        if len(df) < 20:
            return signals
        
        latest = df.iloc[-1]
        prev = df.iloc[-2]
        
        # Rule 1: Momentum-based signal
        if 'momentum_5' in df.columns:
            if latest['momentum_5'] > 0.02 and prev['momentum_5'] <= 0.02:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'BUY',
                    'confidence': 0.7,
                    'rationale': '5-day momentum turned positive (>2%)',
                    'timestamp': datetime.now()
                })
            elif latest['momentum_5'] < -0.02 and prev['momentum_5'] >= -0.02:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'SELL',
                    'confidence': 0.7,
                    'rationale': '5-day momentum turned negative (<-2%)',
                    'timestamp': datetime.now()
                })
        
        # Rule 2: RSI-based signal
        if 'rsi' in df.columns:
            if latest['rsi'] < 30 and prev['rsi'] >= 30:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'BUY',
                    'confidence': 0.6,
                    'rationale': 'RSI oversold (<30)',
                    'timestamp': datetime.now()
                })
            elif latest['rsi'] > 70 and prev['rsi'] <= 70:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'SELL',
                    'confidence': 0.6,
                    'rationale': 'RSI overbought (>70)',
                    'timestamp': datetime.now()
                })
        
        # Rule 3: Volatility-based signal
        if 'volatility' in df.columns:
            if latest['volatility'] < self.risk_tolerance:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'BUY',
                    'confidence': 0.5,
                    'rationale': f'Low volatility ({latest["volatility"]:.2%} < {self.risk_tolerance:.2%})',
                    'timestamp': datetime.now()
                })
        
        # Default HOLD if no strong signals
        if not signals:
            signals.append({
                'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                'signal': 'HOLD',
                'confidence': 0.5,
                'rationale': 'No strong buy/sell signals',
                'timestamp': datetime.now()
            })
        
        return signals
    
    def calculate_position_size(self, signal: Dict, portfolio_value: float, 
                                asset_volatility: float, max_position_size: float) -> float:
        """Calculate position size based on risk-aware sizing."""
        if signal['signal'] == 'HOLD':
            return 0.0
        
        # Kelly Criterion-inspired sizing
        base_size = min(max_position_size, signal['confidence'] * 0.3)
        
        # Adjust for volatility
        volatility_adjustment = 1.0 - min(asset_volatility / (self.risk_tolerance * 2), 0.5)
        
        position_size = base_size * volatility_adjustment
        
        return position_size * portfolio_value
    
    def execute_trade(self, signal: Dict, price: float, portfolio_value: float,
                     asset_volatility: float, max_position_size: float,
                     transaction_cost: float, slippage: float) -> Dict:
        """Execute a trade and log it."""
        position_value = self.calculate_position_size(
            signal, portfolio_value, asset_volatility, max_position_size
        )
        
        if position_value <= 0:
            return None
        
        quantity = position_value / price
        
        trade = {
            'id': str(uuid.uuid4()),
            'date': datetime.now().strftime('%Y-%m-%d'),
            'asset': signal['asset'],
            'signal': signal['signal'],
            'quantity': quantity,
            'price': price,
            'total_value': position_value,
            'rationale': signal['rationale'],
            'transaction_cost': position_value * transaction_cost,
            'slippage': position_value * slippage
        }
        
        self.trade_log.append(trade)
        logger.info(f"Executed {signal['signal']} for {signal['asset']}: {quantity:.2f} @ ${price:.2f}")
        
        return trade
    
    def get_trade_log(self) -> List[Dict]:
        """Get all executed trades."""
        return self.trade_log
