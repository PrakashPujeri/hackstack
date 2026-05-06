import pandas as pd
import numpy as np
from typing import Dict, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FeatureEngineering:
    """Engineers financial features from raw market data."""
    
    @staticmethod
    def calculate_returns(df: pd.DataFrame, price_col: str = 'close') -> pd.DataFrame:
        """Calculate daily and cumulative returns."""
        df = df.copy()
        df['daily_return'] = df[price_col].pct_change()
        df['cumulative_return'] = (1 + df['daily_return']).cumprod() - 1
        return df
    
    @staticmethod
    def calculate_volatility(df: pd.DataFrame, window: int = 20) -> pd.DataFrame:
        """Calculate rolling volatility."""
        df = df.copy()
        if 'daily_return' in df.columns:
            df['volatility'] = df['daily_return'].rolling(window=window).std() * np.sqrt(252)
        else:
            df['daily_return'] = df['close'].pct_change()
            df['volatility'] = df['daily_return'].rolling(window=window).std() * np.sqrt(252)
        return df
    
    @staticmethod
    def calculate_momentum(df: pd.DataFrame, windows: List[int] = [5, 10, 20]) -> pd.DataFrame:
        """Calculate momentum indicators over different windows."""
        df = df.copy()
        for window in windows:
            df[f'momentum_{window}'] = df['close'].pct_change(window)
            df[f'sma_{window}'] = df['close'].rolling(window=window).mean()
        return df
    
    @staticmethod
    def calculate_rsi(df: pd.DataFrame, window: int = 14) -> pd.DataFrame:
        """Calculate Relative Strength Index (RSI)."""
        df = df.copy()
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        return df
    
    @staticmethod
    def calculate_bollinger_bands(df: pd.DataFrame, window: int = 20, num_std: int = 2) -> pd.DataFrame:
        """Calculate Bollinger Bands."""
        df = df.copy()
        df['sma'] = df['close'].rolling(window=window).mean()
        df['std'] = df['close'].rolling(window=window).std()
        df['upper_band'] = df['sma'] + (df['std'] * num_std)
        df['lower_band'] = df['sma'] - (df['std'] * num_std)
        df['bb_width'] = (df['upper_band'] - df['lower_band']) / df['sma']
        return df
    
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply all feature engineering steps."""
        logger.info("Engineering features...")
        df = self.calculate_returns(df)
        df = self.calculate_volatility(df)
        df = self.calculate_momentum(df)
        df = self.calculate_rsi(df)
        df = self.calculate_bollinger_bands(df)
        logger.info(f"Feature engineering complete. Features: {df.shape[1]}")
        return df
