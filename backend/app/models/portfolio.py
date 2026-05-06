from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime


class PortfolioConstraints(BaseModel):
    initial_capital: float = 1000000.0
    max_position_size: float = 0.2
    risk_tolerance: float = 0.15
    max_drawdown_limit: float = 0.2
    transaction_cost: float = 0.001
    slippage: float = 0.0005


class PortfolioOverview(BaseModel):
    total_value: float
    total_return: float
    annualized_return: float
    cash_balance: float
    positions: Dict[str, float]


class PortfolioAllocation(BaseModel):
    asset: str
    value: float
    percentage: float


class Position(BaseModel):
    asset: str
    quantity: float
    avg_price: float
    current_price: float
    total_value: float
