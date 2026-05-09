import AppealEditor from "../components/AppealEditor";

const draft = `To the Medical Review Department,

We are submitting this appeal for reconsideration of the denied claim. The attached prescription, diagnosis support, and clinical documentation indicate that the requested therapy is medically necessary and aligned with the patient's current treatment plan.

The denial appears to cite missing prior authorization support. Please review the attached chart notes, prior therapy history, and prescription details. These materials support approval under the payer's medical necessity criteria.

Sincerely,
Revenue Cycle Review Team`;

export default function AppealDraft() {
  return <AppealEditor draft={draft} />;
}
