from pathlib import Path
from shutil import copyfile
import sys
from uuid import uuid4

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.config import get_settings
from backend.app.db.database import init_db
from backend.app.db.repositories.document_repository import DocumentRepository
from backend.app.db.session import session_scope
from backend.app.schemas.document_schema import DocumentRecord, infer_document_type


SAMPLE_DIR = Path("data/samples")


def seed_samples() -> None:
    init_db()
    upload_dir = Path(get_settings().upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    seeded = 0
    with session_scope() as db:
        repository = DocumentRepository(db)
        existing_filenames = {document.filename for document in repository.list()}

        for sample_path in sorted(SAMPLE_DIR.glob("*.txt")):
            if sample_path.name in existing_filenames:
                continue

            document_id = uuid4()
            destination = upload_dir / f"{document_id}_{sample_path.name}"
            copyfile(sample_path, destination)
            repository.create(
                DocumentRecord(
                    document_id=document_id,
                    filename=sample_path.name,
                    content_type="text/plain",
                    status="staged",
                    document_type=infer_document_type(sample_path.name),
                    storage_path=str(destination),
                    size_bytes=destination.stat().st_size,
                )
            )
            seeded += 1

    print(f"Seeded {seeded} sample documents.")


if __name__ == "__main__":
    seed_samples()
