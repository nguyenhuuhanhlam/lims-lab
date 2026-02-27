from app.db.mysql import get_conn, release_conn

from app.modules.auth.constants import Roles


def get_user_by_username(username: str):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, username, password_hash, is_active, role
                FROM users
                WHERE username = %s
            """,
                (username,),
            )
            return cur.fetchone()
    finally:
        release_conn(conn)


def create_user(
    username: str,
    password_hash: str,
    full_name: str | None,
    role: str = Roles.CLIENT,
    is_active: bool = True,
):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (username, password_hash, full_name, role, is_active)
                VALUES (%s, %s, %s, %s, %s)
            """,
                (username, password_hash, full_name, role, is_active),
            )
        conn.commit()
    finally:
        release_conn(conn)


def update_password(user_id: int, password_hash: str):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE users
                SET password_hash = %s
                WHERE id = %s
            """,
                (password_hash, user_id),
            )
        conn.commit()
    finally:
        release_conn(conn)
