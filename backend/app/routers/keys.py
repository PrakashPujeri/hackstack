from fastapi import APIRouter, HTTPException
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/keys", tags=["api-keys"])

# In-memory storage for demo (in production, use secure storage)
api_keys = [
    {"id": 1, "name": "Alpha Vantage", "key": "av_************************", "last_used": "2 hours ago"},
    {"id": 2, "name": "Yahoo Finance", "key": "yf_************************", "last_used": "1 day ago"},
]


@router.get("")
async def get_api_keys():
    """Get all API keys."""
    return api_keys


@router.post("")
async def add_api_key(key_data: Dict):
    """Add a new API key."""
    new_key = {
        "id": len(api_keys) + 1,
        "name": key_data.get("name", "Unknown"),
        "key": f"{key_data.get('name', 'unknown').lower()[:3]}_{'*' * 20}",
        "last_used": "Never"
    }
    api_keys.append(new_key)
    logger.info(f"Added API key: {new_key['name']}")
    return new_key


@router.delete("/{key_id}")
async def delete_api_key(key_id: int):
    """Delete an API key."""
    global api_keys
    api_keys = [k for k in api_keys if k["id"] != key_id]
    logger.info(f"Deleted API key with ID: {key_id}")
    return {"message": "API key deleted successfully"}
