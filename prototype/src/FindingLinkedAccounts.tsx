import { useEffect, useState } from "react";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Collapsible, CollapsibleGroup } from "@astryxdesign/core/Collapsible";
import { ArrowRight } from "lucide-react";
import { linkedAccounts, type EvidenceTarget, type LinkedAccount, type LinkedAccountId } from "./findingLinkedAccountsData";
import "./findingLinkedAccounts.css";

export type LinkedAccountFocusRequest = {
  accountId: LinkedAccountId;
  serial: number;
};

export type FindingLinkedAccountsProps = {
  focusRequest: LinkedAccountFocusRequest | null;
  onNavigateEvidence: (target: EvidenceTarget) => void;
  accounts?: LinkedAccount[];
  initialOpenAccountId?: LinkedAccountId | "";
  coverageSummary?: string;
  coverageNote?: string;
};

export function FindingLinkedAccounts({ focusRequest, onNavigateEvidence, accounts = linkedAccounts, initialOpenAccountId = "", coverageSummary = "14 accounts accessed · 2 source accounts shown", coverageNote = "This prototype includes records for 2 of the 14 accessed accounts." }: FindingLinkedAccountsProps) {
  const [openAccount, setOpenAccount] = useState<string>(initialOpenAccountId);

  useEffect(() => {
    if (!focusRequest) return;
    setOpenAccount(focusRequest.accountId);
    let nestedFrame = 0;
    const frame = requestAnimationFrame(() => {
      nestedFrame = requestAnimationFrame(() => {
        const trigger = document.querySelector<HTMLButtonElement>(`#linked-account-${focusRequest.accountId} .astryx-collapsible-trigger`);
        trigger?.scrollIntoView({ block: "center", behavior: "auto" });
        trigger?.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(nestedFrame);
    };
  }, [focusRequest]);

  useEffect(() => {
    if (!openAccount) return;
    const frame = requestAnimationFrame(() => {
      document.querySelector(`#linked-account-${openAccount} .astryx-collapsible-trigger`)?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "auto",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [openAccount]);

  return (
    <section className="finding-linked-accounts" aria-labelledby="linked-accounts-title">
      <header className="finding-linked-accounts-header">
        <h3 id="linked-accounts-title">Linked accounts</h3>
        <p>{coverageSummary}</p>
      </header>
      <div className="linked-accounts-table">
        <div className="linked-accounts-header-row" aria-hidden="true">
          <span>Account</span><span>Role</span><span>What matters</span><span />
        </div>
        <CollapsibleGroup className="linked-accounts-list" type="single" value={openAccount} onChange={(value) => setOpenAccount(typeof value === "string" ? value : "")} hasDividers density="compact">
          {accounts.map((account) => (
            <Collapsible
              id={`linked-account-${account.id}`}
              key={account.id}
              value={account.id}
              defaultIsOpen={false}
              trigger={
                <span className="linked-account-summary">
                  <span className="linked-account-cell" data-label="Account"><strong>{account.account}</strong></span>
                  <span className="linked-account-cell" data-label="Role">{account.role}</span>
                  <span className="linked-account-cell is-matters" data-label="What matters">
                    {account.badge && <Badge className={`finding-badge ${account.badge === "Critical" ? "tone-fraudulent" : "tone-suspicious"}`} label={account.badge} variant={account.badge === "Critical" ? "error" : "warning"} />}
                    <span>{account.summary}</span>
                  </span>
                </span>
              }>
              <div className="linked-account-details">
                <dl className="linked-account-facts">
                  {account.facts.map((fact) => <div className="linked-account-fact" key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
                </dl>
                <div className="linked-account-source-links" aria-label={`${account.account} source evidence`}>
                  {account.sources.map((source) => <Button key={source.label} label={source.label} variant="ghost" size="sm" endContent={<ArrowRight size={14} />} onClick={() => onNavigateEvidence(source.target)} />)}
                </div>
              </div>
            </Collapsible>
          ))}
        </CollapsibleGroup>
      </div>
      <footer className="linked-accounts-coverage">{coverageNote}</footer>
    </section>
  );
}
