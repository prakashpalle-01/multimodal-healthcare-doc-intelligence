from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.payer import PayerRule


DEFAULT_PAYER_RULES = [
    {
        "payer": "Aetna",
        "rule_code": "aetna_prior_authorization_semaglutide",
        "field_name": "medication",
        "trigger_contains": "semaglutide",
        "severity": "warning",
        "message": "Aetna commonly requires prior authorization evidence for Semaglutide.",
        "recommendation": "Attach prior authorization approval, step therapy, or medical necessity support.",
    },
    {
        "payer": "Aetna",
        "rule_code": "aetna_denial_prior_authorization",
        "field_name": "denial_reason",
        "trigger_contains": "prior authorization",
        "severity": "error",
        "message": "Denial reason indicates missing prior authorization.",
        "recommendation": "Include prior authorization records or submit an appeal with medical necessity evidence.",
    },
    {
        "payer": "UnitedHealthcare",
        "rule_code": "uhc_missing_medical_necessity",
        "field_name": "denial_reason",
        "trigger_contains": "medical necessity",
        "severity": "error",
        "message": "Denial reason indicates missing medical necessity documentation.",
        "recommendation": "Attach chart notes, diagnosis support, and treatment history.",
    },
]


class PayerRuleRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def ensure_seeded(self) -> None:
        existing = self.db.scalar(select(PayerRule.id).limit(1))
        if existing is not None:
            return
        for rule in DEFAULT_PAYER_RULES:
            self.db.add(PayerRule(**rule))
        self.db.flush()

    def list_for_payer(self, payer: str) -> list[PayerRule]:
        self.ensure_seeded()
        rules = self.db.scalars(
            select(PayerRule).where(PayerRule.payer.ilike(payer)).order_by(PayerRule.rule_code)
        ).all()
        return list(rules)
