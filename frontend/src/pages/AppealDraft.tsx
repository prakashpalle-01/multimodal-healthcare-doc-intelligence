import AppealEditor from "../components/AppealEditor";

export const fallbackDraft = `To the Medical Review Department,

We are submitting this appeal for reconsideration of the denied claim. The attached prescription, diagnosis support, and clinical documentation indicate that the requested therapy is medically necessary and aligned with the patient's current treatment plan.

The denial appears to cite missing prior authorization support. Please review the attached chart notes, prior therapy history, and prescription details. These materials support approval under the payer's medical necessity criteria.

Sincerely,
Revenue Cycle Review Team`;

interface AppealDraftProps {
  draft?: string;
  statusMessage: string;
  onGenerateAppeal: () => void;
}

export default function AppealDraft({ draft, statusMessage, onGenerateAppeal }: AppealDraftProps) {
  const activeDraft = draft ?? fallbackDraft;

  return (
    <div className="page-stack">
      <section className="workflow-banner">
        <strong>{statusMessage}</strong>
        <button className="primary-button" onClick={onGenerateAppeal}>
          Generate appeal
        </button>
      </section>
      <AppealEditor draft={activeDraft} />
    </div>
  );
}
