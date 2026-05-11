from uuid import UUID

from pydantic import BaseModel, Field

from backend.app.schemas.document_schema import DocumentType


class ExtractedField(BaseModel):
    name: str
    value: str
    confidence: float = Field(ge=0.0, le=1.0)
    source: str = "ocr"


class ExtractionRequest(BaseModel):
    document_id: UUID
    document_type: DocumentType = DocumentType.unknown
    text: str | None = None


class ExtractionResponse(BaseModel):
    document_id: UUID
    document_type: DocumentType
    fields: list[ExtractedField]
    text: str = ""
    status: str = "completed"


class OCRResponse(BaseModel):
    document_id: UUID
    text: str
    engine: str
    status: str = "completed"
