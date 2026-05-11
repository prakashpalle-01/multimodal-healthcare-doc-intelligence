from uuid import UUID

from sqlalchemy import delete
from sqlalchemy.orm import Session

from backend.app.models.extraction_result import ExtractionResult
from backend.app.models.validation_result import ValidationResult
from backend.app.schemas.extraction_schema import ExtractedField
from backend.app.schemas.validation_schema import ValidationIssue, ValidationResponse


class ExtractionResultRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def replace_for_document(self, document_id: UUID, fields: list[ExtractedField]) -> None:
        self.db.execute(delete(ExtractionResult).where(ExtractionResult.document_id == str(document_id)))
        for field in fields:
            self.db.add(
                ExtractionResult(
                    document_id=str(document_id),
                    name=field.name,
                    value=field.value,
                    confidence=field.confidence,
                    source=field.source,
                )
            )
        self.db.flush()


class ValidationResultRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def replace_for_document(self, response: ValidationResponse) -> None:
        if response.document_id is None:
            return
        document_id = str(response.document_id)
        self.db.execute(delete(ValidationResult).where(ValidationResult.document_id == document_id))
        if not response.issues:
            self.db.add(
                ValidationResult(
                    document_id=document_id,
                    valid=response.valid,
                    score=response.score,
                )
            )
            self.db.flush()
            return

        for issue in response.issues:
            self.db.add(self._issue_to_model(document_id, response, issue))
        self.db.flush()

    def _issue_to_model(
        self,
        document_id: str,
        response: ValidationResponse,
        issue: ValidationIssue,
    ) -> ValidationResult:
        return ValidationResult(
            document_id=document_id,
            valid=response.valid,
            score=response.score,
            issue_code=issue.code,
            issue_field=issue.field,
            issue_message=issue.message,
            issue_severity=issue.severity,
            issue_recommendation=issue.recommendation,
        )
