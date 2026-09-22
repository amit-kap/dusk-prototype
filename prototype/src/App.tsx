import { useMemo, useState } from "react";
import { Avatar } from "@astryxdesign/core/Avatar";
import { Button } from "@astryxdesign/core/Button";
import { ToggleButton } from "@astryxdesign/core/ToggleButton";
import { Dashboard } from "./Dashboard";
import { FindingDetail } from "./FindingDetail";
import { FindingMasterItem } from "./FindingMasterItem";
import { findingItems } from "./findingData";
import duskIcon from "./assets/dusk-icon.svg";
import navDashboardIcon from "./assets/nav-dashboard.svg";
import navFindingsIcon from "./assets/nav-findings.svg";
import navCasesIcon from "./assets/nav-cases.svg";
import navAccountsIcon from "./assets/nav-accounts.svg";
import navActorsIcon from "./assets/nav-actors.svg";
import navAutomationsIcon from "./assets/nav-automations.svg";
import navSettingsIcon from "./assets/nav-settings.svg";
import { CalendarDays } from "lucide-react";

type View = "overview" | "finding";

function App() {
  const [view, setView] = useState<View>("overview");
  const [initialFindingId, setInitialFindingId] = useState(findingItems[0].id);

  return (
    <div className="dusk-app">
      <aside className="dusk-rail" aria-label="Primary navigation">
        <div className="dusk-mark" aria-label="Dusk home"><img src={duskIcon} alt="" /></div>
        <nav className="dusk-nav">
          <NavItem icon={<img src={navDashboardIcon} alt="" />} label="Dashboard" active={view === "overview"} onClick={() => setView("overview")} />
          <NavItem icon={<img src={navFindingsIcon} alt="" />} label="Findings" active={view === "finding"} onClick={() => setView("finding")} />
          <NavItem icon={<img src={navCasesIcon} alt="" />} label="Cases" />
          <NavItem icon={<img src={navAccountsIcon} alt="" />} label="Accounts" />
          <NavItem icon={<img src={navActorsIcon} alt="" />} label="Actors" />
          <NavItem icon={<img src={navAutomationsIcon} alt="" />} label="Automations" />
        </nav>
        <div className="dusk-rail-bottom">
          <NavItem icon={<img src={navSettingsIcon} alt="" />} label="Settings" />
          <div className="dusk-avatar-slot">
            <Avatar name="C. Rivas" size={40} />
          </div>
        </div>
      </aside>

      <main className={`dusk-main ${view === "overview" ? "dusk-main-dashboard" : ""}`}>
        {view === "overview" ? (
          <Dashboard onOpenFinding={(id = findingItems[0].id) => { setInitialFindingId(id); setView("finding"); }} />
        ) : (
          <Finding initialFindingId={initialFindingId} />
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, count, onClick }: { icon: React.ReactNode; label: string; active?: boolean; count?: string; onClick?: () => void }) {
  return <button className={`nav-item ${active ? "is-active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}><span className="nav-icon-container">{icon}</span><span>{label}</span>{count && <small>{count}</small>}</button>;
}

function Finding({ initialFindingId }: { initialFindingId: string }) {
  const [filter, setFilter] = useState<"All" | "Open" | "Cleared">("All");
  const [selectedId, setSelectedId] = useState(initialFindingId);
  const visibleItems = useMemo(() => filter === "All" ? findingItems : findingItems.filter((item) => item.status === filter), [filter]);
  const selectedItem = findingItems.find((item) => item.id === selectedId) ?? findingItems[0];

  const applyFilter = (nextFilter: "All" | "Open" | "Cleared") => {
    setFilter(nextFilter);
    const nextItems = nextFilter === "All" ? findingItems : findingItems.filter((item) => item.status === nextFilter);
    if (!nextItems.some((item) => item.id === selectedId)) setSelectedId(nextItems[0]?.id ?? findingItems[0].id);
  };

  return <section className="finding-page">
    <header className="findings-page-header">
      <div>
        <h1>Findings</h1>
        <p>4 require review · 1 cleared</p>
      </div>
      <Button className="findings-range-button" label="Last 7 days" variant="secondary" size="md" icon={<CalendarDays size={14} />} />
    </header>
    <div className="findings-master-detail" aria-label="Findings master-detail workspace">
      <div className="findings-pane findings-inbox" aria-label="Findings inbox">
        <div className="findings-filters">
          <div className="findings-filters-control" role="group" aria-label="Finding status filters">
            <ToggleButton label="All · 5" size="sm" isPressed={filter === "All"} onPressedChange={() => applyFilter("All")} />
            <ToggleButton label="Open · 4" size="sm" isPressed={filter === "Open"} onPressedChange={() => applyFilter("Open")} />
            <ToggleButton label="Cleared · 1" size="sm" isPressed={filter === "Cleared"} onPressedChange={() => applyFilter("Cleared")} />
          </div>
        </div>
        <div className="finding-master-list" role="group" aria-label={`${filter} findings`}>
          {visibleItems.map((item) => <FindingMasterItem key={item.id} {...item} selected={item.id === selectedId} onSelect={() => setSelectedId(item.id)} />)}
        </div>
      </div>
      <div className="findings-pane findings-detail-pane" aria-label="Finding detail"><FindingDetail item={selectedItem} /></div>
    </div>
  </section>;
}

export default App;
