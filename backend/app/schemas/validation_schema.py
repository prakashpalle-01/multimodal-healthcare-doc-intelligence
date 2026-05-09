from pydantic import BaseModel


class ValidationIssue(BaseModel):
    code: str
    message: str
    severity: str = "warning"


class ValidationResponse(BaseModel):
    valid: bool
    issues: list[ValidationIssue] = []
