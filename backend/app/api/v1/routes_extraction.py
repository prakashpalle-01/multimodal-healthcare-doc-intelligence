from fastapi import APIRouter

from backend.app.schemas.extraction_schema import ExtractionRequest, ExtractionResponse
from backend.app.services.extraction_service import ExtractionService

router = APIRouter()


@router.post("", response_model=ExtractionResponse)
def extract_fields(request: ExtractionRequest) -> ExtractionResponse:
    return ExtractionService().extract(request)
