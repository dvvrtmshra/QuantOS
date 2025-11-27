from core.indicators.rsi import rsi


def get_rsi(closes, period=14):
    return rsi(closes, period)
