from pydantic import BaseModel


class RiskMetrics(BaseModel):
    var: float
    var_confidence: float
    max_drawdown: float
    current_drawdown: float
    volatility: float
    sharpe_ratio: float
    sortino_ratio: float
    beta: float
    alpha: float
