import praw
import os
import json
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("CLIENT_SECRET"),
    user_agent="reddit-check"
)

subreddit = reddit.subreddit("berkeley")
latest_post = next(subreddit.new(limit=1))
print(json.dumps({"latest": latest_post.created_utc}))
