from fastapi import FastAPI
from scalar_fastapi import get_scalar_api_reference


# from app.core.config import settings
from app.api.router import api_router

app = FastAPI(
    docs_url=None,  # Disable Swagger UI (/docs)
    redoc_url=None,  # Disable ReDoc (/redoc)
    openapi_url="/openapi.json",  # Keep OpenAPI schema endpoint
)

app.include_router(api_router)


@app.get("/docs", include_in_schema=False)
def scalar_docs():
    """
    Serve Scalar API documentation UI.

    - openapi_url: Path to the OpenAPI schema
    - title: Title displayed in Scalar UI
    """
    return get_scalar_api_reference(
        openapi_url="/openapi.json",
        title="LIMS API Documentation",
    )


@app.get("/")
def root():
    return {"message": "LIMS API is running"}
