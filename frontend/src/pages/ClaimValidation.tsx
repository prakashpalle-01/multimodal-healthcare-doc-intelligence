import ValidationResults from "../components/ValidationResults";
import type { ClaimSummary } from "../types/claim";
import type { ValidationIssue } from "../types/extraction";

interface ClaimValidationProps {
  claim: ClaimSummary;
  issues: ValidationIssue[];
  score: number;
  statusMessage: string;
  onRunValidation: () => void;
}

export default function ClaimValidation({
  claim,
  issues,
  score,
  statusMessage,
  onRunValidation
}: ClaimValidationProps) {
  return (
    <div className="page-stack">
      <section className="workflow-banner">
        <strong>{statusMessage}</strong>
        <button className="primary-button" onClick={onRunValidation}>
          Run validation
        </button>
      </section>
      <section className="validation-grid">
        <section className="panel claim-panel">
          <div className="panel-heading">
            <div>
              <p>Claim</p>
              <h2>{claim.claimId}</h2>
            </div>
            <span className="score-ring">{score}%</span>
          </div>
          <dl className="claim-details">
            <div>
              <dt>Payer</dt>
              <dd>{claim.payer}</dd>
            </div>
            <div>
              <dt>Member ID</dt>
              <dd>{claim.memberId}</dd>
            </div>
            <div>
              <dt>Service date</dt>
              <dd>{claim.serviceDate}</dd>
            </div>
            <div>
              <dt>Billed amount</dt>
              <dd>{claim.billedAmount}</dd>
            </div>
            <div>
              <dt>Procedure codes</dt>
              <dd>{claim.procedureCodes.join(", ")}</dd>
            </div>
            <div>
              <dt>Diagnosis codes</dt>
              <dd>{claim.diagnosisCodes.join(", ")}</dd>
            </div>
          </dl>
        </section>
        <ValidationResults score={score} issues={issues} />
      </section>
    </div>
  );
}
