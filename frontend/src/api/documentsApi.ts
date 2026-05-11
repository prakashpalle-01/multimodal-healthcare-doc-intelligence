import type { AuditEvent, HealthcareDocument } from "../types/document";
import type { ClaimSummary } from "../types/claim";
import type { DenialInsight, ExtractedField, ValidationIssue } from "../types/extraction";

export const documents: HealthcareDocument[] = [
  {
    id: "doc-1048",
    filename: "rx-prior-auth-jane-smith.pdf",
    type: "Prescription",
    payer: "Aetna",
    patient: "Jane Smith",
    submittedAt: "08:42 AM",
    status: "needs_review",
    confidence: 0.86
  },
  {
    id: "doc-1049",
    filename: "claim-883921-eob.pdf",
    type: "EOB",
    payer: "Blue Cross",
    patient: "Marcus Reed",
    submittedAt: "09:11 AM",
    status: "validated",
    confidence: 0.93
  },
  {
    id: "doc-1050",
    filename: "denial-letter-knee-mri.pdf",
    type: "Denial letter",
    payer: "UnitedHealthcare",
    patient: "Nora Patel",
    submittedAt: "09:37 AM",
    status: "appeal_ready",
    confidence: 0.91
  },
  {
    id: "doc-1051",
    filename: "invoice-lab-panel-4421.pdf",
    type: "Invoice",
    payer: "Cigna",
    patient: "Owen Carter",
    submittedAt: "10:02 AM",
    status: "processing",
    confidence: 0.74
  }
];

export const extractedFields: ExtractedField[] = [
  {
    id: "field-1",
    label: "Patient name",
    value: "Jane Smith",
    confidence: 0.97,
    source: "OCR"
  },
  {
    id: "field-2",
    label: "Medication",
    value: "Semaglutide 0.5 mg",
    confidence: 0.89,
    source: "OCR"
  },
  {
    id: "field-3",
    label: "NDC",
    value: "0169-4132-12",
    confidence: 0.72,
    source: "Vision",
    needsReview: true
  },
  {
    id: "field-4",
    label: "Prescriber",
    value: "Dr. Elena Morris",
    confidence: 0.94,
    source: "OCR"
  },
  {
    id: "field-5",
    label: "Diagnosis",
    value: "E11.9 Type 2 diabetes mellitus",
    confidence: 0.81,
    source: "Rules",
    needsReview: true
  }
];

export const validationIssues: ValidationIssue[] = [
  {
    id: "issue-1",
    field: "NDC",
    severity: "medium",
    message: "Drug code confidence is below the payer auto-submit threshold.",
    recommendation: "Verify the NDC against the original prescription image."
  },
  {
    id: "issue-2",
    field: "Prior authorization",
    severity: "high",
    message: "Payer rule requires prior authorization for this dose escalation.",
    recommendation: "Attach previous therapy evidence before submission."
  },
  {
    id: "issue-3",
    field: "Diagnosis",
    severity: "low",
    message: "Diagnosis code is present but lacks chart-note support.",
    recommendation: "Request recent A1C or visit notes from the chart."
  }
];

export const claimSummary: ClaimSummary = {
  claimId: "CLM-883921",
  payer: "Aetna",
  memberId: "M-204991",
  serviceDate: "May 3, 2026",
  billedAmount: "$1,284.00",
  procedureCodes: ["J3490", "99214"],
  diagnosisCodes: ["E11.9", "Z79.4"],
  validationScore: 82
};

export const denialInsight: DenialInsight = {
  reasonCode: "PA-204",
  summary:
    "The denial is most likely tied to missing prior authorization evidence and incomplete medical necessity support.",
  evidence: [
    "Payer policy requires documented step therapy before dose escalation.",
    "Claim includes diagnosis E11.9 but no attached lab trend or chart note.",
    "Extracted NDC confidence is below the internal review threshold."
  ],
  nextAction: "Verify NDC, attach chart notes, then generate a medical necessity appeal draft."
};

export const auditEvents: AuditEvent[] = [
  {
    id: "audit-1",
    label: "Document uploaded",
    actor: "Intake team",
    timestamp: "08:42 AM",
    detail: "Prescription PDF added to the review queue."
  },
  {
    id: "audit-2",
    label: "OCR completed",
    actor: "PaddleOCR worker",
    timestamp: "08:43 AM",
    detail: "Five candidate fields extracted from page one."
  },
  {
    id: "audit-3",
    label: "Validation flagged",
    actor: "Payer rules engine",
    timestamp: "08:44 AM",
    detail: "Prior authorization requirement detected for Aetna."
  },
  {
    id: "audit-4",
    label: "Appeal suggested",
    actor: "RAG service",
    timestamp: "08:45 AM",
    detail: "Matched payer policy and recommended medical necessity appeal."
  }
];

interface UploadResponse {
  document_id: string;
  filename: string;
  content_type: string | null;
  status: string;
  document_type: string;
}

interface DocumentRecordResponse extends UploadResponse {
  storage_path: string;
  size_bytes: number;
  ocr_text: string | null;
}

const documentTypeLabels: Record<string, HealthcareDocument["type"]> = {
  prescription: "Prescription",
  claim: "Claim",
  eob: "EOB",
  denial_letter: "Denial letter",
  invoice: "Invoice",
  unknown: "Claim"
};

const statusLabels: Record<string, HealthcareDocument["status"]> = {
  staged: "queued",
  ocr_completed: "processing",
  extraction_completed: "needs_review",
  validated: "validated",
  appeal_ready: "appeal_ready"
};

function mapBackendDocument(payload: UploadResponse): HealthcareDocument {
  return {
    id: payload.document_id,
    filename: payload.filename,
    type: documentTypeLabels[payload.document_type] ?? "Claim",
    payer: "Pending classification",
    patient: "Pending extraction",
    submittedAt: "Saved",
    status: statusLabels[payload.status] ?? "queued",
    confidence: 0
  };
}

export function createLocalDocument(filename: string): HealthcareDocument {
  return {
    id: `doc-${Date.now()}`,
    filename,
    type: "Claim",
    payer: "Pending classification",
    patient: "Pending extraction",
    submittedAt: "Now",
    status: "queued",
    confidence: 0
  };
}

export async function uploadDocument(file: File): Promise<HealthcareDocument> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/v1/documents", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const payload = (await response.json()) as UploadResponse;
    return { ...mapBackendDocument(payload), submittedAt: "Now" };
  } catch {
    return createLocalDocument(file.name);
  }
}

export async function fetchDocuments(): Promise<HealthcareDocument[]> {
  const response = await fetch("/api/v1/documents");

  if (!response.ok) {
    throw new Error(`Document fetch failed with status ${response.status}`);
  }

  const payload = (await response.json()) as DocumentRecordResponse[];
  return payload.map(mapBackendDocument);
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch("/api/v1/health");
    return response.ok;
  } catch {
    return false;
  }
}
