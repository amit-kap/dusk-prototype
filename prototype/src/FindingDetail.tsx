import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { FindingMasterItemData } from "./FindingMasterItem";
import { FindingLinkedAccounts } from "./FindingLinkedAccounts";
import type { EvidenceTarget, LinkedAccountId } from "./findingLinkedAccountsData";
import { PaymentChain } from "./PaymentChain";

type FindingDetailProps = {
  item: FindingMasterItemData;
};

type Evidence = {
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
const evidence: Evidence[] = [
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

export function FindingDetail({ item }: FindingDetailProps) {
  const [linkedAccountFocus, setLinkedAccountFocus] = useState<{ accountId: LinkedAccountId; serial: number } | null>(null);

  const focusEvidence = (target: EvidenceTarget) => {
    const evidenceItem = document.getElementById(`evidence-${target}`);
    evidenceItem?.scrollIntoView({ block: "center", behavior: "auto" });
    evidenceItem?.focus({ preventScroll: true });
  };

  const focusLinkedAccount = (accountId: LinkedAccountId) => {
    setLinkedAccountFocus((current) => ({ accountId, serial: (current?.serial ?? 0) + 1 }));
  };

  if (item.id !== "FND-1042") {
    return (
      <section className="finding-detail-empty" aria-live="polite">
        <Badge className={`finding-badge tone-${item.verdict.toLowerCase()}`} variant={item.verdict === "Legitimate" ? "success" : "warning"} label={item.verdict} />
        <h2>{item.title}</h2>
        <p>{item.entity} · {item.timestamp}</p>
        <span>Detailed evidence is not included in this prototype yet.</span>
      </section>
    );
  }

  return (
    <article className="finding-detail-content" aria-labelledby="finding-detail-title">
      <header className="finding-detail-header">
        <div className="finding-detail-status">
          <Badge className="finding-badge tone-fraudulent" variant="error" label="Fraudulent" />
          <span>91% confidence</span>
          <span className="finding-detail-open">Open</span>
          <div className="finding-detail-actions">
            <Button label="Open investigation" variant="primary" size="md" />
            <Button label="Assign" variant="secondary" size="md" />
          </div>
        </div>
        <h2 id="finding-detail-title">{item.title}</h2>
        <p className="finding-detail-meta">FND-1042 · D. Marek · 4 linked activity events · 1 earlier authority record</p>
        <p className="finding-detail-summary">Previously dormant approval rights were used to access payroll and route two payments to an unregistered personal beneficiary. The funds were withdrawn that evening.</p>
        <div className="finding-detail-reasoning" aria-labelledby="finding-why-flagged-title">
          <h3 id="finding-why-flagged-title">Why flagged</h3>
          <p>Dormant authority · activity 12× baseline · unregistered payee · same-day withdrawal.</p>
          <p>Confidence applies to the activity pattern. Attribution to Marek remains unverified.</p>
        </div>
      </header>

      <section className="finding-recommendation" aria-labelledby="recommendation-title">
        <h3 id="recommendation-title">Recommended action</h3>
        <p>Verify the two transfers and approval scope before restricting further payments. Beneficiary ownership and session control remain unverified.</p>
      </section>

      <PaymentChain />

      <section className="finding-evidence" aria-labelledby="evidence-title">
        <h3 id="evidence-title">Evidence timeline</h3>
        <p className="finding-evidence-provenance">Calendar dates and the authority time are illustrative. Activity times follow the exercise; the order of the two 09:40 transfers is not provided.</p>
        <div className="finding-timeline">
          {evidence.map((event) => (
            <div className="finding-timeline-item" id={`evidence-${event.id}`} key={event.id} role="group" aria-labelledby={`evidence-${event.id}-title`} tabIndex={-1}>
              <div className="finding-timeline-track" aria-hidden="true"><span className={event.active ? "is-active" : ""} /></div>
              <div className="finding-timeline-copy">
                <div className="finding-timeline-meta"><span>{event.time}</span><span>{event.source}</span></div>
                <h4 id={`evidence-${event.id}-title`}>{event.title}</h4>
                <p>{event.description}</p>
                <div className="finding-timeline-actions">
                  {event.actions.map(({ label, accountId }) => <Button key={label} label={label} variant="ghost" size="sm" endContent={<ArrowRight size={14} />} onClick={accountId ? () => focusLinkedAccount(accountId) : undefined} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="finding-linked-accounts-slot">
        <FindingLinkedAccounts focusRequest={linkedAccountFocus} onNavigateEvidence={focusEvidence} />
      </div>
    </article>
  );
}
