import type { BackendValidationResponse, ValidationIssue } from "../types/extraction";
import { claimSummary, validationIssues } from "./documentsApi";

export { claimSummary, validationIssues };

export async function validateDocument(documentId: string): Promise<{
  score: number;
  issues: ValidationIssue[];
}> {
  const response = await fetch(`/api/v1/validation/${documentId}`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Validation failed with status ${response.status}`);
  }

  const payload = (await response.json()) as BackendValidationResponse;
  return {
    score: payload.score,
    issues: payload.issues.map((issue) => ({
      id: issue.code,
      field: issue.field ?? "Document",
      severity: issue.severity === "error" ? "high" : "medium",
      message: issue.message,
      recommendation: issue.recommendation ?? "Review this item before submission."
    }))
  };
}
