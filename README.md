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
