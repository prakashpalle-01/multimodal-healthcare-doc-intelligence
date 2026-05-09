import ValidationResults from "../components/ValidationResults";
import type { ClaimSummary } from "../types/claim";
import type { ValidationIssue } from "../types/extraction";

interface ClaimValidationProps {
  claim: ClaimSummary;
  issues: ValidationIssue[];
}

export default function ClaimValidation({ claim, issues }: ClaimValidationProps) {
  return (
    <section className="validation-grid">
      <section className="panel claim-panel">
        <div className="panel-heading">
          <div>
            <p>Claim</p>
            <h2>{claim.claimId}</h2>
          </div>
          <span className="score-ring">{claim.validationScore}%</span>
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
      <ValidationResults score={claim.validationScore} issues={issues} />
    </section>
  );
}
