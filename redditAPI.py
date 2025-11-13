import praw
import os
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(
    client_id = os.getenv('CLIENT_ID'),
    client_secret = os.getenv('CLIENT_SECRET'),
    password = os.getenv('REDDIT_PASSWORD'),
    user_agent = "berkeleyApp:v1 (by u/Past-Mousse-1391)"
    username = os.getenv('REDDIT_USERNAME')
)

