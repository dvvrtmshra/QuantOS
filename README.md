# QuantOS

QuantOS is a personal market analysis dashboard built purely for fun and learning.  
It’s **not** meant to be a production trading platform — the goal was to experiment with charts, indicators, forecasting, UI design, and overall system architecture.

No serious financial intentions.  
No trading advice.  
Just building stuff.

---

## Features

- Interactive candlestick & line charts  
- Multiple timeframes (1D → MAX)  
- Technical indicators (RSI, SMA 20, SMA 50)  
- ML-based price forecast visualization  
- Watchlist support (local storage, no auth)  
- Clean, dark, terminal-inspired UI  
- Modular frontend & backend structure  

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

### Backend
- FastAPI (Python)

### Other
- REST APIs
- LocalStorage (watchlist)

---

## Screenshots

_Add screenshots here_

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quantos.git
cd quantos
2. Frontend Setup
bash
Copy code
cd apps/frontend
npm install
Create a .env.local file inside apps/frontend:

env
Copy code
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
Run the frontend:

bash
Copy code
npm run dev
Frontend will be available at:

arduino
Copy code
http://localhost:3000
3. Backend Setup
bash
Copy code
cd apps/backend
python -m venv .venv
Activate the virtual environment:

bash
Copy code
# macOS / Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Run the backend:

bash
Copy code
uvicorn main:app --reload --port 8000
Backend will be available at:

cpp
Copy code
http://127.0.0.1:8000
How To Use
Open the dashboard

Search for a symbol (BTC, AMZN, AAPL, etc.)

Switch between candlestick / line charts

Toggle indicators from More Charts

Add assets to your watchlist ⭐

View ML-based forecasts and price behavior

No login.
No accounts.
No setup pain.

Project Status
✅ Completed

QuantOS is feature-complete for what it was meant to be.
No active development planned unless something interesting comes up.

Contributions
This project was built mainly for learning and experimentation,
but contributions are welcome.

If you want to contribute:

Fork the repository

Create a new branch

Make your changes

Open a PR with a short explanation

Keep it simple — clarity over complexity.

Disclaimer
This project is not financial advice.
All data, indicators, and forecasts are for educational purposes only.

Why This Exists
Because building things is fun.
Because dashboards teach you a lot.
Because not every project needs to be a startup.