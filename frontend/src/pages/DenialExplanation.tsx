import { Lightbulb, ListChecks } from "lucide-react";

import type { DenialInsight } from "../types/extraction";

interface DenialExplanationProps {
  insight: DenialInsight;
  statusMessage: string;
  onExplainDenial: () => void;
}

export default function DenialExplanation({
  insight,
  statusMessage,
  onExplainDenial
}: DenialExplanationProps) {
  return (
    <div className="page-stack">
      <section className="workflow-banner">
        <strong>{statusMessage}</strong>
        <button className="primary-button" onClick={onExplainDenial}>
          Explain denial
        </button>
      </section>
      <section className="denial-grid">
        <section className="panel">
          <div className="reason-code">{insight.reasonCode}</div>
          <h2>Denial explanation</h2>
          <p className="large-copy">{insight.summary}</p>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p>Evidence</p>
              <h2>Rule citations</h2>
            </div>
            <ListChecks size={22} aria-hidden="true" />
          </div>
          <ul className="evidence-list">
            {insight.evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="panel next-action">
          <Lightbulb size={24} aria-hidden="true" />
          <div>
            <p>Recommended action</p>
            <strong>{insight.nextAction}</strong>
          </div>
        </section>
      </section>
    </div>
  );
}
