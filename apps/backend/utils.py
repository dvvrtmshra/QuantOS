import random

def load_candles(symbol: str):
    price = 20000
    result = []
    for t in range(100):
        o = price + random.randint(-30, 30)
        c = o + random.randint(-50, 50)
        h = max(o, c) + random.randint(0, 45)
        l = min(o, c) - random.randint(0, 45)
        price = c
        result.append({
            "time": t,
            "open": o,
            "high": h,
            "low": l,
            "close": c
        })
    return result
