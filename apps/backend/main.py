from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils import load_candles
from datetime import datetime
from indicators import get_rsi
from forecast import forecast_prices

from routes.price import router as price_router


app = FastAPI(title="QuantOS API")

# ------------------------------------------------
# CORS
# ------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------
# INCLUDE ROUTES
# ------------------------------------------------
app.include_router(price_router)

# ------------------------------------------------
# Health Check
# ------------------------------------------------
@app.get("/")
def health():
    return {"status": "ok", "service": "QuantOS"}


# ------------------------------------------------
# Candle Endpoint
# ------------------------------------------------
@app.get("/candles")
def get_candles(symbol: str, period: str = "1mo", interval: str = "1d"):
    candles = load_candles(symbol, period, interval)
    return candles



# ------------------------------------------------
# RSI Endpoint
# ------------------------------------------------
@app.get("/rsi")
def get_rsi_api(symbol: str = "BTC", period: int = 14):
    data = load_candles(symbol)
    closes = [c["close"] for c in data]
    value = get_rsi(closes, period)
    return {"symbol": symbol, "period": period, "rsi": value}


# ------------------------------------------------
# Forecast Endpoint (ML-based)
# ------------------------------------------------
@app.get("/forecast")
def get_forecast(symbol: str, horizon: int = 30):
    """
    Return ML-based forecast:
    - symbol: ticker
    - horizon: days ahead (default 30)
    """
    return forecast_prices(symbol, horizon)

