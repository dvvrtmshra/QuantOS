def sma(values, period=10):
    if len(values) < period:
        return None
    return sum(values[-period:]) / period
