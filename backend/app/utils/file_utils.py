from pathlib import Path
from uuid import UUID

from fastapi import UploadFile


def safe_filename(filename: str) -> str:
    return Path(filename).name.replace(" ", "_")


async def save_upload(file: UploadFile, upload_dir: Path, document_id: UUID) -> Path:
    upload_dir.mkdir(parents=True, exist_ok=True)
    filename = safe_filename(file.filename or "uploaded-document")
    destination = upload_dir / f"{document_id}_{filename}"
    content = await file.read()
    destination.write_bytes(content)
    return destination
