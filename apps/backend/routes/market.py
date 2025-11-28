from fastapi import APIRouter
from services.market_service import get_ohlc

router = APIRouter(prefix="/market", tags=["Market"])

@router.get("/history")
async def history(symbol: str, range: str = "1y"):
    return await get_ohlc(symbol, range)
