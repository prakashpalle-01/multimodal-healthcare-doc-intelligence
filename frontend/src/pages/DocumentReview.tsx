import DocumentViewer from "../components/DocumentViewer";
import ExtractedFieldsPanel from "../components/ExtractedFieldsPanel";
import type { HealthcareDocument } from "../types/document";
import type { ExtractedField } from "../types/extraction";

interface DocumentReviewProps {
  document: HealthcareDocument;
  fields: ExtractedField[];
}

export default function DocumentReview({ document, fields }: DocumentReviewProps) {
  return (
    <section className="review-grid">
      <DocumentViewer document={document} />
      <ExtractedFieldsPanel fields={fields} />
    </section>
  );
}
