from fastapi import APIRouter, Depends
from app.modules.auth.deps import get_current_user


router = APIRouter()


@router.get("/health")
def health_check(user=Depends(get_current_user)):
    return {"status": "ok", "service": "LIMS API", "user": user["username"]}
