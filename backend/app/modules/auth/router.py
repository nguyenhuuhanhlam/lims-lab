from fastapi import APIRouter, Request, Depends
from app.modules.auth.service import (
    register_user,
    login_user,
    change_password,
    get_users,
    update_user,
    delete_user,
)
from app.modules.auth.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(req: Request):
    data = await req.json()
    return register_user(
        username=data.get("username"),
        password=data.get("password"),
        full_name=data.get("full_name"),
    )


@router.post("/login")
async def login(req: Request):
    data = await req.json()
    return login_user(
        username=data.get("username"),
        password=data.get("password"),
    )


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return user


@router.put("/change-password")
async def change_password_endpoint(req: Request, user=Depends(get_current_user)):
    data = await req.json()
    return change_password(
        user=user,
        old_password=data.get("old_password"),
        new_password=data.get("new_password"),
    )


@router.get("/users")
async def get_all_users(user=Depends(get_current_user)):
    return get_users()


@router.put("/users/{user_id}")
async def update_user_endpoint(
    user_id: int, req: Request, user=Depends(get_current_user)
):
    data = await req.json()
    return update_user(
        user_id=user_id,
        full_name=data.get("full_name"),
        email=data.get("email"),
        role=data.get("role"),
        is_active=data.get("is_active", True),
    )


@router.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int, user=Depends(get_current_user)):
    return delete_user(user_id)
