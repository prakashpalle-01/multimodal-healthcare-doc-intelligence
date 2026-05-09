import { Check, CircleAlert } from "lucide-react";

import type { ExtractedField } from "../types/extraction";
import ConfidenceBadge from "./ConfidenceBadge";

interface ExtractedFieldsPanelProps {
  fields: ExtractedField[];
}

export default function ExtractedFieldsPanel({ fields }: ExtractedFieldsPanelProps) {
  return (
    <section className="panel" aria-label="Extracted fields">
      <div className="panel-heading">
        <div>
          <p>OCR extraction</p>
          <h2>Structured fields</h2>
        </div>
      </div>
      <div className="field-list">
        {fields.map((field) => (
          <article className="field-row" key={field.id}>
            <div className="field-status">
              {field.needsReview ? (
                <CircleAlert size={17} aria-label="Needs review" />
              ) : (
                <Check size={17} aria-label="Verified" />
              )}
            </div>
            <div>
              <span>{field.label}</span>
              <strong>{field.value}</strong>
              <small>{field.source}</small>
            </div>
            <ConfidenceBadge value={field.confidence} />
          </article>
        ))}
      </div>
    </section>
  );
}
