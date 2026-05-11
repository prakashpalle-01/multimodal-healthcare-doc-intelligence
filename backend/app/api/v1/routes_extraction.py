from uuid import UUID

from fastapi import APIRouter

from backend.app.schemas.extraction_schema import ExtractionRequest, ExtractionResponse, OCRResponse
from backend.app.services.extraction_service import ExtractionService

router = APIRouter()


@router.post("", response_model=ExtractionResponse)
def extract_fields(request: ExtractionRequest) -> ExtractionResponse:
    return ExtractionService().extract(request)


@router.post("/{document_id}/ocr", response_model=OCRResponse)
def run_ocr(document_id: UUID) -> OCRResponse:
    return ExtractionService().run_ocr(document_id)


@router.post("/{document_id}", response_model=ExtractionResponse)
def extract_document_fields(document_id: UUID) -> ExtractionResponse:
    return ExtractionService().extract_from_document(document_id)
