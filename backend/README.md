# RiskPilot Backend

FastAPI backend for the Hedge Fund Risk Modeling & Semi-Automated Trading System.

## Tech Stack

- **FastAPI** - Modern, fast web framework for building APIs
- **Pydantic** - Data validation using Python type annotations
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **SciPy** - Scientific computing
- **scikit-learn** - Machine learning utilities

## Features

- **Data Ingestion** - Load and preprocess financial datasets from CSV files
- **Feature Engineering** - Calculate volatility, momentum, RSI, Bollinger Bands
- **Portfolio Management** - Track positions, constraints, and allocations
- **Risk Modeling** - Calculate VaR, drawdown, volatility, Sharpe ratio, Alpha, Beta
- **Trading Engine** - Generate rule-based trading signals with explainable rationale
- **Risk-Aware Position Sizing** - Adjust position sizes based on volatility and risk tolerance
- **Transaction Costs & Slippage** - Realistic trade simulation
- **Trade Logging** - Complete audit trail with explanations

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create environment file:
```bash
copy .env.example .env
```

6. Update `.env` with your configuration:
```
API_HOST=0.0.0.0
API_PORT=8000
DATA_PATH=../data/raw
```

## Running the Server

Start the development server:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or using the main.py file:
```bash
python app/main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Portfolio
- `GET /api/portfolio/overview` - Get portfolio overview
- `GET /api/portfolio/performance` - Get performance data
- `GET /api/portfolio/allocation` - Get current allocation
- `POST /api/portfolio/constraints` - Update constraints
- `GET /api/portfolio/constraints` - Get current constraints

### Risk
- `GET /api/risk/metrics` - Get all risk metrics
- `GET /api/risk/var` - Get Value at Risk
- `GET /api/risk/drawdown` - Get drawdown metrics

### Trading
- `GET /api/trading/signals` - Get trading signals
- `GET /api/trading/trades` - Get trade history
- `POST /api/trading/execute` - Execute a trade

### Data
- `GET /api/data/market` - Get market data
- `GET /api/data/features` - Get engineered features

### API Keys
- `GET /api/keys` - Get all API keys
- `POST /api/keys` - Add a new API key
- `DELETE /api/keys/{key_id}` - Delete an API key

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── models/              # Pydantic models
│   │   ├── portfolio.py
│   │   ├── risk.py
│   │   └── trading.py
│   ├── routers/             # API route handlers
│   │   ├── portfolio.py
│   │   ├── risk.py
│   │   ├── trading.py
│   │   ├── data.py
│   │   └── keys.py
│   └── services/            # Business logic
│       ├── data_loader.py
│       ├── feature_engineering.py
│       ├── portfolio.py
│       ├── risk.py
│       └── trading.py
├── requirements.txt
├── .env.example
└── README.md
```

## Data Format

The system expects CSV files in the `data/raw` directory:
- `equity_dataset.csv` - Equity market data
- `macro_dataset.csv` - Macroeconomic indicators
- `multi_asset_dataset.csv` - Multi-asset data
- `oil_dataset.csv` - Oil/commodity data

Each CSV should contain columns such as:
- Date/Timestamp
- Price (open, high, low, close)
- Volume
- Other relevant financial indicators

## Risk Metrics Explained

- **Value at Risk (VaR)** - Maximum potential loss at a given confidence level
- **Maximum Drawdown** - Largest peak-to-trough decline
- **Volatility** - Annualized standard deviation of returns
- **Sharpe Ratio** - Risk-adjusted return measure
- **Sortino Ratio** - Downside risk-adjusted return
- **Beta** - Sensitivity to market movements
- **Alpha** - Excess return over market benchmark

## Trading Strategy

The system uses a rule-based strategy with the following signals:
1. **Momentum** - Buy when momentum turns positive, sell when negative
2. **RSI** - Buy when oversold (<30), sell when overbought (>70)
3. **Volatility** - Buy when volatility is below risk tolerance

All signals include explainable rationale for transparency.

## License

Part of the RiskPilot AI project for Code2Create Challenge.
