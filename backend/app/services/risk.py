import numpy as np
import pandas as pd
from typing import Dict, List
from scipy import stats
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RiskManager:
    """Calculates risk metrics for the portfolio."""
    
    @staticmethod
    def calculate_var(returns: pd.Series, confidence: float = 0.95) -> float:
        """Calculate Value at Risk (VaR) using historical simulation."""
        if len(returns) == 0:
            return 0.0
        return np.percentile(returns, (1 - confidence) * 100)
    
    @staticmethod
    def calculate_max_drawdown(values: pd.Series) -> float:
        """Calculate maximum drawdown."""
        if len(values) == 0:
            return 0.0
        
        peak = values.expanding(min_periods=1).max()
        drawdown = (values - peak) / peak
        return abs(drawdown.min())
    
    @staticmethod
    def calculate_volatility(returns: pd.Series, annualize: bool = True) -> float:
        """Calculate volatility (standard deviation of returns)."""
        if len(returns) < 2:
            return 0.0
        
        vol = returns.std()
        if annualize:
            vol = vol * np.sqrt(252)  # Assuming daily returns
        return vol
    
    @staticmethod
    def calculate_sharpe_ratio(returns: pd.Series, risk_free_rate: float = 0.02) -> float:
        """Calculate Sharpe Ratio."""
        if len(returns) < 2 or returns.std() == 0:
            return 0.0
        
        excess_returns = returns - risk_free_rate / 252
        return np.sqrt(252) * excess_returns.mean() / returns.std()
    
    @staticmethod
    def calculate_sortino_ratio(returns: pd.Series, risk_free_rate: float = 0.02) -> float:
        """Calculate Sortino Ratio (downside deviation)."""
        if len(returns) < 2:
            return 0.0
        
        excess_returns = returns - risk_free_rate / 252
        downside_returns = excess_returns[excess_returns < 0]
        
        if len(downside_returns) == 0:
            return 0.0
        
        downside_deviation = downside_returns.std()
        if downside_deviation == 0:
            return 0.0
        
        return np.sqrt(252) * excess_returns.mean() / downside_deviation
    
    @staticmethod
    def calculate_beta(portfolio_returns: pd.Series, market_returns: pd.Series) -> float:
        """Calculate Beta (portfolio sensitivity to market)."""
        if len(portfolio_returns) < 2 or len(market_returns) < 2:
            return 1.0
        
        covariance = np.cov(portfolio_returns, market_returns)[0, 1]
        market_variance = market_returns.var()
        
        if market_variance == 0:
            return 1.0
        
        return covariance / market_variance
    
    @staticmethod
    def calculate_alpha(portfolio_returns: pd.Series, market_returns: pd.Series, 
                       risk_free_rate: float = 0.02, beta: float = 1.0) -> float:
        """Calculate Alpha (excess return over market)."""
        if len(portfolio_returns) < 2:
            return 0.0
        
        portfolio_annual_return = portfolio_returns.mean() * 252
        market_annual_return = market_returns.mean() * 252
        
        alpha = portfolio_annual_return - (risk_free_rate + beta * (market_annual_return - risk_free_rate))
        return alpha
    
    def calculate_all_metrics(self, portfolio_values: pd.Series, market_values: pd.Series = None) -> Dict:
        """Calculate all risk metrics."""
        returns = portfolio_values.pct_change().dropna()
        
        metrics = {
            'var': self.calculate_var(returns, 0.95),
            'var_confidence': 0.95,
            'max_drawdown': self.calculate_max_drawdown(portfolio_values),
            'current_drawdown': self.calculate_max_drawdown(portfolio_values.tail(30)),
            'volatility': self.calculate_volatility(returns),
            'sharpe_ratio': self.calculate_sharpe_ratio(returns),
            'sortino_ratio': self.calculate_sortino_ratio(returns),
            'beta': 1.0,
            'alpha': 0.0
        }
        
        if market_values is not None:
            market_returns = market_values.pct_change().dropna()
            if len(market_returns) > 0 and len(returns) > 0:
                min_len = min(len(returns), len(market_returns))
                metrics['beta'] = self.calculate_beta(returns.tail(min_len), market_returns.tail(min_len))
                metrics['alpha'] = self.calculate_alpha(returns.tail(min_len), market_returns.tail(min_len))
        
        return metrics
