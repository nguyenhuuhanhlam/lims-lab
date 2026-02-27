from app.modules.auth import sql
from app.core.security import get_password_hash, verify_password, create_access_token
from fastapi import HTTPException


def register_user(username: str, password: str, full_name: str | None):
    if sql.get_user_by_username(username):
        raise HTTPException(400, "Username already exists")

    password_hash = get_password_hash(password)
    sql.create_user(username, password_hash, full_name)

    return {"message": "Register success"}


def login_user(username: str, password: str):
    user = sql.get_user_by_username(username)

    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")

    if not user["is_active"]:
        raise HTTPException(403, "User disabled")

    token = create_access_token(subject=str(user["id"]))

    return {"access_token": token, "token_type": "bearer"}


def change_password(user: dict, old_password: str, new_password: str):
    db_user = sql.get_user_by_username(user["username"])
    if not db_user or not verify_password(old_password, db_user["password_hash"]):
        raise HTTPException(400, "Invalid old password")

    new_password_hash = get_password_hash(new_password)
    sql.update_password(user["id"], new_password_hash)

    return {"message": "Password changed successfully"}


def get_users():
    return sql.get_users()


def update_user(
    user_id: int, full_name: str | None, email: str | None, role: str, is_active: bool
):
    sql.update_user(user_id, full_name, email, role, is_active)
    return {"message": "User updated successfully"}


def delete_user(user_id: int):
    sql.delete_user(user_id)
    return {"message": "User deleted successfully"}
