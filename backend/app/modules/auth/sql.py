from app.db.mysql import get_conn, release_conn

from app.modules.auth.constants import Roles


def get_user_by_username(username: str):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, username, email, password_hash, is_active, role
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


def get_users():
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, username, email, full_name, is_active, role
                FROM users
            """
            )
            return cur.fetchall()
    finally:
        release_conn(conn)


def update_user(
    user_id: int, full_name: str | None, email: str | None, role: str, is_active: bool
):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE users
                SET full_name = %s, email = %s, role = %s, is_active = %s
                WHERE id = %s
            """,
                (full_name, email, role, is_active, user_id),
            )
        conn.commit()
    finally:
        release_conn(conn)


def delete_user(user_id: int):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM users
                WHERE id = %s
            """,
                (user_id,),
            )
        conn.commit()
    finally:
        release_conn(conn)
