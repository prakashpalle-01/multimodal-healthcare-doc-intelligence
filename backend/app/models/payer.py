from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.database import Base


class PayerRule(Base):
    __tablename__ = "payer_rules"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    payer: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    rule_code: Mapped[str] = mapped_column(String(120), nullable=False)
    field_name: Mapped[str] = mapped_column(String(120), nullable=False)
    trigger_contains: Mapped[str | None] = mapped_column(String(255), nullable=True)
    severity: Mapped[str] = mapped_column(String(40), nullable=False, default="warning")
    message: Mapped[str] = mapped_column(Text, nullable=False)
    recommendation: Mapped[str] = mapped_column(Text, nullable=False)
