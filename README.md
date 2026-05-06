# Hedge Fund Risk Modeling & Semi-Automated Trading System

## Team Information
- **Team Name**: RiskPilot AI
- **Year**: 2026
- **All-Female Team**: No

## Architecture Overview

#### Our approach combines a modern React frontend with a FastAPI backend to deliver a comprehensive hedge fund risk modeling and trading system.

    - **Data Ingestion**: The system ingests multiple CSV datasets (equity, macro, multi-asset, oil) through a robust data pipeline that handles missing values, outliers, and date conversions. The DataLoader service preprocesses all data before feature engineering.

    - **Risk Modeling**: We implement comprehensive risk metrics including Value at Risk (VaR) at 95% and 99% confidence levels, maximum drawdown tracking, volatility calculations, and performance ratios (Sharpe, Sortino). These metrics are integrated into the trading decision pipeline to enforce position size limits and drawdown constraints.

    - **Semi-Automated Trading**: Our rule-based strategy generates explainable signals using momentum indicators, RSI, and volatility thresholds. The trading engine implements risk-aware position sizing using Kelly Criterion-inspired methods, while simulating realistic transaction costs (0.1%) and slippage (0.05%). All trades are logged with clear rationale.

    - **Dashboard Design**: The React dashboard provides real-time insights with interactive charts (cumulative returns, drawdown, allocation pie charts), key metric cards, and comprehensive risk metrics. The dark/light mode interface includes API key management, portfolio constraints configuration, and detailed trade history with filtering capabilities.

**Note:** Please do not change the format or spelling of anything in this README. The fields are extracted using a script, so any changes to the structure or formatting may break the extraction process.
