import os
import requests
from fastapi import APIRouter
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

NEWS_KEY = os.environ.get("NEWS_API_KEY")

@router.get("/news")
def get_finance_news():
    url = (
        "https://newsapi.org/v2/top-headlines?"
        "category=business&"
        "language=en&"
        f"apiKey={NEWS_KEY}"
    )

    response = requests.get(url)
    data = response.json()

    articles = []
    for a in data.get("articles", []):
        articles.append({
            "title": a.get("title"),
            "source": a.get("source", {}).get("name"),
            "url": a.get("url"),
            "image": a.get("urlToImage"),
            "published": a.get("publishedAt")
        })

    return {"articles": articles}
