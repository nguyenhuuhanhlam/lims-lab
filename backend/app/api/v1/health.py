from fastapi import APIRouter, Depends

# from app.modules.auth.deps import get_current_user
from app.modules.auth.deps import require_role


router = APIRouter()


@router.get("/health")
def health_check(user=Depends(require_role("admin"))):
    return {
        "status": "ok",
        "user": user["username"],
        "role": user["role"],
    }
