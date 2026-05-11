from uuid import UUID

from fastapi import APIRouter, File, UploadFile

from backend.app.schemas.document_schema import DocumentRecord, DocumentUploadResponse
from backend.app.services.document_service import DocumentService

router = APIRouter()


@router.post("", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)) -> DocumentUploadResponse:
    return await DocumentService().stage_upload(file)


@router.get("", response_model=list[DocumentRecord])
def list_documents() -> list[DocumentRecord]:
    return DocumentService().list_documents()


@router.get("/{document_id}", response_model=DocumentRecord)
def get_document(document_id: UUID) -> DocumentRecord:
    return DocumentService().get_document(document_id)
