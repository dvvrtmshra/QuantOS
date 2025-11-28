import yfinance as yf

SYMBOL_MAP = {
    "BTC": "BTC-USD",
    "ETH": "ETH-USD",
    "TSLA": "TSLA",
    "AAPL": "AAPL",
    "NIFTY": "^NSEI",
    "SPX": "^GSPC",
}

def resolve_symbol(symbol: str):
    s = symbol.upper()
    return SYMBOL_MAP.get(s, s)

async def get_price(symbol: str):
    resolved = resolve_symbol(symbol)
    ticker = yf.Ticker(resolved)
    info = ticker.info

    price = info.get("regularMarketPrice")
    
    if price is None:
        price = info.get("previousClose")

    if price is None:
        raise ValueError(f"Price not found for symbol: {symbol}")

    return float(price)
