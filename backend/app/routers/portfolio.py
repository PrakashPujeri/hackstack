from fastapi import APIRouter, HTTPException
from typing import Dict, List
from app.models.portfolio import PortfolioConstraints, PortfolioOverview, PortfolioAllocation
from app.services.portfolio import PortfolioManager
from app.services.data_loader import DataLoader
from app.services.feature_engineering import FeatureEngineering
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

# Global portfolio manager instance
portfolio_manager = None
constraints = PortfolioConstraints()


@router.get("/overview", response_model=Dict)
async def get_portfolio_overview():
    """Get current portfolio overview."""
    global portfolio_manager
    
    if portfolio_manager is None:
        # Initialize with default constraints
        portfolio_manager = PortfolioManager(constraints)
    
    return portfolio_manager.get_overview()


@router.get("/performance")
async def get_portfolio_performance():
    """Get portfolio performance data."""
    # Mock performance data for now
    return {
        "monthly_returns": [
            {"month": "Jan", "return": 0.025, "benchmark": 0.018},
            {"month": "Feb", "return": 0.032, "benchmark": 0.021},
            {"month": "Mar", "return": 0.018, "benchmark": 0.015},
            {"month": "Apr", "return": 0.041, "benchmark": 0.028},
            {"month": "May", "return": 0.029, "benchmark": 0.022},
        ],
        "cumulative_returns": [
            {"date": "2024-01", "cumulative_return": 0, "drawdown": 0},
            {"date": "2024-02", "cumulative_return": 0.05, "drawdown": -0.02},
            {"date": "2024-03", "cumulative_return": 0.08, "drawdown": -0.01},
            {"date": "2024-04", "cumulative_return": 0.12, "drawdown": -0.03},
            {"date": "2024-05", "cumulative_return": 0.15, "drawdown": -0.05},
        ]
    }


@router.get("/allocation")
async def get_portfolio_allocation():
    """Get current portfolio allocation across all asset classes."""
    global portfolio_manager
    
    if portfolio_manager is None:
        portfolio_manager = PortfolioManager(constraints)
    
    allocation = portfolio_manager.get_allocation()
    
    # Enhanced allocation with asset class categorization
    detailed_allocation = []
    for asset, percentage in allocation.items():
        if percentage > 0:
            asset_class = "Unknown"
            if asset.lower() in ['equity', 'stocks', 'aapl', 'msft', 'googl']:
                asset_class = "Equities"
            elif asset.lower() in ['bonds', 'treasury']:
                asset_class = "Fixed Income"
            elif asset.lower() in ['oil', 'gold', 'commodities']:
                asset_class = "Commodities"
            elif asset == 'cash':
                asset_class = "Cash"
            
            detailed_allocation.append({
                "name": f"{asset} ({asset_class})",
                "value": percentage * portfolio_manager.total_value,
                "percentage": percentage,
                "asset_class": asset_class
            })
    
    # Add target allocation for comparison
    target_allocation = [
        {"name": "Equities (Target)", "value": 0.4 * portfolio_manager.total_value, "percentage": 0.4, "asset_class": "Equities"},
        {"name": "Bonds (Target)", "value": 0.3 * portfolio_manager.total_value, "percentage": 0.3, "asset_class": "Fixed Income"},
        {"name": "Commodities (Target)", "value": 0.2 * portfolio_manager.total_value, "percentage": 0.2, "asset_class": "Commodities"},
        {"name": "Cash (Target)", "value": 0.1 * portfolio_manager.total_value, "percentage": 0.1, "asset_class": "Cash"},
    ]
    
    return {
        "current_allocation": detailed_allocation,
        "target_allocation": target_allocation,
        "allocation_drift": self._calculate_allocation_drift(detailed_allocation, target_allocation)
    }

def _calculate_allocation_drift(current_allocation, target_allocation):
    """Calculate drift from target allocation."""
    drift = 0.0
    for current in current_allocation:
        asset_class = current.get('asset_class')
        target_pct = next((t['percentage'] for t in target_allocation if t['asset_class'] == asset_class), 0)
        drift += abs(current['percentage'] - target_pct)
    
    return drift / len(target_allocation) if target_allocation else 0


@router.post("/constraints")
async def update_constraints(new_constraints: PortfolioConstraints):
    """Update portfolio constraints."""
    global portfolio_manager, constraints
    
    constraints = new_constraints
    
    # Reinitialize portfolio manager with new constraints
    portfolio_manager = PortfolioManager(constraints)
    
    logger.info(f"Updated constraints: {new_constraints}")
    return {"message": "Constraints updated successfully"}


@router.get("/constraints")
async def get_constraints():
    """Get current portfolio constraints."""
    return constraints.dict()
