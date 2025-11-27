from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils import load_candles
from indicators import get_rsi
from forecast import price_forecast

app = FastAPI(title="QuantOS API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "service": "QuantOS"}

@app.get("/candles")
def candles(symbol: str = "BTC"):
    return load_candles(symbol)

@app.get("/rsi")
def rsi(symbol: str = "BTC", period: int = 14):
    candles = load_candles(symbol)
    closes = [c["close"] for c in candles]
    return {"symbol": symbol, "rsi": get_rsi(closes, period)}

@app.get("/forecast")
def forecast(symbol: str = "BTC"):
    candles = load_candles(symbol)
    closes = [c["close"] for c in candles]
    return price_forecast(closes)
