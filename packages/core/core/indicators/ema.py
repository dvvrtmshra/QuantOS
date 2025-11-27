def ema(values, period=10):
    k = 2 / (period + 1)
    e = values[0]
    for v in values[1:]:
        e = (v * k) + (e * (1 - k))
    return e
