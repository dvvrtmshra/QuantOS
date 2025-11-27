import streamlit as st
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

st.set_page_config(page_title="Finance Dashboard", layout="wide")

# ==========================================================
# 1️⃣ Data Fetching
# ==========================================================
def get_stock_data(ticker: str, period="1y"):
    return yf.download(ticker, period=period)


# ==========================================================
# 2️⃣ RSI Calculation
# ==========================================================
def calculate_rsi(data: pd.DataFrame, window: int = 14):
    delta = data['Close'].diff().values.flatten()

    gain = np.where(delta > 0, delta, 0).flatten()
    loss = np.where(delta < 0, -delta, 0).flatten()

    avg_gain = pd.Series(gain).rolling(window).mean()
    avg_loss = pd.Series(loss).rolling(window).mean()

    rs = avg_gain / avg_loss
    data['RSI'] = 100 - (100 / (1 + rs))
    return data


# ==========================================================
# 3️⃣ MACD Calculation
# ==========================================================
def calculate_macd(data: pd.DataFrame):
    short_ema = data['Close'].ewm(span=12, adjust=False).mean()
    long_ema = data['Close'].ewm(span=26, adjust=False).mean()

    macd = short_ema - long_ema
    signal = macd.ewm(span=9, adjust=False).mean()

    data['MACD'] = macd
    data['Signal'] = signal
    return data


# ==========================================================
# 4️⃣ Moving Averages (SMA/EMA)
# ==========================================================
def calculate_moving_averages(data: pd.DataFrame):
    data["SMA20"] = data["Close"].rolling(window=20).mean()
    data["SMA50"] = data["Close"].rolling(window=50).mean()
    data["EMA20"] = data["Close"].ewm(span=20, adjust=False).mean()
    data["EMA50"] = data["Close"].ewm(span=50, adjust=False).mean()
    return data


# ==========================================================
# 5️⃣ Bollinger Bands
# ==========================================================
def calculate_bollinger(data: pd.DataFrame, window: int = 20):
    sma = data["Close"].rolling(window=window).mean()
    std = data["Close"].rolling(window=window).std()

    data["BB_MID"] = sma
    data["BB_UPPER"] = sma + (2 * std)
    data["BB_LOWER"] = sma - (2 * std)
    return data


# ==========================================================
# 6️⃣ VWAP
# ==========================================================
def calculate_vwap(data: pd.DataFrame):
    price_volume = (data["Close"] * data["Volume"]).cumsum()
    cumulative_volume = data["Volume"].cumsum()
    data["VWAP"] = price_volume / cumulative_volume
    return data


# ==========================================================
# UI
# ==========================================================
st.title("📊 Financial Stock Analysis Dashboard")

ticker = st.text_input("🔍 Enter Stock Ticker (Ex: AAPL, TSLA, INFY.NS)", "AAPL")
period = st.selectbox("⏱️ Select Period", ["6mo", "1y", "2y", "5y"], index=1)

if st.button("Analyze"):

    data = get_stock_data(ticker, period)
    if data.empty:
        st.error("❌ Invalid ticker or no data available.")
    else:
        # Apply indicators
        data = calculate_rsi(data)
        data = calculate_macd(data)
        data = calculate_moving_averages(data)
        data = calculate_bollinger(data)
        data = calculate_vwap(data)

        st.success(f"✔ Data Loaded Successfully for {ticker}")

        # ==========================================================
        # PRICE CHART
        # ==========================================================
        st.subheader(f"📈 Price Chart — {ticker}")
        fig, ax = plt.subplots(figsize=(12, 4))
        ax.plot(data["Close"], label="Close Price")
        ax.set_ylabel("Price")
        ax.legend()
        st.pyplot(fig)

        # ==========================================================
        # SMA/EMA + Bollinger Bands
        # ==========================================================
        st.subheader("📊 Moving Averages + Bollinger Bands")
        fig2, ax2 = plt.subplots(figsize=(12, 4))
        ax2.plot(data["Close"], label="Close", alpha=0.8)
        ax2.plot(data["SMA20"], label="SMA20")
        ax2.plot(data["SMA50"], label="SMA50")
        ax2.plot(data["EMA20"], label="EMA20", linestyle="--")
        ax2.plot(data["EMA50"], label="EMA50", linestyle="--")
        ax2.plot(data["BB_UPPER"], label="BB Upper", alpha=0.3, color="red")
        ax2.plot(data["BB_LOWER"], label="BB Lower", alpha=0.3, color="green")
        ax2.legend()
        st.pyplot(fig2)

        # ==========================================================
        # RSI
        # ==========================================================
        st.subheader("📉 RSI Indicator")
        fig3, ax3 = plt.subplots(figsize=(12, 3))
        ax3.plot(data["RSI"], label="RSI", color="purple")
        ax3.axhline(70, linestyle="--", color="red", label="Overbought")
        ax3.axhline(30, linestyle="--", color="green", label="Oversold")
        ax3.legend()
        st.pyplot(fig3)

        # ==========================================================
        # MACD
        # ==========================================================
        st.subheader("🔀 MACD Indicator")
        fig4, ax4 = plt.subplots(figsize=(12, 3))
        ax4.plot(data["MACD"], label="MACD", color="blue")
        ax4.plot(data["Signal"], label="Signal", color="orange")
        ax4.legend()
        st.pyplot(fig4)

        # ==========================================================
        # VWAP
        # ==========================================================
        st.subheader("📏 VWAP Chart")
        fig5, ax5 = plt.subplots(figsize=(12, 3))
        ax5.plot(data["Close"], label="Close", alpha=0.6)
        ax5.plot(data["VWAP"], label="VWAP", linewidth=2)
        ax5.legend()
        st.pyplot(fig5)
