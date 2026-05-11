import { Activity, FileCheck2, FileClock, FileWarning } from "lucide-react";

import ConfidenceBadge from "../components/ConfidenceBadge";
import type { HealthcareDocument } from "../types/document";

interface DashboardProps {
  documents: HealthcareDocument[];
  selectedId: string;
  onSelectDocument: (id: string) => void;
}

const statusLabels: Record<HealthcareDocument["status"], string> = {
  queued: "Queued",
  processing: "Processing",
  needs_review: "Needs review",
  validated: "Validated",
  appeal_ready: "Appeal ready"
};

export default function Dashboard({ documents, selectedId, onSelectDocument }: DashboardProps) {
  const needsReview = documents.filter((document) => document.status === "needs_review").length;
  const appealReady = documents.filter((document) => document.status === "appeal_ready").length;
  const avgConfidence = documents.length
    ? Math.round(
        (documents.reduce((total, document) => total + document.confidence, 0) / documents.length) * 100
      )
    : 0;

  return (
    <section className="page-stack">
      <div className="metric-grid">
        <article className="metric">
          <FileClock size={22} aria-hidden="true" />
          <span>Queue</span>
          <strong>{documents.length}</strong>
        </article>
        <article className="metric">
          <FileWarning size={22} aria-hidden="true" />
          <span>Needs review</span>
          <strong>{needsReview}</strong>
        </article>
        <article className="metric">
          <FileCheck2 size={22} aria-hidden="true" />
          <span>Appeal ready</span>
          <strong>{appealReady}</strong>
        </article>
        <article className="metric">
          <Activity size={22} aria-hidden="true" />
          <span>Avg confidence</span>
          <strong>{avgConfidence}%</strong>
        </article>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p>Work queue</p>
            <h2>Documents</h2>
          </div>
          <span className="queue-count">{documents.length} active</span>
        </div>
        <div className="queue-table">
          <div className="queue-head">
            <span>Document</span>
            <span>Payer</span>
            <span>Patient</span>
            <span>Status</span>
            <span>Confidence</span>
          </div>
          {documents.map((document) => (
            <button
              className={`queue-row ${document.id === selectedId ? "active" : ""}`}
              key={document.id}
              onClick={() => onSelectDocument(document.id)}
            >
              <span>
                <strong>{document.filename}</strong>
                <small>{document.type} · {document.submittedAt}</small>
              </span>
              <span>{document.payer}</span>
              <span>{document.patient}</span>
              <span className={`status-pill status-${document.status}`}>{statusLabels[document.status]}</span>
              <ConfidenceBadge value={document.confidence} />
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
