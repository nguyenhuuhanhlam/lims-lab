from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference

from app.api.router import api_router

app = FastAPI(
    docs_url=None,  # Disable Swagger UI (/docs)
    redoc_url=None,  # Disable ReDoc (/redoc)
    openapi_url="/openapi.json",  # Keep OpenAPI schema endpoint
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/docs", include_in_schema=False)
def scalar_docs():
    return get_scalar_api_reference(
        openapi_url="/openapi.json",
        title="LIMS API Documentation",
    )


@app.get("/")
def root():
    return {"message": "LIMS API is running"}
