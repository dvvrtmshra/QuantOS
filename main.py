"""
Stock & Financial Data Analysis Dashboard (MAIN FILE)
---------------------------------------------------
This script:
1. Fetches stock data using yfinance
2. Calculates RSI & MACD indicators
3. Plots closing price graph
"""

import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ---------------------------------------------
# 1) Fetch Stock Data
# ---------------------------------------------
def get_stock_data(ticker: str, period="1y"):
    data = yf.download(ticker, period=period)
    return data

# ---------------------------------------------
# 2) Calculate RSI
# ---------------------------------------------
def calculate_rsi(data: pd.DataFrame, window: int = 14):
    delta = data['Close'].diff().values.flatten()
    gain = np.where(delta > 0, delta, 0).flatten()
    loss = np.where(delta < 0, -delta, 0).flatten()

    avg_gain = pd.Series(gain).rolling(window=window).mean()
    avg_loss = pd.Series(loss).rolling(window=window).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    data['RSI'] = rsi
    return data

# ---------------------------------------------
# 3) Calculate MACD
# ---------------------------------------------
def calculate_macd(data: pd.DataFrame):
    short_ema = data['Close'].ewm(span=12, adjust=False).mean()
    long_ema = data['Close'].ewm(span=26, adjust=False).mean()

    macd = short_ema - long_ema
    signal = macd.ewm(span=9, adjust=False).mean()

    data['MACD'] = macd
    data['Signal'] = signal
    return data

# ---------------------------------------------
# 4) Plot Close Price
# ---------------------------------------------
def plot_close_price(data: pd.DataFrame, ticker: str):
    plt.figure(figsize=(10, 4))
    plt.plot(data['Close'])
    plt.title(f"{ticker} Close Price")
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.tight_layout()
    plt.show()

# ---------------------------------------------
# MAIN EXECUTION
# ---------------------------------------------
if __name__ == "__main__":
    ticker = "INFY.NS"  # change this to any ticker
    data = get_stock_data(ticker)
    data = calculate_rsi(data)
    data = calculate_macd(data)

    print(data.tail())
    plot_close_price(data, ticker)
