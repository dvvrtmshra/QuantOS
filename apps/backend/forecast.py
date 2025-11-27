def price_forecast(prices):
    last = prices[-1]
    return {
        "next_price": last * 1.01,
        "confidence": 0.55
    }
