import { Button } from "@astryxdesign/core/Button";
import { ArrowRight } from "lucide-react";
import type { EvidenceTarget, LinkedAccountId } from "./findingLinkedAccountsData";

export type FindingEvidenceEvent = {
  id: EvidenceTarget;
  time: string;
  source: string;
  title: string;
  description: string;
  actions: { label: string; accountId?: LinkedAccountId }[];
  active?: boolean;
};

// Calendar dates and the authority time are illustrative demo data. The four
// activity times follow the exercise; transfer numbers do not establish order.
export const findingEvidence: FindingEvidenceEvent[] = [
  {
    id: "withdrawal",
    time: "Tue, 15 Sep 2026 · 22:07 · Latest event",
    source: "Personal beneficiary",
    title: "Funds were withdrawn",
    description: "The funds were withdrawn from an unrecognized device in a new geography. Control of the withdrawal session remains unverified.",
    actions: [{ label: "Open withdrawal event" }],
    active: true,
  },
  {
    id: "transfer-1",
    time: "Tue, 15 Sep 2026 · 09:40",
    source: "Payroll Master — EU",
    title: "Transfer 1 · Unregistered personal beneficiary",
    description: "One of the two payments was routed from Payroll Master — EU to a personal account not listed in the payee master. Payment amount: Not provided.",
    actions: [
      { label: "View source account", accountId: "payroll-master-eu" },
      { label: "View beneficiary", accountId: "personal-beneficiary" },
    ],
  },
  {
    id: "transfer-2",
    time: "Tue, 15 Sep 2026 · 09:40",
    source: "Payroll Master — EU",
    title: "Transfer 2 · Unregistered personal beneficiary",
    description: "The other payment was also routed from Payroll Master — EU to the unregistered personal beneficiary. Payment amount: Not provided.",
    actions: [
      { label: "View source account", accountId: "payroll-master-eu" },
      { label: "View beneficiary", accountId: "personal-beneficiary" },
    ],
  },
  {
    id: "access",
    time: "Tue, 15 Sep 2026 · 09:12",
    source: "FY24 Comp & Equity Payroll",
    title: "Dormant approval rights used to access payroll",
    description: "14 Critical finance accounts were accessed and payments queued within 20 minutes, at 12× normal volume.",
    actions: [{ label: "Open access event" }, { label: "Open affected accounts", accountId: "comp-equity-payroll" }],
  },
  {
    id: "authority",
    time: "Mon, 16 Mar 2026 · 10:00 · Demo timestamp",
    source: "Quarter-close project",
    title: "Approval authority stayed active",
    description: "Broad approval rights were granted for quarter close and were never revoked after the project ended.",
    actions: [{ label: "Open authority record" }],
  },
];

export type FindingEvidenceTimelineProps = { events?: FindingEvidenceEvent[]; provenance?: string; onOpenAccount?: (accountId: LinkedAccountId) => void };

export function FindingEvidenceTimeline({ events = findingEvidence, provenance = "Calendar dates and the authority time are illustrative. Activity times follow the exercise; the order of the two 09:40 transfers is not provided.", onOpenAccount }: FindingEvidenceTimelineProps) {
  return (
    <section className="finding-evidence" aria-labelledby="evidence-title">
      <h3 id="evidence-title">Evidence timeline</h3>
      <p className="finding-evidence-provenance">{provenance}</p>
      <div className="finding-timeline">
        {events.map((event) => (
          <div className="finding-timeline-item" id={`evidence-${event.id}`} key={event.id} role="group" aria-labelledby={`evidence-${event.id}-title`} tabIndex={-1}>
            <div className="finding-timeline-track" aria-hidden="true"><span className={event.active ? "is-active" : ""} /></div>
            <div className="finding-timeline-copy">
              <div className="finding-timeline-meta"><span>{event.time}</span><span>{event.source}</span></div>
              <h4 id={`evidence-${event.id}-title`}>{event.title}</h4>
              <p>{event.description}</p>
              <div className="finding-timeline-actions">
                {event.actions.map(({ label, accountId }) => <Button key={label} label={label} variant="ghost" size="sm" endContent={<ArrowRight size={14} />} onClick={accountId ? () => onOpenAccount?.(accountId) : undefined} />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
