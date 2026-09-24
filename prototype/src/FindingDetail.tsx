import { Badge } from "@astryxdesign/core/Badge";
import { useState } from "react";
import type { FindingMasterItemData } from "./FindingMasterItem";
import { FindingLinkedAccounts } from "./FindingLinkedAccounts";
import { FindingEvidenceTimeline } from "./FindingEvidenceTimeline";
import type { EvidenceTarget, LinkedAccountId } from "./findingLinkedAccountsData";
import { FindingCaseAction, useCases } from "./Cases";
import { PaymentChain } from "./PaymentChain";

type FindingDetailProps = {
  item: FindingMasterItemData;
};

export function FindingDetail({ item }: FindingDetailProps) {
  const { cases } = useCases();
  const underInvestigation = cases.some((record) => record.status !== "Closed" && record.findingIds.includes(item.id));
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
        <FindingCaseAction findingId={item.id} />
      </section>
    );
  }

  return (
    <article className="finding-detail-content" aria-labelledby="finding-detail-title">
      <header className="finding-detail-header">
        <div className="finding-detail-status">
          <Badge className="finding-badge tone-fraudulent" variant="error" label="Fraudulent" />
          <span>91% confidence</span>
          <span className="finding-detail-open" aria-live="polite"><span className="finding-primary-status">Open</span>{underInvestigation && <span className="finding-sub-status"> · Under Investigation</span>}</span>
          <div className="finding-detail-actions">
            <FindingCaseAction findingId={item.id} />
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

      <FindingEvidenceTimeline onOpenAccount={focusLinkedAccount} />

      <div className="finding-linked-accounts-slot">
        <FindingLinkedAccounts focusRequest={linkedAccountFocus} onNavigateEvidence={focusEvidence} />
      </div>
    </article>
  );
}
