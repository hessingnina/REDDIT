from redditAPI import get_top_redditor
import json

if __name__ == "__main__":
    result = get_top_redditor()
    print(json.dumps(result))
