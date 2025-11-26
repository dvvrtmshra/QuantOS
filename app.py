import streamlit as st
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

st.set_page_config(page_title="Finance Dashboard", layout="wide")

# -------------------------------
# Fetch Stock Data
# -------------------------------
def get_stock_data(ticker: str, period="1y"):
    return yf.download(ticker, period=period)

# -------------------------------
# Calculate RSI
# -------------------------------
def calculate_rsi(data: pd.DataFrame, window: int = 14):
    delta = data['Close'].diff().values.flatten()
    gain = np.where(delta > 0, delta, 0).flatten()
    loss = np.where(delta < 0, -delta, 0).flatten()

    avg_gain = pd.Series(gain).rolling(window=window).mean()
    avg_loss = pd.Series(loss).rolling(window=window).mean()

    rs = avg_gain / avg_loss
    data['RSI'] = 100 - (100 / (1 + rs))
    return data

# -------------------------------
# Calculate MACD
# -------------------------------
def calculate_macd(data: pd.DataFrame):
    short_ema = data['Close'].ewm(span=12, adjust=False).mean()
    long_ema = data['Close'].ewm(span=26, adjust=False).mean()
    macd = short_ema - long_ema
    signal = macd.ewm(span=9, adjust=False).mean()
    data['MACD'] = macd
    data['Signal'] = signal
    return data

# -------------------------------
# Streamlit UI
# -------------------------------
st.title("📈 Stock Analysis Dashboard")

ticker = st.text_input("Enter Stock Ticker (Example: AAPL, TSLA, INFY.NS)", "AAPL")
period = st.selectbox("Select Period", ["6mo", "1y", "2y", "5y"], index=1)

if st.button("Fetch Data"):
    data = get_stock_data(ticker, period)
    if data.empty:
        st.error("Invalid ticker or no data available.")
    else:
        data = calculate_rsi(data)
        data = calculate_macd(data)

        st.subheader(f"Price Chart — {ticker}")
        fig, ax = plt.subplots(figsize=(12, 4))
        ax.plot(data['Close'])
        st.pyplot(fig)

        st.subheader("RSI Chart")
        fig2, ax2 = plt.subplots(figsize=(12, 3))
        ax2.plot(data['RSI'])
        ax2.axhline(70, color='r', linestyle='--')
        ax2.axhline(30, color='g', linestyle='--')
        st.pyplot(fig2)

        st.subheader("MACD Chart")
        fig3, ax3 = plt.subplots(figsize=(12, 3))
        ax3.plot(data['MACD'], label='MACD')
        ax3.plot(data['Signal'], label='Signal')
        ax3.legend()
        st.pyplot(fig3)

        st.success("Data Loaded Successfully!")
