from fastapi import APIRouter
from uuid import UUID

from backend.app.schemas.appeal_schema import DenialExplanationResponse
from backend.app.services.denial_reason_service import DenialReasonService

router = APIRouter()


@router.post("/{document_id}", response_model=DenialExplanationResponse)
def explain_denial(document_id: UUID) -> DenialExplanationResponse:
    return DenialReasonService().explain(document_id)
