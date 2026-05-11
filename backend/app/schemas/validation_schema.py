from uuid import UUID

from pydantic import BaseModel, Field

from backend.app.schemas.extraction_schema import ExtractedField


class ValidationIssue(BaseModel):
    code: str
    field: str | None = None
    message: str
    severity: str = "warning"
    recommendation: str | None = None


class ValidationRequest(BaseModel):
    document_id: UUID
    fields: list[ExtractedField] = []


class ValidationResponse(BaseModel):
    document_id: UUID | None = None
    valid: bool
    issues: list[ValidationIssue] = []
    score: int = Field(ge=0, le=100, default=100)
