from fastapi import APIRouter, Request
from app.modules.auth.service import register_user, login_user

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
