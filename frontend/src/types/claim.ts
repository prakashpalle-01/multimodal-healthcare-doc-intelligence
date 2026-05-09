export interface ClaimSummary {
  claimId: string;
  payer: string;
  memberId: string;
  serviceDate: string;
  billedAmount: string;
  procedureCodes: string[];
  diagnosisCodes: string[];
  validationScore: number;
}
