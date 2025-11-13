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
weekly_number_posts = 0;

def weekly_posts():
    now = datetime.utcnow()
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    query = f'timestamp:{int(one_week_ago.timestamp())}..'
    results = berkeley_reddit.search(query, sort='new', syntax='cloudsearch', limit=None)


    for post in results:
        change_user_dict_post(post)
        weekly_number_posts+=1

    for comment in berkeley_reddit.comments(limit=None):
        comment_time = datetime.utcfromtimestamp(comment.created_utc)
        if comment_time < one_week_ago:
            break
        change_user_dict_comment(comment)


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

def get_top_redditor():
    weekly_posts()
    if not user_dict:
        return None

    top_user = max(user_dict.items(), key=lambda item: item[1]["upvotes"])
    return {
        "username": top_user[0],
        "posts": top_user[1]["posts"],
        "comments": top_user[1]["comments"],
        "upvotes": top_user[1]["upvotes"],
        "weekly_posts": weekly_number_posts
    }