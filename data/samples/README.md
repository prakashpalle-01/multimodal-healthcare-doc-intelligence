# Synthetic Practical Samples

These files are safe, synthetic examples designed to behave like practical healthcare operations documents without containing PHI.

Use the `.txt` files for the current upload workflow:

1. Start the backend on `localhost:8000`.
2. Start the frontend on `localhost:5173`.
3. Upload one of the `.txt` files.
4. Review extracted fields and validation/denial behavior.

The JSON sample is a simplified FHIR `ExplanationOfBenefit` inspired by CMS Blue Button-style data. It is included for future API/parser work.
