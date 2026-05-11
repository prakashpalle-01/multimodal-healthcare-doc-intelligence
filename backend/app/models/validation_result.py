from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.database import Base


class ValidationResult(Base):
    __tablename__ = "validation_results"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    document_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("documents.document_id"),
        index=True,
        nullable=False,
    )
    valid: Mapped[bool] = mapped_column(Boolean, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    issue_code: Mapped[str | None] = mapped_column(String(120), nullable=True)
    issue_field: Mapped[str | None] = mapped_column(String(120), nullable=True)
    issue_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    issue_severity: Mapped[str | None] = mapped_column(String(40), nullable=True)
    issue_recommendation: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
