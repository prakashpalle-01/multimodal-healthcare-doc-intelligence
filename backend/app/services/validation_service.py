from uuid import UUID

from backend.app.db.repositories.audit_repository import ValidationResultRepository
from backend.app.db.repositories.claim_repository import PayerRuleRepository
from backend.app.db.session import session_scope
from backend.app.schemas.extraction_schema import ExtractedField
from backend.app.schemas.validation_schema import ValidationIssue, ValidationRequest, ValidationResponse
from backend.app.services.extraction_service import ExtractionService

REQUIRED_FIELDS = {
    "patient_name": "Patient name is required for downstream validation.",
    "payer": "Payer is required to evaluate payer-specific rules.",
}


class ValidationService:
    def validate_document(self, document_id: UUID) -> ValidationResponse:
        extraction = ExtractionService().extract_from_document(document_id)
        response = self.validate(ValidationRequest(document_id=document_id, fields=extraction.fields))
        with session_scope() as db:
            ValidationResultRepository(db).replace_for_document(response)
        return response

    def validate(self, request: ValidationRequest) -> ValidationResponse:
        issues: list[ValidationIssue] = []
        fields_by_name = {field.name: field for field in request.fields}

        for field_name, message in REQUIRED_FIELDS.items():
            if field_name not in fields_by_name:
                issues.append(
                    ValidationIssue(
                        code="missing_required_field",
                        field=field_name,
                        message=message,
                        severity="error",
                        recommendation="Review OCR output and manually enter the missing field.",
                    )
                )

        for field in request.fields:
            issues.extend(self._validate_field_confidence(field))

        medication = fields_by_name.get("medication")
        denial_reason = fields_by_name.get("denial_reason")
        if medication and not denial_reason:
            issues.append(
                ValidationIssue(
                    code="payer_rule_prior_authorization_check",
                    field="medication",
                    message="Medication-related documents should be checked for prior authorization requirements.",
                    severity="warning",
                    recommendation="Attach prior authorization evidence when required by the payer.",
                )
            )

        issues.extend(self._validate_payer_rules(fields_by_name))

        score = self._score(issues)
        return ValidationResponse(
            document_id=request.document_id,
            valid=not any(issue.severity == "error" for issue in issues),
            issues=issues,
            score=score,
        )

    def _validate_field_confidence(self, field: ExtractedField) -> list[ValidationIssue]:
        if field.confidence >= 0.75:
            return []
        return [
            ValidationIssue(
                code="low_confidence_field",
                field=field.name,
                message=f"{field.name} confidence is below the review threshold.",
                severity="warning",
                recommendation="Compare the extracted value with the original document before submission.",
            )
        ]

    def _score(self, issues: list[ValidationIssue]) -> int:
        score = 100
        for issue in issues:
            score -= 20 if issue.severity == "error" else 8
        return max(score, 0)

    def _validate_payer_rules(self, fields_by_name: dict[str, ExtractedField]) -> list[ValidationIssue]:
        payer = fields_by_name.get("payer")
        if payer is None:
            return []

        issues: list[ValidationIssue] = []
        with session_scope() as db:
            rules = PayerRuleRepository(db).list_for_payer(payer.value)
            for rule in rules:
                field = fields_by_name.get(rule.field_name)
                if field is None:
                    continue
                if rule.trigger_contains and rule.trigger_contains.lower() not in field.value.lower():
                    continue
                issues.append(
                    ValidationIssue(
                        code=rule.rule_code,
                        field=rule.field_name,
                        message=rule.message,
                        severity=rule.severity,
                        recommendation=rule.recommendation,
                    )
                )
        return issues
