import os 
import json

from dotenv import load_dotenv
load_dotenv()

import cloudinary
import cloudinary.uploader
import cloudinary.api

config = cloudinary.config(secure=True)

from rq import Connection, Queue
from redis import Redis

redis_conn = Redis.from_url(os.environ.get('REDIS_URL') or 'redis://localhost:6379/0')

q = Queue('placeholder', connection=redis_conn)
q2 = Queue('reveal', connection=redis_conn)
q3 = Queue('safe_reveal', connection=redis_conn)

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

def set_placeholder(token_id, person, index, overwrite):
    # upload img
    # filename = os.path.join(ROOT_DIR, 'Placeholders', 'images', person + '.png')
    # cloudinary.uploader.upload(filename, public_id=token_id, folder="images")
    # filename = os.path.join(ROOT_DIR, 'Placeholders', 'pre_reveal_GIF.gif')
    # url = cloudinary.uploader.upload(filename, public_id=token_id, folder="images", invalidate=True)
    # print(url)

    # # upload metadata
    # filename = os.path.join(ROOT_DIR, 'Placeholders', 'metadata', 'Random')
    # # modify metadata with token id and name 
    # data = json.loads(open(filename).read())
    # data["name"] = "Poopy #" + str(token_id).zfill(4)
    # data["tokenId"] = token_id

    # file = open(filename, 'w')
    # file.write(json.dumps(data, sort_keys=True, indent=4))
    # file.close()

    # url = cloudinary.uploader.upload(filename, public_id=token_id, folder="metadata", resource_type="raw", invalidate=True, overwrite=overwrite)
    # print(url)

    job = q2.enqueue(reveal, token_id, person, index)

def reveal(token_id, person, index):
    # upload img
    filename = os.path.join(ROOT_DIR, 'People', person, 'images', str(index) + '.png')
    url = cloudinary.uploader.upload(filename, public_id=token_id, folder="images", invalidate=True)
    print(url)

    # upload metadata
    filename = os.path.join(ROOT_DIR, 'People', person, 'metadata', str(index) )
    print(filename)

    data = json.loads(open(filename).read())
    data["name"] = "Poopy #" + str(token_id).zfill(4)
    data["tokenId"] = token_id
    data["image"] = "https://res.cloudinary.com/hqsllgz1e/image/upload/images/" + str(token_id) + ".png"

    file = open(filename, 'w')
    file.write(json.dumps(data, sort_keys=True, indent=4))
    file.close()

    url = cloudinary.uploader.upload(filename, public_id=token_id, folder="metadata", resource_type="raw", invalidate=True)
    print(url)

