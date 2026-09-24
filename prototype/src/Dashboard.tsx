import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Kbd } from "@astryxdesign/core/Kbd";
import { List, ListItem } from "@astryxdesign/core/List";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { ChatComposer } from "@astryxdesign/core/Chat";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Dialog } from "@astryxdesign/core/Dialog";
import { ArrowRight, ArrowUp, ArrowUpRight, CalendarDays, ChevronRight, Maximize2, Mic, Minimize2, MoreHorizontal, MoreVertical, Plus, Search, X } from "lucide-react";
import askDuskSparkles from "./assets/ask-dusk-sparkles.svg";
import duskIcon from "./assets/dusk-icon.svg";
import riskPostureGauge from "./assets/risk-posture-gauge.svg";
import legendCritical from "./assets/account-legend-critical.svg";
import legendHigh from "./assets/account-legend-high.svg";
import legendElevated from "./assets/account-legend-elevated.svg";
import legendRoutine from "./assets/account-legend-routine.svg";
import StarBorder from "./StarBorder";
import { findingItems } from "./findingData";
import "./dashboard.css";
import { useCases } from "./Cases";

type DashboardProps = { onOpenFinding: (id?: string) => void };
type DashboardWidgetProps = { title: string; className?: string; children: ReactNode; contentClassName?: string };
type BadgeTone = "fraudulent" | "suspicious" | "legitimate" | "neutral";
type TableCell = { primary?: string; secondary?: string; badge?: string; tone?: BadgeTone };
type TableRow = { cells: TableCell[]; onClick?: () => void };
export type DashboardTableWidgetProps = { title: string; columns: string[]; template: string; rows: TableRow[]; footerSummary: string; footerAction?: string; onFooterClick?: () => void; className?: string };

const askDuskExamples = findingItems.slice(0, 3).map((item) => ({
  label: item.verdict, tone: item.verdict.toLowerCase(),
  variant: item.verdict === "Fraudulent" ? "error" as const : "warning" as const,
  text: item.title, time: item.timestamp,
}));

const askDuskSessions = [
  { name: "Quarter-end payroll export", description: "Sep 8 · Closed investigation" },
  { name: "Former contractor access review", description: "Sep 3 · Access revoked" },
  { name: "Duplicate vendor invoice cluster", description: "Aug 27 · False positive" },
];

export const findings: TableRow[] = findingItems.map((item) => ({ cells: [
  { primary: item.title, secondary: `${item.id} · ${item.context} · ${item.timestamp}` },
  { primary: item.entity, secondary: item.actorType },
  { badge: item.verdict, tone: item.verdict.toLowerCase() as BadgeTone },
  { primary: item.confidence.replace(" confidence", "") }, {},
] }));

export const accountsAtRisk: TableRow[] = [
  { cells: [{ primary: "Settlement API Credentials", secondary: "Secrets and API keys · 000" }, { badge: "Critical", tone: "fraudulent" }, { primary: "Exposed credential", secondary: "Service account access" }, { badge: "93 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "FY24 Comp & Equity Payroll", secondary: "PII, financial and HR · Ledger class 641" }, { badge: "Critical", tone: "fraudulent" }, { primary: "2 external beneficiaries", secondary: "Payroll and compensation" }, { badge: "87 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "Payroll Master — EU", secondary: "PII and financial · Ledger class 642" }, { badge: "Critical", tone: "fraudulent" }, { primary: "Internal only", secondary: "External transfer detected" }, { badge: "72 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "Board Reserve — Q3", secondary: "Financial and strategy · 658" }, { badge: "High value", tone: "suspicious" }, { primary: "6 actors", secondary: "Includes treasury agent" }, { badge: "61 · Elevated", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Vendor Payments 2024", secondary: "PII and legal · 646" }, { badge: "High value", tone: "suspicious" }, { primary: "3 external beneficiaries", secondary: "Vendor payment access" }, { badge: "55 · Elevated", tone: "suspicious" }, {}] },
];

export const activityPaths: TableRow[] = [
  { cells: [{ primary: "Employees", secondary: "D. Marek · C. Rivas" }, { primary: "Critical payroll", secondary: "Comp & Equity · Payroll Master EU" }, { primary: "4 events", secondary: "Access, two transfers and approval" }, { badge: "3 fraudulent", tone: "fraudulent", secondary: "1 legitimate" }, {}] },
  { cells: [{ primary: "External beneficiary", secondary: "j.doe.personal@gmail" }, { primary: "Critical payroll", secondary: "Payroll Master EU" }, { primary: "1 event", secondary: "Withdrawal · New device and geography" }, { badge: "1 fraudulent", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "AI agent", secondary: "agent-treasury" }, { primary: "High value reserves", secondary: "Board Reserve Q3" }, { primary: "1 event", secondary: "View and move · Outside baseline" }, { badge: "1 suspicious", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Service account", secondary: "svc-settle-03" }, { primary: "Critical credentials", secondary: "Settlement API Credentials" }, { primary: "1 event", secondary: "Credential use · Expanded scope" }, { badge: "1 suspicious", tone: "suspicious" }, {}] },
  { cells: [{ primary: "External collaborator", secondary: "L. Chen" }, { primary: "High value vendor payments", secondary: "Vendor Payments 2024" }, { primary: "1 event", secondary: "Beneficiary bank details changed" }, { badge: "1 suspicious", tone: "suspicious" }, {}] },
];

export const actorsToReview: TableRow[] = [
  { cells: [{ primary: "D. Marek", secondary: "Employee · Finance" }, { primary: "Dormant privileges activated", secondary: "Notice period · 12× normal volume" }, { badge: "88 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "j.doe.personal@gmail", secondary: "External beneficiary" }, { primary: "Unregistered personal account", secondary: "New device and geography" }, { badge: "81 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "L. Chen", secondary: "External collaborator" }, { primary: "Vendor bank details changed", secondary: "New beneficiary before payout" }, { badge: "76 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "svc-settle-03", secondary: "Service account" }, { primary: "Settlement scope expanded", secondary: "Credential used outside policy" }, { badge: "64 · Elevated", tone: "suspicious" }, {}] },
  { cells: [{ primary: "agent-treasury", secondary: "AI agent" }, { primary: "Counterparty outside baseline", secondary: "Activity outside normal hours" }, { badge: "58 · Elevated", tone: "suspicious" }, {}] },
];

export const latestSignals: TableRow[] = [
  { cells: [{ primary: "Wed", secondary: "03:20" }, { primary: "Treasury activity flagged", secondary: "FND-1043 · agent-treasury" }, { badge: "New finding", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Tue", secondary: "22:07" }, { primary: "New device linked to personal withdrawal", secondary: "FND-1042 · Payroll Master EU" }, { badge: "Evidence", tone: "neutral" }, {}] },
  { cells: [{ primary: "Tue", secondary: "09:40" }, { primary: "Unregistered beneficiary detected", secondary: "FND-1042 · D. Marek" }, { badge: "Evidence", tone: "neutral" }, {}] },
  { cells: [{ primary: "Tue", secondary: "09:12" }, { primary: "Dormant approval rights reactivated", secondary: "FND-1042 · 14 Critical accounts" }, { badge: "New finding", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Mon", secondary: "21:14" }, { primary: "Settlement scope drift detected", secondary: "FND-1041 · svc-settle-03" }, { badge: "New finding", tone: "suspicious" }, {}] },
];


const accountTiers = [
  { label: "Critical", events: 6, accounts: 3, color: "var(--dusk-lime)", legend: legendCritical },
  { label: "High value", events: 2, accounts: 2, color: "#536b5e", legend: legendHigh },
  { label: "Elevated", events: 0, accounts: 1, color: "var(--dusk-quiet)", legend: legendElevated },
  { label: "Routine", events: 0, accounts: 1, color: "var(--dusk-border)", legend: legendRoutine },
];

function formatCount(value: number, unit: "event" | "account") { return `${value} ${unit}${value === 1 ? "" : "s"}`; }

function containModalFocus(event: ReactKeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, input, textarea, select, a[href], [contenteditable="true"], [tabindex]'))
    .filter((element) => element.tabIndex >= 0 && !element.matches(':disabled, [aria-disabled="true"]') && !element.closest('[inert]') && element.getClientRects().length > 0);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

export function Dashboard({ onOpenFinding }: DashboardProps) {
  const { cases } = useCases();
  const investigations: TableRow[] = cases.map((item) => ({
    cells: [{ primary: item.name, secondary: `${item.id} · ${item.findingIds.length} ${item.findingIds.length === 1 ? "finding" : "findings"} · ${item.priority}` }, { primary: item.owner, secondary: `Updated ${item.updated}` }, { badge: item.status, tone: item.status === "Closed" ? "legitimate" : item.status === "Investigating" ? "suspicious" : "neutral" }, {}],
  }));
  const [query, setQuery] = useState("");
  const [isAskDuskOpen, setIsAskDuskOpen] = useState(false);
  const [isAskDuskExpanded, setIsAskDuskExpanded] = useState(false);
  const [sessionSearch, setSessionSearch] = useState("");
  const composerRef = useRef<HTMLDivElement>(null);
  const findingRows = findings.map((row, index) => ({ ...row, onClick: () => onOpenFinding(findingItems[index].id) }));
  const visibleSessions = askDuskSessions.filter((session) => session.name.toLowerCase().includes(sessionSearch.trim().toLowerCase()));

  const focusComposer = () => composerRef.current?.querySelector<HTMLElement>('[contenteditable="true"]')?.focus();
  const closeAskDusk = () => { setIsAskDuskOpen(false); setIsAskDuskExpanded(false); };
  useEffect(() => { if (isAskDuskOpen) focusComposer(); }, [isAskDuskOpen]);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && !event.isComposing) {
        event.preventDefault();
        setIsAskDuskOpen(true);
        focusComposer();
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  return <section className="dashboard-workspace" aria-label="Payment intelligence dashboard">
    <div className="dashboard-actions" aria-label="Dashboard actions"><h1 className="dashboard-title">Dashboard</h1><StarBorder as="div" className="ask-dusk-star-border" color="var(--dusk-lime)" speed="5s"><form className="ask-dusk-prompt" onSubmit={(event) => { event.preventDefault(); setIsAskDuskOpen(true); }}><img className="ask-dusk-icon" src={askDuskSparkles} alt="" /><input aria-label="Ask Dusk" aria-haspopup="dialog" aria-expanded={isAskDuskOpen} value={query} onChange={(event) => setQuery(event.target.value)} onClick={() => setIsAskDuskOpen(true)} placeholder="Ask Dusk to investigate findings, accounts, or activity…" /><div className="ask-dusk-end"><Kbd keys="mod+k" /><IconButton label="Send" type="submit" variant="primary" size="sm" icon={<ArrowUp size={16} />} width={28} /></div></form></StarBorder><Button label="Last 7 days" variant="secondary" size="lg" icon={<CalendarDays size={16} />} /></div>
    <div className="dashboard-content">
      <div className="dashboard-priority-row"><RiskPostureWidget /><DashboardTableWidget title="Findings" className="findings-widget" columns={["Finding", "Actor", "Verdict", "Confidence", ""]} template="minmax(240px, 3fr) minmax(120px, 1.3fr) 100px 78px 20px" rows={findingRows} footerSummary="4 require review · 1 cleared" footerAction="View all findings" onFooterClick={() => onOpenFinding()} /></div>
      <div className="dashboard-exposure-row"><AccountTierWidget /><DashboardTableWidget title="Accounts at risk" className="accounts-widget" columns={["Account", "Value", "Access exposure", "Risk score", ""]} template="minmax(190px, 2.7fr) 96px minmax(150px, 2fr) 112px 20px" rows={accountsAtRisk} footerSummary="Showing 5 of 7 accounts · Highest risk first" footerAction="View all accounts" /></div>
      <DashboardTableWidget title="Activity paths" className="activity-widget" columns={["Actor group", "Account category", "Observed activity", "Event verdicts", ""]} template="minmax(180px, 1.15fr) minmax(240px, 1.5fr) minmax(220px, 1.5fr) minmax(150px, 1.15fr) 24px" rows={activityPaths} footerSummary="8 events across 5 paths" footerAction="Explore activity" />
      <div className="dashboard-paired-row"><DashboardTableWidget title="Actors to review" className="actors-widget" columns={["Actor", "Risk signal", "Risk", ""]} template="minmax(154px, 1fr) minmax(188px, 1.25fr) 96px 24px" rows={actorsToReview} footerSummary="5 actors require review" footerAction="View all actors" /><AutomationExposure /></div>
      <div className="dashboard-paired-row dashboard-final-row"><DashboardTableWidget title="Latest signals" className="signals-widget" columns={["Detected", "Signal", "Update", ""]} template="72px minmax(230px, 1.8fr) 116px 24px" rows={latestSignals} footerSummary="Latest 5 updates" footerAction="View all signals" /><DashboardTableWidget title="Cases" className="investigations-widget" columns={["Case", "Owner", "Status", ""]} template="minmax(180px, 1.7fr) 100px 104px 20px" rows={investigations} footerSummary={`${cases.filter((item) => item.status !== "Closed").length} active · ${cases.filter((item) => item.status === "Closed").length} closed`}  /></div>
    </div>
    <Dialog className="ask-dusk-modal" isOpen={isAskDuskOpen} onOpenChange={(open) => { if (!open) closeAskDusk(); }} onKeyDown={containModalFocus} variant="fullscreen" padding={0} aria-label="Ask Dusk investigation window">
    {isAskDuskOpen && (
      <div className={`ask-dusk-overlay${isAskDuskExpanded ? " is-expanded" : ""}`} role="presentation" onMouseDown={closeAskDusk}>
        <section className={`ask-dusk-window t-resize${isAskDuskExpanded ? " is-expanded" : ""}`} onMouseDown={(event) => event.stopPropagation()}>
          <div className="ask-dusk-window-actions">
            <IconButton className="ask-dusk-window-expand" label={isAskDuskExpanded ? "Restore Ask Dusk window" : "Expand Ask Dusk window"} variant="ghost" size="sm" icon={isAskDuskExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />} onClick={() => setIsAskDuskExpanded((expanded) => !expanded)} />
            <IconButton className="ask-dusk-window-close" label="Close Ask Dusk window" variant="ghost" size="sm" icon={<X size={16} />} onClick={closeAskDusk} />
          </div>
          <aside className="ask-dusk-sessions" aria-label="Past Ask Dusk sessions" aria-hidden={!isAskDuskExpanded} inert={!isAskDuskExpanded}>
            <div className="ask-dusk-sessions-content t-panel-slide" data-open={isAskDuskExpanded ? "true" : "false"}>
              <TextInput className="ask-dusk-session-search" label="Search sessions" isLabelHidden placeholder="Search" value={sessionSearch} onChange={setSessionSearch} startIcon={<Search size={16} />} size="md" width="100%" isDisabled={!isAskDuskExpanded} />
              <div className="ask-dusk-sessions-header">
                <span>Sessions ({askDuskSessions.length})</span>
                <div className="ask-dusk-session-actions">
                  <IconButton label="New session" variant="ghost" size="sm" icon={<Plus size={16} />} isDisabled={!isAskDuskExpanded} />
                  <IconButton label="Session options" variant="ghost" size="sm" icon={<MoreHorizontal size={16} />} isDisabled={!isAskDuskExpanded} />
                </div>
              </div>
              {visibleSessions.length > 0 ? (
                <List className="ask-dusk-session-list" density="compact">
                  {visibleSessions.map((session) => <ListItem key={session.name} label={session.name} description={session.description} onClick={() => setQuery(session.name)} />)}
                </List>
              ) : <p className="ask-dusk-session-empty">No sessions found</p>}
            </div>
          </aside>
          <div className="ask-dusk-design">
            <div className="ask-dusk-intro"><img src={duskIcon} alt="" /><h2>What should we investigate?</h2></div>
            <div className="ask-dusk-dialog-composer-shell">
              <StarBorder as="div" className="ask-dusk-star-border ask-dusk-dialog-star-border" color="var(--dusk-lime)" speed="5s">
                <ChatComposer ref={composerRef} className="ask-dusk-dialog-composer" style={{ width: "100%", maxWidth: "none" }} value={query} onChange={setQuery} onSubmit={() => undefined} placeholder="Ask anything..." density="compact" elevation="none" sendActions={<IconButton label="Dictate" variant="ghost" size="sm" icon={<Mic size={16} />} width={28} />} />
              </StarBorder>
            </div>
            <div className="ask-dusk-examples">
              {askDuskExamples.map((example) => <button className={`ask-dusk-example-row tone-${example.tone}`} key={example.text} type="button" onClick={() => { setQuery(example.text); focusComposer(); }}><span className={`dashboard-cell-badge tone-${example.tone}`}><Badge variant={example.variant} label={example.label} /></span><p>{example.text}</p><span className="ask-dusk-example-time">{example.time}</span></button>)}
            </div>
          </div>
        </section>
      </div>
    )}
    </Dialog>
  </section>;
}

export function RiskPostureWidget() {
  return <DashboardWidget title="Risk posture" className="risk-widget" contentClassName="risk-widget-body"><div className="risk-visualization"><img src={riskPostureGauge} alt="" className="risk-gauge" /><div className="risk-score"><strong>82</strong><span>Risk score</span></div></div><div className="risk-status"><Badge variant="error" label="High risk" /><span>+8</span><ArrowUpRight size={16} aria-hidden="true" /></div><div className="risk-divider" /><div className="risk-metrics"><div><strong>4</strong><span>Findings to review</span></div><div><strong>3</strong><span>Critical accounts</span></div></div></DashboardWidget>;
}

export function AccountTierWidget({ initialMetric = "activity" }: { initialMetric?: "activity" | "accounts" }) {
  const [accountMetric, setAccountMetric] = useState(initialMetric);
  const showsAccounts = accountMetric === "accounts";
  const metric = showsAccounts ? "accounts" : "events";
  const accountTotal = accountTiers.reduce((total, tier) => total + tier.accounts, 0);
  const metricTotal = accountTiers.reduce((total, tier) => total + tier[metric], 0);
  let segmentStart = 0;
  const donutSegments = accountTiers.filter((tier) => tier[metric] > 0).map((tier) => {
    const start = segmentStart;
    segmentStart += tier[metric] / metricTotal * 100;
    return `${tier.color} ${start}% ${segmentStart}%`;
  });
  const distributionLabel = `${metricTotal} ${metric} across account-value tiers: ${accountTiers.filter((tier) => tier[metric] > 0).map((tier) => `${tier[metric]} ${tier.label.toLowerCase()}`).join(", ")}`;
  return <DashboardWidget title="Exposure by account tier" className="account-widget" contentClassName="account-widget-body"><SegmentedControl label="Exposure metric" value={accountMetric} onChange={(value) => { if (value === "activity" || value === "accounts") setAccountMetric(value); }} layout="fill" size="sm" className="account-segmented-control"><SegmentedControlItem value="activity" label="Events" /><SegmentedControlItem value="accounts" label="Accounts" /></SegmentedControl><div className="account-distribution" role="img" aria-label={distributionLabel}><div className="account-donut-accounts" style={{ background: `conic-gradient(${donutSegments.join(", ")})` }} aria-hidden="true" /><div className="account-total"><strong>{metricTotal}</strong><span>{metric}</span></div></div><div className="account-tiers">{accountTiers.map((tier) => <div className="account-tier" key={tier.label}><img src={tier.legend} alt="" /><span>{tier.label}</span><small>{formatCount(showsAccounts ? tier.accounts : tier.events, showsAccounts ? "account" : "event")}</small><small>{showsAccounts ? `${Math.round(tier.accounts / accountTotal * 100)}%` : formatCount(tier.accounts, "account")}</small></div>)}</div></DashboardWidget>;
}

export function DashboardWidget({ title, className = "", children, contentClassName = "" }: DashboardWidgetProps) { return <article className={`dashboard-widget ${className}`.trim()}><header className="dashboard-widget-header"><h2>{title}</h2><IconButton label={`More options for ${title}`} variant="ghost" size="sm" icon={<MoreVertical size={16} />} /></header><div className={`dashboard-widget-content ${contentClassName}`.trim()}>{children}</div></article>; }

export function DashboardTableWidget({ title, columns, template, rows, footerSummary, footerAction, onFooterClick, className = "" }: DashboardTableWidgetProps) {
  const tableStyle = { "--table-columns": template } as CSSProperties;
  return <DashboardWidget title={title} className={`dashboard-table-widget ${className}`.trim()} contentClassName="dashboard-table-widget-body"><div className="dashboard-table-scroll" tabIndex={0} role="region" aria-label={`${title} table`}><div className="dashboard-table-columns" style={tableStyle} aria-hidden="true">{columns.map((column, index) => <span key={`${column}-${index}`}>{column}</span>)}</div><div className="dashboard-table-list" style={tableStyle}>{rows.map((row, index) => <DashboardTableRow key={`${title}-${index}`} row={row} columns={columns} />)}</div></div><footer className="dashboard-table-footer"><span>{footerSummary}</span>{footerAction && <Button className="dashboard-table-footer-button" label={footerAction} onClick={onFooterClick} variant="ghost" size="sm" endContent={<ArrowRight size={16} />} />}</footer></DashboardWidget>;
}

function DashboardTableRow({ row, columns }: { row: TableRow; columns: string[] }) { const cells = row.cells.map((cell, index) => <DashboardTableCell cell={cell} label={columns[index]} isAction={index === row.cells.length - 1 && columns[0] !== "Case"} key={index} />); return row.onClick ? <button className="dashboard-table-row" type="button" onClick={row.onClick}>{cells}</button> : <div className="dashboard-table-row">{cells}</div>; }

function DashboardTableCell({ cell, label, isAction }: { cell: TableCell; label: string; isAction: boolean }) {
  if (isAction) return <span className="dashboard-table-open" aria-hidden="true"><ChevronRight size={16} /></span>;
  if (!cell.primary && !cell.secondary && !cell.badge) return <span aria-hidden="true" />;
  if (cell.badge) { const variant = cell.tone === "fraudulent" ? "error" : cell.tone === "suspicious" ? "warning" : cell.tone === "legitimate" ? "success" : "neutral"; return <span className="dashboard-table-cell dashboard-table-badge"><span className="sr-only">{label}: </span><span className={`dashboard-cell-badge tone-${cell.tone ?? "neutral"}`}><Badge variant={variant} label={cell.badge} /></span>{cell.secondary && <small>{cell.secondary}</small>}</span>; }
  return <span className="dashboard-table-cell"><span className="sr-only">{label}: </span><strong title={cell.primary}>{cell.primary}</strong>{cell.secondary && <small title={cell.secondary}>{cell.secondary}</small>}</span>;
}

export function AutomationExposure() { return <DashboardWidget title="Automation exposure" className="automation-widget" contentClassName="automation-widget-body"><div className="automation-chart"><div className="automation-chart-legend"><span>7-week trend</span><span><i className="automation-dot automated" />Automated</span><span><i className="automation-dot flagged" />Flagged</span></div><div className="automation-plot"><svg viewBox="0 0 596 168" preserveAspectRatio="none" role="img" aria-label="Seven week automated and flagged activity trend"><path d="M40 20H572M40 84H572M40 148H572" className="automation-grid" /><path d="M40 81L126 74L212 84L298 68L384 78L470 65L556 55L556 148H40Z" className="automation-area" /><path d="M40 81L126 74L212 84L298 68L384 78L470 65L556 55" className="automation-line automated" /><path d="M40 138L126 135L212 132L298 138L384 116L470 110L556 55" className="automation-line flagged" /><circle cx="556" cy="55" r="4" className="automation-point automated" /><circle cx="556" cy="55" r="3" className="automation-point flagged" /></svg><div className="automation-y-axis"><span>40%</span><span>20%</span><span>0%</span></div></div><div className="automation-x-axis">{["Jul 30", "Aug 6", "Aug 13", "Aug 20", "Aug 27", "Sep 3", "Sep 10"].map((date) => <span key={date}>{date}</span>)}</div></div><footer className="dashboard-table-footer automation-footer"><span>1 service account · 1 AI agent</span><Button className="dashboard-table-footer-button" label="View automations" variant="ghost" size="sm" endContent={<ArrowRight size={16} />} /></footer></DashboardWidget>; }
