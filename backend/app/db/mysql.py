import pymysql
from pymysql.cursors import DictCursor
from dotenv import load_dotenv
import os
import queue

load_dotenv()

_POOL_SIZE = 10
_pool = queue.Queue(maxsize=_POOL_SIZE)

def _create_conn():
    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", 3306)),
        cursorclass=DictCursor,
        autocommit=False,
    )

# init pool
for _ in range(_POOL_SIZE):
    _pool.put(_create_conn())

def get_conn():
    return _pool.get()

def release_conn(conn):
    _pool.put(conn)
