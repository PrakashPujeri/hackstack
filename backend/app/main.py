from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import portfolio, risk, trading, data, keys
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RiskPilot API",
    description="Hedge Fund Risk Modeling & Semi-Automated Trading System API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(portfolio.router)
app.include_router(risk.router)
app.include_router(trading.router)
app.include_router(data.router)
app.include_router(keys.router)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "RiskPilot API",
        "version": "1.0.0",
        "description": "Hedge Fund Risk Modeling & Semi-Automated Trading System",
        "endpoints": {
            "portfolio": "/api/portfolio",
            "risk": "/api/risk",
            "trading": "/api/trading",
            "data": "/api/data",
            "api-keys": "/api/keys"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True
    )
