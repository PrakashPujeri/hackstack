from typing import Dict, List, Optional
from datetime import datetime
import logging
from app.models.portfolio import PortfolioConstraints, Position

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PortfolioManager:
    """Manages portfolio state, positions, and constraints."""
    
    def __init__(self, constraints: PortfolioConstraints):
        self.constraints = constraints
        self.initial_capital = constraints.initial_capital
        self.cash = constraints.initial_capital
        self.positions: Dict[str, Position] = {}
        self.total_value = constraints.initial_capital
        self.peak_value = constraints.initial_capital
        self.current_drawdown = 0.0
        
    def update_position(self, asset: str, quantity: float, price: float, signal: str) -> bool:
        """Update a position based on a trade signal."""
        trade_value = quantity * price
        transaction_cost = trade_value * self.constraints.transaction_cost
        slippage = trade_value * self.constraints.slippage
        total_cost = trade_value + transaction_cost + slippage
        
        if signal == 'BUY':
            if self.cash >= total_cost:
                self.cash -= total_cost
                if asset in self.positions:
                    # Update existing position
                    old_qty = self.positions[asset].quantity
                    old_avg = self.positions[asset].avg_price
                    new_qty = old_qty + quantity
                    new_avg = ((old_qty * old_avg) + (quantity * price)) / new_qty
                    self.positions[asset] = Position(
                        asset=asset,
                        quantity=new_qty,
                        avg_price=new_avg,
                        current_price=price,
                        total_value=new_qty * price
                    )
                else:
                    # New position
                    self.positions[asset] = Position(
                        asset=asset,
                        quantity=quantity,
                        avg_price=price,
                        current_price=price,
                        total_value=quantity * price
                    )
                logger.info(f"BUY {asset}: {quantity} @ ${price:.2f}")
                return True
            else:
                logger.warning(f"Insufficient cash for BUY {asset}")
                return False
                
        elif signal == 'SELL':
            if asset in self.positions and self.positions[asset].quantity >= quantity:
                self.cash += total_cost
                old_qty = self.positions[asset].quantity
                new_qty = old_qty - quantity
                if new_qty > 0:
                    self.positions[asset] = Position(
                        asset=asset,
                        quantity=new_qty,
                        avg_price=self.positions[asset].avg_price,
                        current_price=price,
                        total_value=new_qty * price
                    )
                else:
                    del self.positions[asset]
                logger.info(f"SELL {asset}: {quantity} @ ${price:.2f}")
                return True
            else:
                logger.warning(f"Cannot SELL {asset}: insufficient position")
                return False
        
        return False
    
    def update_prices(self, prices: Dict[str, float]):
        """Update current prices for all positions."""
        for asset, position in self.positions.items():
            if asset in prices:
                position.current_price = prices[asset]
                position.total_value = position.quantity * prices[asset]
        
        self._recalculate_total_value()
    
    def _recalculate_total_value(self):
        """Recalculate total portfolio value."""
        positions_value = sum(pos.total_value for pos in self.positions.values())
        self.total_value = self.cash + positions_value
        
        # Update peak and drawdown
        if self.total_value > self.peak_value:
            self.peak_value = self.total_value
        
        if self.peak_value > 0:
            self.current_drawdown = (self.peak_value - self.total_value) / self.peak_value
    
    def get_allocation(self) -> Dict[str, float]:
        """Get current portfolio allocation."""
        allocation = {}
        total = self.total_value
        
        for asset, position in self.positions.items():
            allocation[asset] = position.total_value / total if total > 0 else 0
        
        allocation['cash'] = self.cash / total if total > 0 else 0
        return allocation
    
    def check_constraints(self) -> bool:
        """Check if portfolio respects all constraints."""
        # Check position size limits
        for asset, position in self.positions.items():
            position_pct = position.total_value / self.total_value if self.total_value > 0 else 0
            if position_pct > self.constraints.max_position_size:
                logger.warning(f"Position {asset} exceeds max size: {position_pct:.2%}")
                return False
        
        # Check drawdown limit
        if self.current_drawdown > self.constraints.max_drawdown_limit:
            logger.warning(f"Drawdown exceeds limit: {self.current_drawdown:.2%}")
            return False
        
        return True
    
    def get_overview(self):
        """Get portfolio overview."""
        total_return = (self.total_value - self.initial_capital) / self.initial_capital
        return {
            'total_value': self.total_value,
            'total_return': total_return,
            'annualized_return': total_return,  # Simplified
            'cash_balance': self.cash,
            'positions': {k: v.dict() for k, v in self.positions.items()}
        }
