from app.db.mysql import get_conn, release_conn


def get_db_conn():
    conn = get_conn()
    try:
        yield conn
    finally:
        release_conn(conn)
