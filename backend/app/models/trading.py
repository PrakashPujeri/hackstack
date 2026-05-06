from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TradingSignal(BaseModel):
    asset: str
    signal: str  # BUY, SELL, HOLD
    confidence: float
    rationale: str
    timestamp: datetime


class Trade(BaseModel):
    id: str
    date: str
    asset: str
    signal: str
    quantity: float
    price: float
    total_value: float
    rationale: str
    transaction_cost: float
    slippage: float
