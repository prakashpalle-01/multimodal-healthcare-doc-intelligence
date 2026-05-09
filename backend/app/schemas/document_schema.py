from enum import StrEnum
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class DocumentType(StrEnum):
    prescription = "prescription"
    claim = "claim"
    eob = "eob"
    denial_letter = "denial_letter"
    invoice = "invoice"
    unknown = "unknown"


class DocumentUploadResponse(BaseModel):
    document_id: UUID = Field(default_factory=uuid4)
    filename: str
    content_type: str | None = None
    status: str = "staged"
