export type CaseRecord = {
  id: string;
  name: string;
  purpose: string;
  owner: string;
  status: "Triage" | "Investigating" | "In review" | "Closed";
  priority: string;
  updated: string;
  findingIds: string[];
};

// Illustrative cases from the dashboard. Associations are demo hypotheses,
// not an assertion that an actor is responsible for the underlying activity.
export const initialCases: CaseRecord[] = [
  { id: "INV-205", name: "Treasury counterparty review", purpose: "Review treasury activity outside its baseline and determine whether the counterparty and timing were authorized.", owner: "Noam Levi", status: "Triage", priority: "High", updated: "Wed 03:34", findingIds: ["FND-1043"] },
  { id: "INV-203", name: "Settlement credential exposure", purpose: "Establish the scope of settlement credential use and whether the expanded access was authorized.", owner: "Carla Rivas", status: "Investigating", priority: "High", updated: "Mon", findingIds: ["FND-1041"] },
  { id: "INV-202", name: "Vendor beneficiary change", purpose: "Verify the bank detail change before payout and establish who authorized the new beneficiary.", owner: "Maya Cohen", status: "In review", priority: "High", updated: "Mon", findingIds: ["FND-1039"] },
  { id: "INV-201", name: "Payroll approval verification", purpose: "Review payroll approval against established activity.", owner: "Noam Levi", status: "Closed", priority: "Normal", updated: "Mon", findingIds: ["FND-1038"] },
];

