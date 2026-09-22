import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Kbd } from "@astryxdesign/core/Kbd";
import { List, ListItem } from "@astryxdesign/core/List";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { ChatComposer } from "@astryxdesign/core/Chat";
import { TextInput } from "@astryxdesign/core/TextInput";
import { ArrowRight, ArrowUp, ArrowUpRight, CalendarDays, ChevronRight, Maximize2, Mic, Minimize2, MoreHorizontal, MoreVertical, Plus, Search, X } from "lucide-react";
import askDuskSparkles from "./assets/ask-dusk-sparkles.svg";
import duskIcon from "./assets/dusk-icon.svg";
import riskPostureGauge from "./assets/risk-posture-gauge.svg";
import accountDonutCritical from "./assets/account-donut-critical.svg";
import accountDonutHigh from "./assets/account-donut-high.svg";
import accountDonutRoutine from "./assets/account-donut-routine.svg";
import legendCritical from "./assets/account-legend-critical.svg";
import legendHigh from "./assets/account-legend-high.svg";
import legendElevated from "./assets/account-legend-elevated.svg";
import legendRoutine from "./assets/account-legend-routine.svg";
import StarBorder from "./StarBorder";
import "./dashboard.css";

type DashboardProps = { onOpenFinding: () => void };
type DashboardWidgetProps = { title: string; className?: string; children: ReactNode; contentClassName?: string };
type BadgeTone = "fraudulent" | "suspicious" | "legitimate" | "neutral";
type TableCell = { primary?: string; secondary?: string; badge?: string; tone?: BadgeTone };
type TableRow = { cells: TableCell[]; onClick?: () => void };
type DashboardTableWidgetProps = { title: string; columns: string[]; template: string; rows: TableRow[]; footerSummary: string; footerAction: string; className?: string };

const askDuskExamples = [
  { label: "Fraudulent", tone: "fraudulent", variant: "error" as const, text: "Transfers to an unregistered personal account", time: "Tue 09:12" },
  { label: "Suspicious", tone: "suspicious", variant: "warning" as const, text: "Treasury activity outside its baseline", time: "Tue 09:12" },
  { label: "Suspicious", tone: "suspicious", variant: "warning" as const, text: "Settlement credential used beyond scope", time: "Tue 09:12" },
];

const askDuskSessions = [
  { name: "Quarter-end payroll export", description: "Sep 8 · Closed investigation" },
  { name: "Former contractor access review", description: "Sep 3 · Access revoked" },
  { name: "Duplicate vendor invoice cluster", description: "Aug 27 · False positive" },
];

const findings: TableRow[] = [
  { cells: [{ primary: "Transfers to an unregistered personal account", secondary: "FND-1042 · 3 linked events · Tue 09:12" }, { primary: "D. Marek", secondary: "Employee · Finance" }, { badge: "Fraudulent", tone: "fraudulent" }, { primary: "91%" }, {}] },
  { cells: [{ primary: "Treasury activity outside its baseline", secondary: "FND-1043 · Board Reserve · Wed 03:20" }, { primary: "agent-treasury", secondary: "AI agent" }, { badge: "Suspicious", tone: "suspicious" }, { primary: "—" }, {}] },
  { cells: [{ primary: "Settlement credential used beyond scope", secondary: "FND-1041 · Settlement API · Mon 21:14" }, { primary: "svc-settle-03", secondary: "Service account" }, { badge: "Suspicious", tone: "suspicious" }, { primary: "88%" }, {}] },
  { cells: [{ primary: "Vendor bank details changed before payout", secondary: "FND-1039 · Vendor Payments · Mon 11:36" }, { primary: "L. Chen", secondary: "External collaborator" }, { badge: "Suspicious", tone: "suspicious" }, { primary: "84%" }, {}] },
  { cells: [{ primary: "Payroll approval matches established activity", secondary: "FND-1038 · Comp & Equity · Mon 14:02" }, { primary: "C. Rivas", secondary: "Employee · Finance" }, { badge: "Legitimate", tone: "legitimate" }, { primary: "98%" }, {}] },
];

const accountsAtRisk: TableRow[] = [
  { cells: [{ primary: "Settlement API Credentials", secondary: "Secrets and API keys · 000" }, { badge: "Critical", tone: "fraudulent" }, { primary: "Exposed credential", secondary: "Service account access" }, { badge: "93 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "FY24 Comp & Equity Payroll", secondary: "PII, financial and HR · 641" }, { badge: "Critical", tone: "fraudulent" }, { primary: "2 external collaborators", secondary: "Payroll and compensation" }, { badge: "87 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "Payroll Master — EU", secondary: "PII and financial · 642" }, { badge: "Critical", tone: "fraudulent" }, { primary: "Internal access", secondary: "External transfer detected" }, { badge: "72 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "Board Reserve — Q3", secondary: "Financial and strategy · 658" }, { badge: "High value", tone: "suspicious" }, { primary: "6 actors", secondary: "Includes treasury agent" }, { badge: "61 · Elevated", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Vendor Payments 2024", secondary: "PII and legal · 646" }, { badge: "High value", tone: "suspicious" }, { primary: "3 external collaborators", secondary: "Vendor payment access" }, { badge: "55 · Elevated", tone: "suspicious" }, {}] },
];

const activityPaths: TableRow[] = [
  { cells: [{ primary: "Employees", secondary: "D. Marek · C. Rivas" }, { primary: "Critical payroll", secondary: "Comp & Equity · Payroll Master EU" }, { primary: "3 events", secondary: "Access, transfer and approval" }, { badge: "2 fraudulent", tone: "fraudulent", secondary: "1 legitimate" }, {}] },
  { cells: [{ primary: "External beneficiary", secondary: "j.doe.personal@gmail" }, { primary: "Critical payroll", secondary: "Payroll Master EU" }, { primary: "1 event", secondary: "Withdrawal · New device and geography" }, { badge: "1 fraudulent", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "AI agent", secondary: "agent-treasury" }, { primary: "High value reserves", secondary: "Board Reserve Q3" }, { primary: "1 event", secondary: "View and move · Outside baseline" }, { badge: "1 suspicious", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Service account", secondary: "svc-settle-03" }, { primary: "Critical credentials", secondary: "Settlement API Credentials" }, { primary: "1 event", secondary: "Credential use · Expanded scope" }, { badge: "1 suspicious", tone: "suspicious" }, {}] },
  { cells: [{ primary: "External collaborator", secondary: "L. Chen" }, { primary: "High value vendor payments", secondary: "Vendor Payments 2024" }, { primary: "1 event", secondary: "Beneficiary bank details changed" }, { badge: "1 suspicious", tone: "suspicious" }, {}] },
];

const actorsToReview: TableRow[] = [
  { cells: [{ primary: "D. Marek", secondary: "Employee · Finance" }, { primary: "Dormant privileges activated", secondary: "Notice period · 12× normal volume" }, { badge: "88 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "j.doe.personal@gmail", secondary: "External beneficiary" }, { primary: "Unregistered personal account", secondary: "New device and geography" }, { badge: "81 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "L. Chen", secondary: "External collaborator" }, { primary: "Vendor bank details changed", secondary: "New beneficiary before payout" }, { badge: "76 · High", tone: "fraudulent" }, {}] },
  { cells: [{ primary: "svc-settle-03", secondary: "Service account" }, { primary: "Settlement scope expanded", secondary: "Credential used outside policy" }, { badge: "64 · Elevated", tone: "suspicious" }, {}] },
  { cells: [{ primary: "agent-treasury", secondary: "AI agent" }, { primary: "Counterparty outside baseline", secondary: "Activity outside normal hours" }, { badge: "58 · Elevated", tone: "suspicious" }, {}] },
];

const latestSignals: TableRow[] = [
  { cells: [{ primary: "Wed", secondary: "03:20" }, { primary: "Treasury activity flagged", secondary: "FND-1043 · agent-treasury" }, { badge: "New finding", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Tue", secondary: "22:07" }, { primary: "New device linked to personal withdrawal", secondary: "FND-1042 · Payroll Master EU" }, { badge: "Evidence", tone: "neutral" }, {}] },
  { cells: [{ primary: "Tue", secondary: "09:40" }, { primary: "Unregistered beneficiary detected", secondary: "FND-1042 · D. Marek" }, { badge: "Evidence", tone: "neutral" }, {}] },
  { cells: [{ primary: "Tue", secondary: "09:12" }, { primary: "Dormant approval rights reactivated", secondary: "FND-1042 · 14 Critical accounts" }, { badge: "New finding", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Mon", secondary: "21:14" }, { primary: "Settlement scope drift detected", secondary: "FND-1041 · svc-settle-03" }, { badge: "New finding", tone: "suspicious" }, {}] },
];

const investigations: TableRow[] = [
  { cells: [{ primary: "Marek payment chain", secondary: "INV-204 · 3 events · Critical" }, { primary: "Carla Rivas", secondary: "Updated 22:12" }, { badge: "Investigating", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Treasury counterparty review", secondary: "INV-205 · 1 event · High" }, { primary: "Noam Levi", secondary: "Updated 03:34" }, { badge: "Triage", tone: "neutral" }, {}] },
  { cells: [{ primary: "Settlement credential exposure", secondary: "INV-203 · 1 event · High" }, { primary: "Carla Rivas", secondary: "Updated Mon" }, { badge: "Investigating", tone: "suspicious" }, {}] },
  { cells: [{ primary: "Vendor beneficiary change", secondary: "INV-202 · 1 event · High" }, { primary: "Maya Cohen", secondary: "Updated Mon" }, { badge: "In review", tone: "neutral" }, {}] },
  { cells: [{ primary: "Payroll approval verification", secondary: "INV-201 · 1 event · Normal" }, { primary: "Noam Levi", secondary: "Closed Mon" }, { badge: "Closed", tone: "legitimate" }, {}] },
];

const accountTiers = [
  { label: "Critical", events: 5, accounts: 3, share: "43%", legend: legendCritical },
  { label: "High value", events: 2, accounts: 2, share: "29%", legend: legendHigh },
  { label: "Elevated", events: 0, accounts: 1, share: "14%", legend: legendElevated },
  { label: "Routine", events: 0, accounts: 1, share: "14%", legend: legendRoutine },
];

function formatCount(value: number, unit: "event" | "account") { return `${value} ${unit}${value === 1 ? "" : "s"}`; }

export function Dashboard({ onOpenFinding }: DashboardProps) {
  const [query, setQuery] = useState("");
  const [accountMetric, setAccountMetric] = useState("activity");
  const [isAskDuskOpen, setIsAskDuskOpen] = useState(false);
  const [isAskDuskExpanded, setIsAskDuskExpanded] = useState(false);
  const [sessionSearch, setSessionSearch] = useState("");
  const showsAccounts = accountMetric === "accounts";
  const findingRows = findings.map((row, index) => index === 0 ? { ...row, onClick: onOpenFinding } : row);
  const visibleSessions = askDuskSessions.filter((session) => session.name.toLowerCase().includes(sessionSearch.trim().toLowerCase()));

  useEffect(() => {
    if (!isAskDuskOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAskDuskOpen(false);
        setIsAskDuskExpanded(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAskDuskOpen]);

  return <section className="dashboard-workspace" aria-label="Payment intelligence dashboard">
    <div className="dashboard-actions" aria-label="Dashboard actions"><h1 className="dashboard-title">Dashboard</h1><StarBorder as="div" className="ask-dusk-star-border" color="var(--dusk-lime)" speed="5s"><form className="ask-dusk-prompt" onSubmit={(event) => event.preventDefault()}><img className="ask-dusk-icon" src={askDuskSparkles} alt="" /><input aria-label="Ask Dusk" value={query} onChange={(event) => setQuery(event.target.value)} onClick={() => setIsAskDuskOpen(true)} placeholder="Ask Dusk to investigate findings, accounts, or activity…" /><div className="ask-dusk-end"><Kbd keys="mod+k" /><IconButton label="Send" type="submit" variant="primary" size="sm" icon={<ArrowUp size={16} />} width={28} /></div></form></StarBorder><Button label="Last 7 days" variant="secondary" size="lg" icon={<CalendarDays size={16} />} /></div>
    <div className="dashboard-content">
      <div className="dashboard-priority-row"><DashboardWidget title="Risk posture" className="risk-widget" contentClassName="risk-widget-body"><div className="risk-visualization"><img src={riskPostureGauge} alt="" className="risk-gauge" /><div className="risk-score"><strong>82</strong><span>Risk score</span></div></div><div className="risk-status"><Badge variant="error" label="High risk" /><span>+8</span><ArrowUpRight size={16} aria-hidden="true" /></div><div className="risk-divider" /><div className="risk-metrics"><div><strong>4</strong><span>Findings to review</span></div><div><strong>3</strong><span>Critical accounts</span></div></div></DashboardWidget><DashboardTableWidget title="Findings" className="findings-widget" columns={["Finding", "Actor", "Verdict", "Confidence", ""]} template="minmax(300px, 3fr) minmax(132px, 1.3fr) minmax(112px, .95fr) minmax(70px, .7fr) 24px" rows={findingRows} footerSummary="4 require review · 1 cleared" footerAction="View all findings" /></div>
      <div className="dashboard-exposure-row"><DashboardWidget title="Account value" className="account-widget" contentClassName="account-widget-body"><SegmentedControl label="Account value metric" value={accountMetric} onChange={setAccountMetric} layout="fill" size="sm" className="account-segmented-control"><SegmentedControlItem value="activity" label="Activity" /><SegmentedControlItem value="accounts" label="Accounts" /></SegmentedControl><div className="account-distribution" role="img" aria-label={showsAccounts ? "7 accounts across account-value tiers: 3 critical, 2 high value, 1 elevated, and 1 routine" : "7 events across account-value tiers: 5 critical and 2 high value"}>{showsAccounts ? <div className="account-donut-accounts" aria-hidden="true" /> : <><img className="donut-critical" src={accountDonutCritical} alt="" /><img className="donut-high" src={accountDonutHigh} alt="" /><img className="donut-routine" src={accountDonutRoutine} alt="" /></>}<div className="account-total"><strong>7</strong><span>{showsAccounts ? "accounts" : "events"}</span></div></div><div className="account-tiers">{accountTiers.map((tier) => <div className="account-tier" key={tier.label}><img src={tier.legend} alt="" /><span>{tier.label}</span><small>{formatCount(showsAccounts ? tier.accounts : tier.events, showsAccounts ? "account" : "event")}</small><small>{showsAccounts ? tier.share : formatCount(tier.accounts, "account")}</small></div>)}</div></DashboardWidget><DashboardTableWidget title="Accounts at risk" className="accounts-widget" columns={["Account", "Value", "Access exposure", "Risk score", ""]} template="minmax(260px, 2.7fr) 120px minmax(190px, 2fr) 112px 24px" rows={accountsAtRisk} footerSummary="Showing 5 of 7 accounts · Highest risk first" footerAction="View all accounts" /></div>
      <DashboardTableWidget title="Activity paths" className="activity-widget" columns={["Actor group", "Account category", "Observed activity", "Event verdicts", ""]} template="minmax(180px, 1.15fr) minmax(240px, 1.5fr) minmax(220px, 1.5fr) minmax(150px, 1.15fr) 24px" rows={activityPaths} footerSummary="7 events across 5 paths" footerAction="Explore activity" />
      <div className="dashboard-paired-row"><DashboardTableWidget title="Actors to review" className="actors-widget" columns={["Actor", "Risk signal", "Risk", ""]} template="minmax(154px, 1fr) minmax(188px, 1.25fr) 96px 24px" rows={actorsToReview} footerSummary="5 actors require review" footerAction="View all actors" /><AutomationExposure /></div>
      <div className="dashboard-paired-row dashboard-final-row"><DashboardTableWidget title="Latest signals" className="signals-widget" columns={["Detected", "Signal", "Update", ""]} template="72px minmax(230px, 1.8fr) 116px 24px" rows={latestSignals} footerSummary="Latest 5 updates" footerAction="View all signals" /><DashboardTableWidget title="Investigations" className="investigations-widget" columns={["Investigation", "Owner", "Status", ""]} template="minmax(220px, 1.7fr) 112px 128px 24px" rows={investigations} footerSummary="4 active · 1 closed" footerAction="View all cases" /></div>
    </div>
    {isAskDuskOpen && (
      <div className={`ask-dusk-overlay${isAskDuskExpanded ? " is-expanded" : ""}`} role="presentation" onMouseDown={() => { setIsAskDuskOpen(false); setIsAskDuskExpanded(false); }}>
        <section className={`ask-dusk-window t-resize${isAskDuskExpanded ? " is-expanded" : ""}`} role="dialog" aria-modal="true" aria-label="Ask Dusk investigation window" onMouseDown={(event) => event.stopPropagation()}>
          <div className="ask-dusk-window-actions">
            <IconButton className="ask-dusk-window-expand" label={isAskDuskExpanded ? "Restore Ask Dusk window" : "Expand Ask Dusk window"} variant="ghost" size="sm" icon={isAskDuskExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />} onClick={() => setIsAskDuskExpanded((expanded) => !expanded)} />
            <IconButton className="ask-dusk-window-close" label="Close Ask Dusk window" variant="ghost" size="sm" icon={<X size={16} />} onClick={() => { setIsAskDuskOpen(false); setIsAskDuskExpanded(false); }} />
          </div>
          <aside className="ask-dusk-sessions" aria-label="Past Ask Dusk sessions" aria-hidden={!isAskDuskExpanded}>
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
                <ChatComposer className="ask-dusk-dialog-composer" style={{ width: "100%", maxWidth: "none" }} value={query} onChange={setQuery} onSubmit={() => undefined} placeholder="Ask anything..." density="compact" elevation="none" sendActions={<IconButton label="Dictate" variant="ghost" size="sm" icon={<Mic size={16} />} width={28} />} />
              </StarBorder>
            </div>
            <div className="ask-dusk-examples">
              {askDuskExamples.map((example) => <button className={`ask-dusk-example-row tone-${example.tone}`} key={example.text} type="button" onClick={() => setQuery(example.text)}><span className={`dashboard-cell-badge tone-${example.tone}`}><Badge variant={example.variant} label={example.label} /></span><p>{example.text}</p><span className="ask-dusk-example-time">{example.time}</span></button>)}
            </div>
          </div>
        </section>
      </div>
    )}
  </section>;
}

export function DashboardWidget({ title, className = "", children, contentClassName = "" }: DashboardWidgetProps) { return <article className={`dashboard-widget ${className}`.trim()}><header className="dashboard-widget-header"><h2>{title}</h2><IconButton label={`More options for ${title}`} variant="ghost" size="sm" icon={<MoreVertical size={16} />} /></header><div className={`dashboard-widget-content ${contentClassName}`.trim()}>{children}</div></article>; }

function DashboardTableWidget({ title, columns, template, rows, footerSummary, footerAction, className = "" }: DashboardTableWidgetProps) {
  const tableStyle = { "--table-columns": template } as CSSProperties;
  return <DashboardWidget title={title} className={`dashboard-table-widget ${className}`.trim()} contentClassName="dashboard-table-widget-body"><div className="dashboard-table-columns" style={tableStyle} aria-hidden="true">{columns.map((column, index) => <span key={`${column}-${index}`}>{column}</span>)}</div><div className="dashboard-table-list" style={tableStyle}>{rows.map((row, index) => <DashboardTableRow key={`${title}-${index}`} row={row} />)}</div><footer className="dashboard-table-footer"><span>{footerSummary}</span><Button className="dashboard-table-footer-button" label={footerAction} variant="ghost" size="sm" endContent={<ArrowRight size={16} />} /></footer></DashboardWidget>;
}

function DashboardTableRow({ row }: { row: TableRow }) { const cells = row.cells.map((cell, index) => <DashboardTableCell cell={cell} isAction={index === row.cells.length - 1} key={index} />); return row.onClick ? <button className="dashboard-table-row" type="button" onClick={row.onClick}>{cells}</button> : <div className="dashboard-table-row">{cells}</div>; }

function DashboardTableCell({ cell, isAction }: { cell: TableCell; isAction: boolean }) {
  if (isAction) return <span className="dashboard-table-open" aria-hidden="true"><ChevronRight size={16} /></span>;
  if (cell.badge) { const variant = cell.tone === "fraudulent" ? "error" : cell.tone === "suspicious" ? "warning" : cell.tone === "legitimate" ? "success" : "neutral"; return <span className="dashboard-table-cell dashboard-table-badge"><span className={`dashboard-cell-badge tone-${cell.tone ?? "neutral"}`}><Badge variant={variant} label={cell.badge} /></span>{cell.secondary && <small>{cell.secondary}</small>}</span>; }
  return <span className="dashboard-table-cell"><strong>{cell.primary}</strong>{cell.secondary && <small>{cell.secondary}</small>}</span>;
}

function AutomationExposure() { return <DashboardWidget title="Automation exposure" className="automation-widget" contentClassName="automation-widget-body"><div className="automation-chart"><div className="automation-chart-legend"><span>7-week trend</span><span><i className="automation-dot automated" />Automated</span><span><i className="automation-dot flagged" />Flagged</span></div><div className="automation-plot"><svg viewBox="0 0 596 168" preserveAspectRatio="none" role="img" aria-label="Seven week automated and flagged activity trend"><path d="M40 20H572M40 84H572M40 148H572" className="automation-grid" /><path d="M40 81L126 74L212 84L298 68L384 78L470 65L556 55L556 148H40Z" className="automation-area" /><path d="M40 81L126 74L212 84L298 68L384 78L470 65L556 55" className="automation-line automated" /><path d="M40 138L126 135L212 132L298 138L384 116L470 110L556 55" className="automation-line flagged" /><circle cx="556" cy="55" r="4" className="automation-point automated" /><circle cx="556" cy="55" r="3" className="automation-point flagged" /></svg><div className="automation-y-axis"><span>40%</span><span>20%</span><span>0%</span></div></div><div className="automation-x-axis">{["Jul 30", "Aug 6", "Aug 13", "Aug 20", "Aug 27", "Sep 3", "Sep 10"].map((date) => <span key={date}>{date}</span>)}</div></div><footer className="dashboard-table-footer automation-footer"><span>1 service account · 1 AI agent</span><Button className="dashboard-table-footer-button" label="View automations" variant="ghost" size="sm" endContent={<ArrowRight size={16} />} /></footer></DashboardWidget>; }
