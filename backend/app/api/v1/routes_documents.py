from fastapi import APIRouter, File, UploadFile

from backend.app.schemas.document_schema import DocumentUploadResponse
from backend.app.services.document_service import DocumentService

router = APIRouter()


@router.post("", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)) -> DocumentUploadResponse:
    return await DocumentService().stage_upload(file)
