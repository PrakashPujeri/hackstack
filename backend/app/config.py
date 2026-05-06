from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    data_path: str = "../data/raw"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
