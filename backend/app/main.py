from fastapi import FastAPI
from fastapi.responses import Response
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

from backend.app.api.v1 import routes_documents, routes_extraction, routes_health
from backend.app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Healthcare document OCR, extraction, validation, RAG, and appeal generation API.",
)

app.include_router(routes_health.router, prefix="/api/v1", tags=["health"])
app.include_router(routes_documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(routes_extraction.router, prefix="/api/v1/extraction", tags=["extraction"])


@app.get("/metrics", include_in_schema=False)
def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
