from fastapi import UploadFile

from backend.app.schemas.document_schema import DocumentUploadResponse


class DocumentService:
    async def stage_upload(self, file: UploadFile) -> DocumentUploadResponse:
        return DocumentUploadResponse(filename=file.filename or "uploaded-document", content_type=file.content_type)
