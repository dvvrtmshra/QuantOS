import streamlit as st
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

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
    delta = data["Close"].diff().values.flatten()

    gain = np.where(delta > 0, delta, 0).flatten()
    loss = np.where(delta < 0, -delta, 0).flatten()

    avg_gain = pd.Series(gain).rolling(window).mean()
    avg_loss = pd.Series(loss).rolling(window).mean()

    rs = avg_gain / avg_loss
    data["RSI"] = 100 - (100 / (1 + rs))
    return data


# ==========================================================
# 3️⃣ MACD Calculation
# ==========================================================
def calculate_macd(data: pd.DataFrame):
    short_ema = data["Close"].ewm(span=12, adjust=False).mean()
    long_ema = data["Close"].ewm(span=26, adjust=False).mean()

    macd = short_ema - long_ema
    signal = macd.ewm(span=9, adjust=False).mean()

    data["MACD"] = macd
    data["Signal"] = signal
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
# 7️⃣ LSTM 30-day Forecast
# ==========================================================
def lstm_forecast_30_days(data: pd.DataFrame, forecast_days: int = 30):
    close_prices = data["Close"].values.reshape(-1, 1)

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(close_prices)

    seq_len = 60
    if len(scaled) <= seq_len + 5:
        return None, None

    # training data
    X, y = [], []
    for i in range(seq_len, len(scaled)):
        X.append(scaled[i - seq_len:i, 0])
        y.append(scaled[i, 0])

    X, y = np.array(X), np.array(y)
    X = X.reshape(X.shape[0], X.shape[1], 1)

    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(X.shape[1], 1)),
        LSTM(32),
        Dense(1)
    ])
    model.compile(optimizer="adam", loss="mean_squared_error")
    model.fit(X, y, epochs=8, batch_size=32, verbose=0)

    # Forecast
    last_seq = scaled[-seq_len:].reshape(1, seq_len, 1)
    preds_scaled = []

    for _ in range(forecast_days):
        pred = model.predict(last_seq, verbose=0)

        # keep shape consistent
        last_seq = np.concatenate(
            [last_seq[:, 1:, :], pred.reshape(1, 1, 1)],
            axis=1
        )

        preds_scaled.append(pred[0, 0])

    preds_scaled = np.array(preds_scaled).reshape(-1, 1)
    future_prices = scaler.inverse_transform(preds_scaled).flatten()

    last_date = data.index[-1]
    future_dates = pd.date_range(last_date + pd.Timedelta(days=1), periods=forecast_days)

    return future_dates, future_prices



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
        # indicators
        data = calculate_rsi(data)
        data = calculate_macd(data)
        data = calculate_moving_averages(data)
        data = calculate_bollinger(data)
        data = calculate_vwap(data)

        st.success(f"✔ Data Loaded Successfully for {ticker}")

        # ----------------- PRICE CHART -----------------
        st.subheader(f"📈 Price Chart — {ticker}")
        fig, ax = plt.subplots(figsize=(12, 4))
        ax.plot(data["Close"], label="Close Price")
        ax.set_ylabel("Price")
        ax.legend()
        st.pyplot(fig)

        st.markdown(
            """
**What this shows:** Overall direction of the stock over the selected period.  
- 🔼 Uptrend = buyers in control  
- 🔽 Downtrend = sellers in control  
- Sharp moves often correspond to news, earnings, or macro events.
"""
        )

        # ----------------- MOVING AVERAGES + BOLLINGER -----------------
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

        st.markdown(
            """
**How to read it:**
- **SMA20 / EMA20** → short-term trend  
- **SMA50 / EMA50** → medium-term trend  
- **Bullish signal:** fast MA (20) crossing above slow MA (50)  
- **Bollinger Bands:** widening = high volatility, squeezing = low volatility  
- Price touching upper band = potentially overextended on upside,  
  touching lower band = oversold / panic zone.
"""
        )

        # ----------------- RSI -----------------
        st.subheader("📉 RSI Indicator")
        fig3, ax3 = plt.subplots(figsize=(12, 3))
        ax3.plot(data["RSI"], label="RSI", color="purple")
        ax3.axhline(70, linestyle="--", color="red", label="Overbought (70)")
        ax3.axhline(30, linestyle="--", color="green", label="Oversold (30)")
        ax3.legend()
        st.pyplot(fig3)

        st.markdown(
            """
**RSI (Relative Strength Index):** measures momentum on a 0–100 scale.  
- 🔴 RSI > 70 → overbought region, risk of pullback  
- 🟢 RSI < 30 → oversold region, possible bounce zone  
- Flat RSI near 50 = neutral / sideways market.
"""
        )

        # ----------------- MACD -----------------
        st.subheader("🔀 MACD Indicator")
        fig4, ax4 = plt.subplots(figsize=(12, 3))
        ax4.plot(data["MACD"], label="MACD", color="blue")
        ax4.plot(data["Signal"], label="Signal", color="orange")
        ax4.legend()
        st.pyplot(fig4)

        st.markdown(
            """
**MACD:** compares short-term and long-term momentum.  
- **Bullish:** MACD line crossing above Signal line  
- **Bearish:** MACD line crossing below Signal line  
- When both lines are near zero → low momentum / consolidation market.
"""
        )

        # ----------------- VWAP -----------------
        st.subheader("📏 VWAP Chart")
        fig5, ax5 = plt.subplots(figsize=(12, 3))
        ax5.plot(data["Close"], label="Close", alpha=0.6)
        ax5.plot(data["VWAP"], label="VWAP", linewidth=2)
        ax5.legend()
        st.pyplot(fig5)

        st.markdown(
            """
**VWAP (Volume Weighted Average Price):**  
- Acts as a fair value benchmark used by institutions  
- Price **above VWAP** → buyers dominating, strong demand  
- Price **below VWAP** → sellers dominating, pressure on price  
- Intraday algos often try to execute close to VWAP.
"""
        )

        # ----------------- LSTM 30-DAY FORECAST -----------------
        st.subheader("🤖 AI Forecast — Next 30 Days (LSTM)")

        with st.spinner("Training LSTM model on price history..."):
            future_dates, future_prices = lstm_forecast_30_days(data, forecast_days=30)

        if future_dates is None:
            st.warning("Not enough data available to train the LSTM model.")
        else:
            fig6, ax6 = plt.subplots(figsize=(12, 4))

# historical data
ax6.plot(data.index, data["Close"], label="Historical Close", color="white")

# central forecast
ax6.plot(future_dates, future_prices, label="AI Forecast", linestyle="--", color="cyan")

# confidence bands (±15%)
upper = future_prices * 1.15
lower = future_prices * 0.85

ax6.fill_between(
    future_dates,
    lower,
    upper,
    alpha=0.2,
    color="cyan",
    label="Confidence Range (±15%)"
)

ax6.legend()
st.pyplot(fig6)

st.markdown("""
### 📌 How to read this forecast:
- The dashed blue line = neural network’s predicted future price path  
- Colored band = confidence range (+15% / -15%)  
- Upper edge 🔼 = optimistic growth scenario  
- Lower edge 🔽 = conservative pullback scenario  
""")

