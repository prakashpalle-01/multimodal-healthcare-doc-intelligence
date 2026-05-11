# Data

This project should not use real patient documents unless the data has gone through the proper legal, privacy, security, and HIPAA review process. For development, use synthetic or public-use data.

## Practical Sources

- CMS Medicare Claims Synthetic Public Use Files: realistic Medicare-style synthetic claims files for software development and training.
  - https://www.cms.gov/data-research/statistics-trends-and-reports/medicare-claims-synthetic-public-use-files
- CMS Blue Button 2.0 sandbox/sample data: synthetic Medicare FHIR resources, especially `ExplanationOfBenefit`.
  - https://api.bluebutton.cms.gov/
  - https://bluebutton.cms.gov/developers/
- Synthea: synthetic patient records with medications, encounters, observations, and FHIR exports.
  - https://synthetichealth.github.io/synthea/

## Local Samples

The `data/samples` folder contains synthetic practical examples that match the current app workflow:

- `sample_claim_denial.txt`
- `sample_prescription_prior_auth.txt`
- `sample_denial_medical_necessity.txt`
- `sample_eob_underpayment.txt`
- `sample_invoice.txt`
- `sample_bluebutton_eob.json`

Upload the `.txt` files through the frontend today. The backend can read text files directly, extract fields, validate payer rules, explain denial reasons, and generate an appeal draft.
