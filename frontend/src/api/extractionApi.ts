import type { BackendExtractedField, ExtractedField } from "../types/extraction";
import { extractedFields } from "./documentsApi";

interface ExtractionResponse {
  document_id: string;
  document_type: string;
  fields: BackendExtractedField[];
  text: string;
  status: string;
}

export { extractedFields };

export async function extractDocumentFields(documentId: string): Promise<ExtractedField[]> {
  const response = await fetch(`/api/v1/extraction/${documentId}`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Extraction failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ExtractionResponse;
  return payload.fields.map((field) => ({
    id: `${payload.document_id}-${field.name}`,
    label: field.name.replace(/_/g, " "),
    value: field.value,
    confidence: field.confidence,
    source: "OCR",
    needsReview: field.confidence < 0.75
  }));
}
