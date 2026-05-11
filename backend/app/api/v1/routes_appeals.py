from fastapi import APIRouter
from uuid import UUID

from backend.app.schemas.appeal_schema import AppealDraftResponse
from backend.app.services.appeal_generation_service import AppealGenerationService

router = APIRouter()


@router.post("/{document_id}", response_model=AppealDraftResponse)
def generate_appeal(document_id: UUID) -> AppealDraftResponse:
    return AppealGenerationService().generate_for_document(document_id)
