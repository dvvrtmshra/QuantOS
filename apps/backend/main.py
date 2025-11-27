from utils import load_candles
from indicators import get_rsi

data = load_candles("BTC")
closes = [c["close"] for c in data]
print(get_rsi(closes))
