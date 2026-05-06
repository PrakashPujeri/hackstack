import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataLoader:
    """Handles loading and initial processing of financial datasets."""
    
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)
        self.datasets = {}
    
    def load_all_datasets(self) -> Dict[str, pd.DataFrame]:
        """Load all CSV datasets from the data directory."""
        logger.info(f"Loading datasets from {self.data_path}")
        
        csv_files = {
            'equity': 'equity_dataset.csv',
            'macro': 'macro_dataset.csv',
            'multi_asset': 'multi_asset_dataset.csv',
            'oil': 'oil_dataset.csv'
        }
        
        for name, filename in csv_files.items():
            file_path = self.data_path / filename
            if file_path.exists():
                try:
                    df = pd.read_csv(file_path)
                    self.datasets[name] = df
                    logger.info(f"Loaded {name}: {df.shape[0]} rows, {df.shape[1]} columns")
                except Exception as e:
                    logger.error(f"Error loading {filename}: {e}")
            else:
                logger.warning(f"File not found: {file_path}")
        
        return self.datasets
    
    def get_dataset(self, name: str) -> Optional[pd.DataFrame]:
        """Get a specific dataset by name."""
        return self.datasets.get(name)
    
    def preprocess_dataset(self, df: pd.DataFrame) -> pd.DataFrame:
        """Basic preprocessing: handle missing values and convert dates."""
        df = df.copy()
        
        # Try to identify date columns and convert them
        for col in df.columns:
            if 'date' in col.lower() or 'time' in col.lower():
                try:
                    df[col] = pd.to_datetime(df[col])
                except:
                    pass
        
        # Handle missing values
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].fillna(method='ffill').fillna(method='bfill')
        
        return df
