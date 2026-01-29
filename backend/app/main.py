from fastapi import FastAPI
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    title="LIMS – Laboratory Information Management System",
    version="0.1.0",
    description="Phần mềm quản lý phòng thí nghiệm theo ISO 17025",
)

app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "LIMS API is running"}
