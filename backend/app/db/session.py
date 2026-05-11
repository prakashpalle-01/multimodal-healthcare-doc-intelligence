from collections.abc import Generator
from contextlib import contextmanager

from sqlalchemy.orm import Session

from backend.app.db.database import SessionLocal, init_db

_INITIALIZED = False


def ensure_db_initialized() -> None:
    global _INITIALIZED
    if not _INITIALIZED:
        init_db()
        _INITIALIZED = True


def get_db() -> Generator[Session, None, None]:
    ensure_db_initialized()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    ensure_db_initialized()
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
