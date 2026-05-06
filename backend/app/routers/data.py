from fastapi import APIRouter, Query
from typing import Dict, Optional
from app.services.data_loader import DataLoader
from app.services.feature_engineering import FeatureEngineering
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/data", tags=["data"])

data_loader = DataLoader("../data/raw")


@router.get("/market")
async def get_market_data(
    dataset: Optional[str] = Query(None, description="Dataset name (equity, macro, multi_asset, oil)")
):
    """Get market data from specified dataset."""
    datasets = data_loader.load_all_datasets()
    
    if dataset:
        if dataset in datasets:
            df = data_loader.preprocess_dataset(datasets[dataset])
            return {
                "dataset": dataset,
                "rows": len(df),
                "columns": list(df.columns),
                "data": df.head(100).to_dict(orient="records")
            }
        else:
            return {"error": f"Dataset {dataset} not found"}
    else:
        return {
            "datasets": {
                name: {
                    "rows": len(df),
                    "columns": list(df.columns)
                }
                for name, df in datasets.items()
            }
        }


@router.get("/features")
async def get_features():
    """Get engineered features from datasets."""
    datasets = data_loader.load_all_datasets()
    feature_engineer = FeatureEngineering()
    
    features_summary = {}
    
    for name, df in datasets.items():
        if len(df) > 0:
            df = data_loader.preprocess_dataset(df)
            df = feature_engineer.engineer_features(df)
            
            features_summary[name] = {
                "rows": len(df),
                "features": list(df.columns),
                "sample": df.tail(5).to_dict(orient="records")
            }
    
    return features_summary
