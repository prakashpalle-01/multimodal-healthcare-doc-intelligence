from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

from backend.app.api.v1 import (
    routes_appeals,
    routes_denials,
    routes_documents,
    routes_extraction,
    routes_health,
    routes_validation,
)
from backend.app.config import get_settings
from backend.app.db.database import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Healthcare document OCR, extraction, validation, RAG, and appeal generation API.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_health.router, prefix="/api/v1", tags=["health"])
app.include_router(routes_documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(routes_extraction.router, prefix="/api/v1/extraction", tags=["extraction"])
app.include_router(routes_validation.router, prefix="/api/v1/validation", tags=["validation"])
app.include_router(routes_denials.router, prefix="/api/v1/denials", tags=["denials"])
app.include_router(routes_appeals.router, prefix="/api/v1/appeals", tags=["appeals"])


@app.get("/metrics", include_in_schema=False)
def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
