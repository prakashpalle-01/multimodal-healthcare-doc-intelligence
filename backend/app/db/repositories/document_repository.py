from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.document import Document
from backend.app.schemas.document_schema import DocumentRecord, DocumentType


class DocumentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, record: DocumentRecord) -> DocumentRecord:
        document = Document(
            document_id=str(record.document_id),
            filename=record.filename,
            content_type=record.content_type,
            status=record.status,
            document_type=record.document_type.value,
            storage_path=record.storage_path,
            size_bytes=record.size_bytes,
            ocr_text=record.ocr_text,
        )
        self.db.add(document)
        self.db.flush()
        return self._to_schema(document)

    def list(self) -> list[DocumentRecord]:
        documents = self.db.scalars(select(Document).order_by(Document.created_at.desc())).all()
        return [self._to_schema(document) for document in documents]

    def get(self, document_id: UUID) -> DocumentRecord | None:
        document = self.db.get(Document, str(document_id))
        return self._to_schema(document) if document else None

    def update_ocr_text(self, document_id: UUID, text: str) -> DocumentRecord | None:
        document = self.db.get(Document, str(document_id))
        if document is None:
            return None
        document.ocr_text = text
        document.status = "ocr_completed"
        self.db.flush()
        return self._to_schema(document)

    def _to_schema(self, document: Document) -> DocumentRecord:
        return DocumentRecord(
            document_id=UUID(document.document_id),
            filename=document.filename,
            content_type=document.content_type,
            status=document.status,
            document_type=DocumentType(document.document_type),
            storage_path=document.storage_path,
            size_bytes=document.size_bytes,
            ocr_text=document.ocr_text,
        )
