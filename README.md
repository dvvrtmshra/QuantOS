# QuantOS — Financial Analytics Dashboard

QuantOS is a modular financial dashboard for market analytics, technical indicators, and quantitative tooling. It uses a Next.js frontend and a FastAPI backend to deliver real-time market insights and portfolio tracking.

## Features

### Market Analytics

* Search stocks and assets
* Real-time/near real-time quotes
* Historical OHLCV data visualization
* Candlestick charts, RSI, EMA overlays

### Portfolio Management

* Create and manage portfolios
* Unrealized and realized P/L
* Weighted performance metrics

### Quant Toolkit

* Core indicators (RSI, SMA, EMA, MACD, VWAP)
* Preparation for strategy backtesting
* Modular design for expandable trading logic

## Tech Stack

Frontend:

* Next.js 14 (App Router)
* TailwindCSS
* ShadCN UI
* Recharts / TradingView-like chart components

Backend:

* FastAPI
* Python
* Pydantic
* Standard REST endpoints

Data:

* Data providers (AlphaVantage, Yahoo Finance, etc.)
* Future integration with WebSocket feeds
* Optional MongoDB or PostgreSQL storage layer

## Project Structure

```
quantos/
│
├── backend/
│   ├── main.py             # FastAPI entrypoint
│   ├── routes/             # API endpoints
│   ├── services/           # market, portfolio, indicators
│   ├── schemas/            # request/response models
│   ├── core/               # config, logging, utils
│   ├── tests/              # backend tests
│
├── frontend/
│   ├── app/                # Next.js app router
│   ├── components/         # UI components
│   ├── utils/              # API fetchers and helpers
│   ├── styles/             # Tailwind global styles
│   ├── public/             # static assets
│
├── docs/
│   ├── api.md
│   ├── design.md
│
└── README.md
```

## Getting Started

### 1. Clone

```
git clone https://github.com/<yourusername>/quantos.git
cd quantos
```

### 2. Backend Setup (FastAPI)

Create virtual environment:

```
cd backend
python -m venv venv
```

Activate:

* Windows:

```
venv\Scripts\activate
```

* Linux/Mac:

```
source venv/bin/activate
```

Install dependencies:

```
pip install -r requirements.txt
```

Run backend:

```
uvicorn main:app --reload
```

Backend will run at:

```
http://localhost:8000
```

### 3. Frontend Setup (Next.js)

```
cd ../frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:3000
```

## API Example

Get historical prices:

```
GET /api/v1/market/history?symbol=TSLA&range=1y
```

Example response:

```
{
  "symbol": "TSLA",
  "data": [
    {
      "open": 194.11,
      "high": 195.52,
      "low": 192.02,
      "close": 194.78,
      "volume": 89373945,
      "date": "2024-01-03"
    }
  ]
}
```

## Environment Variables

Create:

```
backend/.env
frontend/.env.local
```

Backend:

```
API_KEY=<provider_api_key>
DATABASE_URL=<optional>
```

Frontend:

```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## UI Modules

* Dashboard: watchlist, alerts, overview
* Market Explorer: charts, indicators, ticker search
* Portfolio: asset tracking, allocation, returns
* Quant Lab: strategy prototyping (WIP)

## Development Roadmap

v0.1

* Symbol search
* Historical data
* OHLC chart
* RSI/EMA overlays

v0.2

* Portfolio CRUD
* Basic P/L calculation
* Heatmaps

v0.3

* Strategy engine
* Paper trading
* WebSocket price feeds

## Testing

Backend:

```
pytest
```

Frontend:

```
npm test
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

If you want, I can generate:

* `api.md` documentation
* a full `requirements.txt` + `package.json`
* or a complete project scaffold (ready to code).
