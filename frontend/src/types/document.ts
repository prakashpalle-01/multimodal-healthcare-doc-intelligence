export type DocumentStatus = "queued" | "processing" | "needs_review" | "validated" | "appeal_ready";

export type DocumentType = "Prescription" | "Claim" | "EOB" | "Denial letter" | "Invoice";

export interface HealthcareDocument {
  id: string;
  filename: string;
  type: DocumentType;
  payer: string;
  patient: string;
  submittedAt: string;
  status: DocumentStatus;
  confidence: number;
}

export interface AuditEvent {
  id: string;
  label: string;
  actor: string;
  timestamp: string;
  detail: string;
}
