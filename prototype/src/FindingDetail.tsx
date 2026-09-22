import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { ArrowRight, ExternalLink, KeyRound, Landmark, ReceiptText, UserRound } from "lucide-react";
import type { FindingMasterItemData } from "./FindingMasterItem";

type FindingDetailProps = {
  item: FindingMasterItemData;
};

const evidence = [
  {
    time: "Tuesday · 22:07",
    source: "Personal beneficiary",
    title: "Funds were withdrawn",
    description: "The beneficiary withdrew the funds from an unrecognized device in a new geography.",
    actions: ["Open withdrawal event"],
    active: true,
  },
  {
    time: "Tuesday · 09:40",
    source: "Payroll Master — EU",
    title: "Two external transfers",
    description: "Payments were queued at 12× normal volume and reached 14 finance accounts.",
    actions: ["Open transfer event", "Open beneficiary"],
  },
  {
    time: "Tuesday · 09:12",
    source: "FY24 Comp & Equity Payroll",
    title: "Dormant authority accessed payroll",
    description: "Approval rights that had been dormant were used to initiate the payment sequence.",
    actions: ["Open access event", "Open affected accounts"],
  },
  {
    time: "Monday · 10/10/2026",
    source: "Quarter-close project",
    title: "Approval authority stayed active",
    description: "Broad rights granted for quarter close were never revoked. Marek is on day 9 of a 30-day notice period.",
    actions: ["Open authority record"],
  },
];

export function FindingDetail({ item }: FindingDetailProps) {
  if (item.id !== "F-204") {
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
        <h2 id="finding-detail-title">Payroll transfers to an unregistered personal beneficiary</h2>
        <p className="finding-detail-meta">FND-1042 · D. Marek · 3 linked events · Tuesday, 09:12–22:07</p>
        <p className="finding-detail-summary">Dormant approval rights accessed payroll and routed two transfers to an unregistered personal beneficiary. The funds were withdrawn the same day.</p>
      </header>

      <section className="finding-recommendation" aria-labelledby="recommendation-title">
        <h3 id="recommendation-title">Recommended action</h3>
        <p>Verify the two transfers and approval scope before restricting further payments. Beneficiary ownership and session control remain unverified.</p>
      </section>

      <section className="finding-payment-chain" aria-labelledby="payment-chain-title">
        <div className="finding-section-heading">
          <h3 id="payment-chain-title">Payment chain</h3>
          <Button label="Explore" variant="ghost" size="sm" endContent={<ArrowRight size={16} />} />
        </div>
        <div className="finding-chain-flow" aria-label="D. Marek accessed Payroll Master EU and transferred funds to an external beneficiary">
          <ChainEntity icon={<UserRound size={20} />} title="D. Marek" meta="Employee · Day 9 of 30-day notice" foot="Dormant rights reactivated" />
          <ChainAction icon={<KeyRound size={18} />} label="Access" />
          <ChainEntity icon={<Landmark size={20} />} title="Payroll Master — EU" meta="Payroll accounts · FY24 Comp & Equity" foot="14 accessed · 12× activity" />
          <ChainAction icon={<ReceiptText size={18} />} label="Transfer (2)" />
          <ChainEntity tone="danger" icon={<ExternalLink size={20} />} title="j.doe.personal@gmail" meta="External beneficiary" foot="Funds withdrawn @ Tue 22:07" />
        </div>
      </section>

      <section className="finding-evidence" aria-labelledby="evidence-title">
        <h3 id="evidence-title">Evidence timeline</h3>
        <div className="finding-timeline">
          {evidence.map((event) => (
            <div className="finding-timeline-item" key={`${event.time}-${event.title}`}>
              <div className="finding-timeline-track" aria-hidden="true"><span className={event.active ? "is-active" : ""} /></div>
              <div className="finding-timeline-copy">
                <div className="finding-timeline-meta"><span>{event.time}</span><span>{event.source}</span></div>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
                <div className="finding-timeline-actions">
                  {event.actions.map((action) => <Button key={action} label={action} variant="ghost" size="sm" endContent={<ArrowRight size={14} />} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="finding-assessment" aria-labelledby="assessment-title">
        <h3 id="assessment-title">Dusk interpretation</h3>
        <p>Dormant authority, unusual payroll activity, an unregistered payee and same-day withdrawal support the payment-diversion finding. The 91% confidence applies to the activity pattern; attribution to Marek remains unverified.</p>
        <h4>Account coverage</h4>
        <p>FY24 Comp & Equity Payroll and Payroll Master — EU are the named source accounts. They are examples within the 14-account access population; the complete list still needs verification. 641 and 642 are ledger classes, not account identifiers.</p>
      </section>
    </article>
  );
}

function ChainEntity({ icon, title, meta, foot, tone = "signal" }: { icon: React.ReactNode; title: string; meta: string; foot: string; tone?: "signal" | "danger" }) {
  return <div className={`finding-chain-entity tone-${tone}`}><div className="finding-chain-title">{icon}<strong>{title}</strong></div><span>{meta}</span><div className="finding-chain-divider" /><p>{foot}</p></div>;
}

function ChainAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <div className="finding-chain-action" aria-hidden="true"><div>{icon}</div><span>{label}</span></div>;
}
