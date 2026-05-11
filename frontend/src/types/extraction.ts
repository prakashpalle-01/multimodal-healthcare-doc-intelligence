export interface ExtractedField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  source: "OCR" | "Vision" | "Rules" | "RAG";
  needsReview?: boolean;
}

export interface ValidationIssue {
  id: string;
  field: string;
  severity: "low" | "medium" | "high";
  message: string;
  recommendation: string;
}

export interface DenialInsight {
  reasonCode: string;
  summary: string;
  evidence: string[];
  nextAction: string;
}

export interface BackendExtractedField {
  name: string;
  value: string;
  confidence: number;
  source: string;
}

export interface BackendValidationIssue {
  code: string;
  field: string | null;
  message: string;
  severity: string;
  recommendation: string | null;
}

export interface BackendValidationResponse {
  document_id: string | null;
  valid: boolean;
  issues: BackendValidationIssue[];
  score: number;
}
