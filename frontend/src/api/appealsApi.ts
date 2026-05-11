import type { DenialInsight } from "../types/extraction";
import { denialInsight } from "./documentsApi";

export { denialInsight };

interface DenialExplanationResponse {
  document_id: string;
  reason_code: string;
  summary: string;
  evidence: string[];
  next_action: string;
}

interface AppealDraftResponse {
  appeal_id: string;
  draft_text: string;
  citations: string[];
}

export async function explainDenial(documentId: string): Promise<DenialInsight> {
  const response = await fetch(`/api/v1/denials/${documentId}`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Denial explanation failed with status ${response.status}`);
  }

  const payload = (await response.json()) as DenialExplanationResponse;
  return {
    reasonCode: payload.reason_code,
    summary: payload.summary,
    evidence: payload.evidence,
    nextAction: payload.next_action
  };
}

export async function generateAppealDraft(documentId: string): Promise<string> {
  const response = await fetch(`/api/v1/appeals/${documentId}`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Appeal generation failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AppealDraftResponse;
  return payload.draft_text;
}
