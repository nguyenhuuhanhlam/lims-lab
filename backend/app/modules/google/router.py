from fastapi import APIRouter, Request
from app.modules.google.service import get_sheets

router = APIRouter(prefix="/google", tags=["Google"])


@router.get("/sheets")
async def get_google_sheets(request: Request):
    return await get_sheets()
