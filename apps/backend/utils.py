import yfinance as yf

def load_candles(symbol: str, period: str = "1mo", interval: str = "1d"):
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period, interval=interval)

    df.reset_index(inplace=True)

    candles = []
    for _, row in df.iterrows():
        candles.append({
            "time": int(row["Date"].timestamp()),   # UNIX seconds
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
        })

    return candles
