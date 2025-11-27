from core.indicators.sma import sma

def signal(prices, lookback=20):
    avg = sma(prices, lookback)
    if prices[-1] < avg:
        return "BUY"
    if prices[-1] > avg:
        return "SELL"
    return "HOLD"
