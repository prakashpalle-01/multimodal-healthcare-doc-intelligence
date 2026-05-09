import { AlertTriangle, ShieldCheck } from "lucide-react";

import type { ValidationIssue } from "../types/extraction";

interface ValidationResultsProps {
  score: number;
  issues: ValidationIssue[];
}

export default function ValidationResults({ score, issues }: ValidationResultsProps) {
  return (
    <section className="panel" aria-label="Validation results">
      <div className="validation-summary">
        <ShieldCheck size={24} aria-hidden="true" />
        <div>
          <p>Validation score</p>
          <h2>{score}%</h2>
        </div>
      </div>
      <div className="issue-list">
        {issues.map((issue) => (
          <article className={`issue issue-${issue.severity}`} key={issue.id}>
            <AlertTriangle size={18} aria-hidden="true" />
            <div>
              <strong>{issue.field}</strong>
              <p>{issue.message}</p>
              <small>{issue.recommendation}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
