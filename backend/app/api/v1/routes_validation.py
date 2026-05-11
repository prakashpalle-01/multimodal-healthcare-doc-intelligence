from fastapi import APIRouter
from uuid import UUID

from backend.app.schemas.validation_schema import ValidationRequest, ValidationResponse
from backend.app.services.validation_service import ValidationService

router = APIRouter()


@router.post("", response_model=ValidationResponse)
def validate_fields(request: ValidationRequest) -> ValidationResponse:
    return ValidationService().validate(request)


@router.post("/{document_id}", response_model=ValidationResponse)
def validate_document(document_id: UUID) -> ValidationResponse:
    return ValidationService().validate_document(document_id)
