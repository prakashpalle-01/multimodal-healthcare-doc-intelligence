from enum import StrEnum
from pathlib import Path
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
    document_type: DocumentType = DocumentType.unknown


class DocumentRecord(DocumentUploadResponse):
    storage_path: str
    size_bytes: int
    ocr_text: str | None = None


def infer_document_type(filename: str) -> DocumentType:
    normalized = Path(filename).stem.lower().replace("-", "_")
    if "prescription" in normalized or normalized.startswith("rx"):
        return DocumentType.prescription
    if "claim" in normalized:
        return DocumentType.claim
    if "eob" in normalized:
        return DocumentType.eob
    if "denial" in normalized:
        return DocumentType.denial_letter
    if "invoice" in normalized:
        return DocumentType.invoice
    return DocumentType.unknown
