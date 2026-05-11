from pathlib import Path
from uuid import UUID, uuid4

from fastapi import HTTPException, UploadFile

from backend.app.config import get_settings
from backend.app.db.repositories.document_repository import DocumentRepository
from backend.app.db.session import session_scope
from backend.app.schemas.document_schema import DocumentRecord, DocumentUploadResponse, infer_document_type
from backend.app.utils.file_utils import save_upload


class DocumentService:
    async def stage_upload(self, file: UploadFile) -> DocumentUploadResponse:
        document_id = uuid4()
        filename = file.filename or "uploaded-document"
        storage_path = await save_upload(file, Path(get_settings().upload_dir), document_id)
        document_type = infer_document_type(filename)

        record = DocumentRecord(
            document_id=document_id,
            filename=filename,
            content_type=file.content_type,
            status="staged",
            document_type=document_type,
            storage_path=str(storage_path),
            size_bytes=storage_path.stat().st_size,
        )
        with session_scope() as db:
            saved = DocumentRepository(db).create(record)
            return DocumentUploadResponse(**saved.model_dump())

    def list_documents(self) -> list[DocumentRecord]:
        with session_scope() as db:
            return DocumentRepository(db).list()

    def get_document(self, document_id: UUID) -> DocumentRecord:
        with session_scope() as db:
            record = DocumentRepository(db).get(document_id)
            if record is None:
                raise HTTPException(status_code=404, detail="Document not found")
            return record

    def update_ocr_text(self, document_id: UUID, text: str) -> DocumentRecord:
        with session_scope() as db:
            updated = DocumentRepository(db).update_ocr_text(document_id, text)
            if updated is None:
                raise HTTPException(status_code=404, detail="Document not found")
            return updated
