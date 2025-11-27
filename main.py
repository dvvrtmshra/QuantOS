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
# 4) Calculate Simple and Exponential Moving Average
# ---------------------------------------------
def calculate_moving_averages(data: pd.DataFrame):
    data["SMA20"] = data["Close"].rolling(window=20).mean()
    data["SMA50"] = data["Close"].rolling(window=50).mean()
    data["EMA20"] = data["Close"].ewm(span=20, adjust=False).mean()
    data["EMA50"] = data["Close"].ewm(span=50, adjust=False).mean()
    return data


# ---------------------------------------------
# 5) Calculate Bollinger Bands
# ---------------------------------------------
def calculate_bollinger(data: pd.DataFrame, window: int = 20):
    sma = data["Close"].rolling(window=window).mean()
    std = data["Close"].rolling(window=window).std()

    data["BB_MID"] = sma
    data["BB_UPPER"] = sma + (2 * std)
    data["BB_LOWER"] = sma - (2 * std)
    return data


# ---------------------------------------------
# 6) Calculate VWAP
# ---------------------------------------------
def calculate_vwap(data: pd.DataFrame):
    price_volume = (data["Close"] * data["Volume"]).cumsum()
    cumulative_volume = data["Volume"].cumsum()
    data["VWAP"] = price_volume / cumulative_volume
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
    ticker = "AAPL"
    data = get_stock_data(ticker)

    data = calculate_rsi(data)
    data = calculate_macd(data)
    data = calculate_moving_averages(data)
    data = calculate_bollinger(data)
    data = calculate_vwap(data)

    print(data.tail())
    plot_close_price(data, ticker)

