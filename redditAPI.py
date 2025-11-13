import praw
import os
from collections import defaultdict
from dotenv import load_dotenv
from datetime import datetime, timedelta
import emoji

load_dotenv()

reddit = praw.Reddit(
    client_id = os.getenv('CLIENT_ID'),
    client_secret = os.getenv('CLIENT_SECRET'),
    user_agent = "berkeleyApp:v1 (by u/Past-Mousse-1391)"
)

berkeley_reddit = reddit.subreddit("berkeley")

user_dict = defaultdict(lambda: {"posts": 0, "comments": 0, "upvotes": 0})
emoji_counts = defaultdict(int)

def weekly_posts():
    now = datetime.utcnow()
    days_since_sunday = now.weekday() + 1 if now.weekday() < 6 else 0
    start_of_week = now - timedelta(days=days_since_sunday)
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

    for post in berkeley_reddit.new(limit=1000):
        post_time = datetime.utcfromtimestamp(post.created_utc)
        if start_of_week <= post_time:
            change_user_dict_post(post)
            emoji_count(post)

    for comment in berkeley_reddit.comments(limit=1000):
        post_time = datetime.utcfromtimestamp(post.created_utc)
        if start_of_week <= post_time:
            change_user_dict_comment(comment)
            emoji_count(comment)

def change_user_dict_post(post):
    author = str(post.author)
    user_dict[author]["posts"] += 1
    user_dict[author]["upvotes"] += post.score
    
def change_user_dict_comment(post):
    author = str(post.author)
    user_dict[author]["comments"] += 1
    user_dict[author]["upvotes"] += post.score

def emoji_count(post):
    for char in post.body:
        if char in emoji.EMOJI_DATA:
            emoji_counts[char] += 1

