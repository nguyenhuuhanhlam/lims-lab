from fastapi import APIRouter
from app.api.v1 import health
from app.modules.auth.router import router as auth_router


from app.core.config import settings

api_router = APIRouter(prefix=settings.API_V1_STR)

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth_router)
