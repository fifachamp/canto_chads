import os 
import json

from dotenv import load_dotenv
load_dotenv()


from rq import Connection, Queue
from redis import Redis

redis_conn = Redis.from_url(os.environ.get('REDIS_URL') or 'redis://localhost:6379/0')
# Redis(host='localhost', port=6379, db=0)

# q = Queue('placeholder', connection=redis_conn)
# q2 = Queue('reveal', connection=redis_conn)

redis_conn.delete("Mom")
redis_conn.delete("Dad")
redis_conn.delete("Son")
redis_conn.delete("Baby")
redis_conn.delete("Dog")
redis_conn.delete("token_id")