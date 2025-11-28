from fastapi import APIRouter
from services.market_service import get_price

router = APIRouter(prefix="/price", tags=["Price"])

@router.get("/")
async def price(symbol: str):
    value = await get_price(symbol)
    return {"symbol": symbol, "price": value}
