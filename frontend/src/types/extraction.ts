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
