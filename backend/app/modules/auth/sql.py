from app.db.mysql import get_conn, release_conn


def get_user_by_username(username: str):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, username, password_hash, is_active
                FROM users
                WHERE username = %s
            """,
                (username,),
            )
            return cur.fetchone()
    finally:
        release_conn(conn)


def create_user(username: str, password_hash: str, full_name: str | None):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (username, password_hash, full_name)
                VALUES (%s, %s, %s)
            """,
                (username, password_hash, full_name),
            )
        conn.commit()
    finally:
        release_conn(conn)
