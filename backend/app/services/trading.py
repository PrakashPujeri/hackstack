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
        """Generate trading signals using multi-asset data and advanced indicators."""
        signals = []
        
        if len(df) < 20:
            return signals
        
        latest = df.iloc[-1]
        prev = df.iloc[-2]
        
        # Determine asset type for specialized signals
        asset_type = self._determine_asset_type(df)
        
        # Rule 1: Enhanced Momentum-based signal
        if 'momentum_5' in df.columns:
            if latest['momentum_5'] > 0.02 and prev['momentum_5'] <= 0.02:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'BUY',
                    'confidence': 0.7,
                    'rationale': f'5-day momentum turned positive (>2%) for {asset_type}',
                    'timestamp': datetime.now()
                })
            elif latest['momentum_5'] < -0.02 and prev['momentum_5'] >= -0.02:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'SELL',
                    'confidence': 0.7,
                    'rationale': f'5-day momentum turned negative (<-2%) for {asset_type}',
                    'timestamp': datetime.now()
                })
        
        # Rule 2: RSI-based signal with asset-specific thresholds
        if 'rsi' in df.columns:
            rsi_threshold = 25 if asset_type == 'commodity' else 30
            if latest['rsi'] < rsi_threshold and prev['rsi'] >= rsi_threshold:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'BUY',
                    'confidence': 0.6,
                    'rationale': f'RSI oversold (<{rsi_threshold}) for {asset_type}',
                    'timestamp': datetime.now()
                })
            elif latest['rsi'] > 75 and prev['rsi'] <= 75:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'SELL',
                    'confidence': 0.6,
                    'rationale': f'RSI overbought (>75) for {asset_type}',
                    'timestamp': datetime.now()
                })
        
        # Rule 3: Multi-asset correlation signals
        if 'oil_gold_ratio' in df.columns:
            ratio_ma = df['oil_gold_ratio'].rolling(window=20).mean().iloc[-1]
            if latest['oil_gold_ratio'] > ratio_ma * 1.1:
                signals.append({
                    'asset': 'Oil',
                    'signal': 'BUY',
                    'confidence': 0.6,
                    'rationale': 'Oil outperforming gold relative to historical average',
                    'timestamp': datetime.now()
                })
            elif latest['oil_gold_ratio'] < ratio_ma * 0.9:
                signals.append({
                    'asset': 'Gold',
                    'signal': 'BUY',
                    'confidence': 0.6,
                    'rationale': 'Gold outperforming oil relative to historical average',
                    'timestamp': datetime.now()
                })
        
        # Rule 4: Macro-economic signals
        if 'inflation_trend' in df.columns and 'interest_rate_trend' in df.columns:
            if latest['inflation_trend'] > 0 and latest['interest_rate_trend'] < 0:
                signals.append({
                    'asset': 'Bonds',
                    'signal': 'BUY',
                    'confidence': 0.5,
                    'rationale': 'Rising inflation with falling rates - bond opportunity',
                    'timestamp': datetime.now()
                })
        
        # Rule 5: Sentiment-based signals
        if 'sentiment_ma' in df.columns:
            if latest['sentiment_ma'] > 0.5 and prev['sentiment_ma'] <= 0.5:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'BUY',
                    'confidence': 0.5,
                    'rationale': 'Positive sentiment trend detected',
                    'timestamp': datetime.now()
                })
            elif latest['sentiment_ma'] < -0.5 and prev['sentiment_ma'] >= -0.5:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'SELL',
                    'confidence': 0.5,
                    'rationale': 'Negative sentiment trend detected',
                    'timestamp': datetime.now()
                })
        
        # Rule 6: Volatility-based signal with asset-specific thresholds
        if 'volatility' in df.columns:
            vol_threshold = self.risk_tolerance * (0.8 if asset_type == 'commodity' else 1.0)
            if latest['volatility'] < vol_threshold:
                signals.append({
                    'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                    'signal': 'BUY',
                    'confidence': 0.5,
                    'rationale': f'Low volatility ({latest["volatility"]:.2%} < {vol_threshold:.2%}) for {asset_type}',
                    'timestamp': datetime.now()
                })
        
        # Default HOLD if no strong signals
        if not signals:
            signals.append({
                'asset': df.iloc[0].get('asset', 'UNKNOWN'),
                'signal': 'HOLD',
                'confidence': 0.5,
                'rationale': f'No strong signals for {asset_type}',
                'timestamp': datetime.now()
            })
        
        return signals
    
    def _determine_asset_type(self, df: pd.DataFrame) -> str:
        """Determine asset type based on available columns."""
        if 'Oil' in df.columns and 'Gold' in df.columns:
            return 'multi-asset'
        elif 'Inflation' in df.columns:
            return 'macro'
        elif 'Volatility' in df.columns and df['Volatility'].std() > 0.1:
            return 'commodity'
        else:
            return 'equity'
    
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
