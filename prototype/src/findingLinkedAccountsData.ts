export type EvidenceTarget = "authority" | "access" | "transfer-1" | "transfer-2" | "withdrawal";

export type LinkedAccountId = "comp-equity-payroll" | "payroll-master-eu" | "personal-beneficiary";

export type LinkedAccountFact = {
  label: string;
  value: string;
};

export type LinkedAccountSource = {
  label: string;
  target: EvidenceTarget;
};

export type LinkedAccount = {
  id: LinkedAccountId;
  account: string;
  role: string;
  summary: string;
  badge?: "Critical" | "Unregistered payee";
  facts: LinkedAccountFact[];
  sources: LinkedAccountSource[];
};

export const linkedAccounts: LinkedAccount[] = [
  {
    id: "comp-equity-payroll",
    account: "FY24 Comp & Equity Payroll",
    role: "Internal payroll source",
    summary: "Linked access evidence · ledger class 641",
    badge: "Critical",
    facts: [
      { label: "Sensitivity", value: "PII, financial, HR" },
      { label: "Ledger class", value: "641" },
      { label: "Approval context", value: "Dormant quarter-close approval rights were granted six months earlier and were never revoked." },
      { label: "Relevant activity", value: "Tue 09:12 · Access and payment queue activity recorded under D. Marek’s credentials." },
      { label: "Attribution", value: "The credentials are associated with D. Marek; identity attribution remains unverified." },
      { label: "Exposure", value: "2 external beneficiaries" },
      { label: "Account risk score", value: "87" },
      { label: "Payment amount", value: "Not provided" },
    ],
    sources: [
      { label: "View authority evidence", target: "authority" },
      { label: "View access evidence", target: "access" },
    ],
  },
  {
    id: "payroll-master-eu",
    account: "Payroll Master — EU",
    role: "Internal payroll source",
    summary: "Linked transfer evidence · ledger class 642",
    badge: "Critical",
    facts: [
      { label: "Sensitivity", value: "PII, financial" },
      { label: "Ledger class", value: "642" },
      { label: "Relevant activity", value: "Tue 09:40 · Transfer activity recorded under D. Marek’s credentials." },
      { label: "Observed event", value: "Two transfers to an unregistered personal beneficiary were recorded at 09:40." },
      { label: "Attribution", value: "The credentials are associated with D. Marek; identity attribution remains unverified." },
      { label: "Exposure", value: "Internal only" },
      { label: "Account risk score", value: "72" },
      { label: "Payment amount", value: "Not provided" },
    ],
    sources: [
      { label: "View transfer 1 evidence", target: "transfer-1" },
      { label: "View transfer 2 evidence", target: "transfer-2" },
      { label: "View access evidence", target: "access" },
    ],
  },
  {
    id: "personal-beneficiary",
    account: "Personal beneficiary",
    role: "External destination",
    summary: "j.doe.personal@gmail · subsequent withdrawal",
    badge: "Unregistered payee",
    facts: [
      { label: "Identifier", value: "j.doe.personal@gmail · Bank account identifier not provided" },
      { label: "Account coverage", value: "External destination; not included in the 14 accessed accounts." },
      { label: "Relevant activity", value: "Tue 09:40 · Two transfers were recorded. Tue 22:07 · A withdrawal was recorded under j.doe.personal." },
      { label: "Withdrawal context", value: "The withdrawal was from an unrecognized device in a new geography." },
      { label: "Sensitivity", value: "Not provided" },
      { label: "Ledger class", value: "Not provided" },
      { label: "Exposure and risk", value: "Not provided" },
      { label: "Payment amount", value: "Not provided" },
      { label: "Verification", value: "Beneficiary ownership and withdrawal-session control remain unverified." },
    ],
    sources: [
      { label: "View transfer 1 evidence", target: "transfer-1" },
      { label: "View transfer 2 evidence", target: "transfer-2" },
      { label: "View withdrawal evidence", target: "withdrawal" },
    ],
  },
];
