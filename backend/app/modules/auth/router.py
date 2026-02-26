from fastapi import APIRouter, Request, Depends
from app.modules.auth.service import register_user, login_user
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
