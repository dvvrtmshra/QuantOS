from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils import load_candles
from indicators import get_rsi
from forecast import price_forecast


app = FastAPI(title="QuantOS API")


# ------------------------------------------------
# CORS (Required for frontend requests)
# ------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
def get_candles(symbol: str = "BTC"):
    """
    Return normalized candle data for frontend chart.
    Your candle structure is:
    {
        "time": int,
        "open": ...,
        "high": ...,
        "low": ...,
        "close": ...
    }
    We convert to:
    {
        "timestamp": str,
        "open": ...,
        "high": ...,
        "low": ...,
        "close": ...
    }
    """
    raw = load_candles(symbol)

    formatted = []
    for c in raw:
        formatted.append({
            "timestamp": str(c["time"]),  # FRONTEND FRIENDLY
            "open": c["open"],
            "high": c["high"],
            "low": c["low"],
            "close": c["close"],
        })

    return formatted


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
# Forecast Endpoint
# ------------------------------------------------
@app.get("/forecast")
def get_forecast(symbol: str = "BTC"):
    data = load_candles(symbol)
    closes = [c["close"] for c in data]
    return price_forecast(closes)
