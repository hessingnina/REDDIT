from redditAPI import get_stats
import json

if __name__ == "__main__":
    result = get_stats()
    print(json.dumps(result))
