from datetime import date
from uuid import UUID

from pydantic import BaseModel


class Claim(BaseModel):
    claim_id: UUID
    payer_id: str
    member_id: str
    service_date: date
    billed_amount: float
    diagnosis_codes: list[str] = []
    procedure_codes: list[str] = []
