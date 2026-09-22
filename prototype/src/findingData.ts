import type { FindingMasterItemData } from "./FindingMasterItem";

// One source for the inbox, dashboard, and Ask Dusk suggestions.
export const findingItems: (FindingMasterItemData & { actorType: string; context: string })[] = [
  { id: "FND-1042", entity: "D. Marek", actorType: "Employee · Finance", context: "3 linked events", timestamp: "Tue 09:12", title: "Payroll transfers to an unregistered personal beneficiary", verdict: "Fraudulent", confidence: "91% confidence", status: "Open" },
  { id: "FND-1043", entity: "agent-treasury", actorType: "AI agent", context: "Board Reserve", timestamp: "Wed 03:20", title: "Treasury activity outside its baseline", verdict: "Suspicious", confidence: "Not scored", status: "Open" },
  { id: "FND-1041", entity: "svc-settle-03", actorType: "Service account", context: "Settlement API", timestamp: "Mon 21:14", title: "Settlement credential used beyond scope", verdict: "Suspicious", confidence: "88% confidence", status: "Open" },
  { id: "FND-1039", entity: "L. Chen", actorType: "External collaborator", context: "Vendor Payments", timestamp: "Mon 11:36", title: "Vendor bank details changed before payout", verdict: "Suspicious", confidence: "84% confidence", status: "Open" },
  { id: "FND-1038", entity: "C. Rivas", actorType: "Employee · Finance", context: "Comp & Equity", timestamp: "Mon 14:02", title: "Payroll approval matches established activity", verdict: "Legitimate", confidence: "98% confidence", status: "Cleared" },
];
