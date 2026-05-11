import DocumentViewer from "../components/DocumentViewer";
import ExtractedFieldsPanel from "../components/ExtractedFieldsPanel";
import type { HealthcareDocument } from "../types/document";
import type { ExtractedField } from "../types/extraction";

interface DocumentReviewProps {
  document: HealthcareDocument;
  fields: ExtractedField[];
  workflowMessage: string;
}

export default function DocumentReview({ document, fields, workflowMessage }: DocumentReviewProps) {
  return (
    <div className="page-stack">
      <section className="workflow-banner">
        <strong>{document.filename}</strong>
        <span>{workflowMessage}</span>
      </section>
      <section className="review-grid">
        <DocumentViewer document={document} />
        <ExtractedFieldsPanel fields={fields} />
      </section>
    </div>
  );
}
