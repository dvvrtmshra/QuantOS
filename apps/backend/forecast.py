from datetime import datetime, timedelta
from typing import Dict

import numpy as np
from sklearn.linear_model import LinearRegression

from utils import load_candles


def forecast_prices(symbol: str, horizon: int = 30) -> Dict:
    """
    Very simple ML model:
    - Uses last 1 year of daily closes
    - Fits LinearRegression on (day_index -> close)
    - Predicts `horizon` days into the future
    """

    # get 1 year of daily candles
    candles = load_candles(symbol, period="1y", interval="1d")

    if len(candles) < 30:
        raise ValueError("Not enough history to forecast")

    closes = np.array([c["close"] for c in candles], dtype=float)
    X = np.arange(len(closes)).reshape(-1, 1)

    model = LinearRegression()
    model.fit(X, closes)

    future_idx = np.arange(len(closes), len(closes) + horizon).reshape(-1, 1)
    preds = model.predict(future_idx)

    last_time = candles[-1]["time"]
    base_dt = datetime.utcfromtimestamp(last_time)

    forecast_points = []
    for i, price in enumerate(preds, start=1):
        dt = base_dt + timedelta(days=i)
        forecast_points.append({
            "time": int(dt.timestamp()),  # unix seconds
            "close": float(price),
        })

    return {
        "symbol": symbol,
        "history": candles,
        "forecast": forecast_points,
        "horizon": horizon,
    }
