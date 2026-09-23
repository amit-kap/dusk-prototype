import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Avatar } from "@astryxdesign/core/Avatar";
import { Button } from "@astryxdesign/core/Button";
import { ToggleButton } from "@astryxdesign/core/ToggleButton";
import { Dashboard } from "./Dashboard";
import { FindingDetail } from "./FindingDetail";
import { FindingMasterItem } from "./FindingMasterItem";
import { findingItems } from "./findingData";
import { CaseProvider } from "./Cases";
import duskIcon from "./assets/dusk-icon.svg";
import navDashboardIcon from "./assets/nav-dashboard.svg";
import navFindingsIcon from "./assets/nav-findings.svg";
import navCasesIcon from "./assets/nav-cases.svg";
import navAccountsIcon from "./assets/nav-accounts.svg";
import navActorsIcon from "./assets/nav-actors.svg";
import navAutomationsIcon from "./assets/nav-automations.svg";
import navSettingsIcon from "./assets/nav-settings.svg";
import { CalendarDays, PanelLeftClose, PanelLeftOpen } from "lucide-react";

type View = "overview" | "finding";

function App() {
  const [view, setView] = useState<View>("overview");
  const [initialFindingId, setInitialFindingId] = useState(findingItems[0].id);

  const openFinding = (id: string = findingItems[0].id) => { setInitialFindingId(id); setView("finding"); };

  return (
    <div className="dusk-app">
      <CaseProvider>
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
          <Dashboard onOpenFinding={openFinding} />
        ) : (
          <Finding selectedId={initialFindingId} setSelectedId={setInitialFindingId} />
        )}
      </main>
      </CaseProvider>
    </div>
  );
}

function NavItem({ icon, label, active, count, onClick }: { icon: React.ReactNode; label: string; active?: boolean; count?: string; onClick?: () => void }) {
  return <button className={`nav-item ${active ? "is-active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}><span className="nav-icon-container">{icon}</span><span>{label}</span>{count && <small>{count}</small>}</button>;
}

function Finding({ selectedId, setSelectedId }: { selectedId: string; setSelectedId: (id: string) => void }) {
  const [listCollapsed, setListCollapsed] = useState(false);
  const [filter, setFilter] = useState<"All" | "Open" | "Cleared">("All");
  const [listWidth, setListWidth] = useState(() => window.innerWidth <= 1350 ? 320 : 368);
  const masterDetailRef = useRef<HTMLDivElement>(null);
  const listPaneRef = useRef<HTMLDivElement>(null);
  const resizeState = useRef<{ pointerId: number; startX: number; startWidth: number } | null>(null);
  const visibleItems = useMemo(() => filter === "All" ? findingItems : findingItems.filter((item) => item.status === filter), [filter]);
  const selectedItem = findingItems.find((item) => item.id === selectedId) ?? findingItems[0];
  const getListWidthMaximum = () => {
    const workspaceWidth = masterDetailRef.current?.getBoundingClientRect().width;
    return Math.max(280, workspaceWidth ? workspaceWidth - 436 : 560);
  };
  const constrainListWidth = (width: number) => Math.round(Math.min(getListWidthMaximum(), Math.max(280, width)));
  const beginListResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(max-width: 1100px)").matches) return;
    const startWidth = listPaneRef.current?.getBoundingClientRect().width ?? listWidth;
    resizeState.current = { pointerId: event.pointerId, startX: event.clientX, startWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const resizeList = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const resize = resizeState.current;
    if (!resize || resize.pointerId !== event.pointerId) return;
    setListWidth(constrainListWidth(resize.startWidth + event.clientX - resize.startX));
  };
  const endListResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (resizeState.current?.pointerId !== event.pointerId) return;
    resizeState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const resizeListWithKeyboard = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 64 : 16;
    if (event.key === "ArrowLeft") setListWidth((width) => constrainListWidth(width - step));
    else if (event.key === "ArrowRight") setListWidth((width) => constrainListWidth(width + step));
    else if (event.key === "Home") setListWidth(280);
    else if (event.key === "End") setListWidth(constrainListWidth(Number.MAX_SAFE_INTEGER));
    else return;
    event.preventDefault();
  };
  useEffect(() => {
    if (filter !== "All" && selectedItem.status !== filter) setFilter("All");
  }, [filter, selectedItem.status]);

  const applyFilter = (nextFilter: "All" | "Open" | "Cleared") => {
    setFilter(nextFilter);
    const nextItems = nextFilter === "All" ? findingItems : findingItems.filter((item) => item.status === nextFilter);
    if (!nextItems.some((item) => item.id === selectedId)) setSelectedId(nextItems[0]?.id ?? findingItems[0].id);
  };

  return <section className="finding-page">
    <header className="findings-page-header">
      <div>
        <IconButton label={listCollapsed ? "Expand findings list" : "Collapse findings list"} variant="ghost" size="md" icon={listCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />} aria-expanded={!listCollapsed} aria-controls="findings-list-pane" onClick={() => setListCollapsed((collapsed) => !collapsed)} />
        <h1>Findings</h1>
        <p>4 require review · 1 cleared</p>
      </div>
      <Button className="findings-range-button" label="Last 7 days" variant="secondary" size="md" icon={<CalendarDays size={14} />} />
    </header>
    <div ref={masterDetailRef} className={`findings-master-detail${listCollapsed ? " is-list-collapsed" : ""}`} style={{ "--findings-list-width": `${listWidth}px` } as CSSProperties} aria-label="Findings master-detail workspace">
      <div ref={listPaneRef} id="findings-list-pane" hidden={listCollapsed} className="findings-pane findings-inbox" aria-label="Findings inbox">
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
      <button className="findings-splitter" type="button" role="separator" aria-label="Resize findings list" aria-orientation="vertical" aria-controls="findings-list-pane" aria-valuemin={280} aria-valuemax={getListWidthMaximum()} aria-valuenow={listWidth} onPointerDown={beginListResize} onPointerMove={resizeList} onPointerUp={endListResize} onPointerCancel={endListResize} onKeyDown={resizeListWithKeyboard}><span aria-hidden="true" /></button>
      <div className="findings-pane findings-detail-pane" aria-label="Finding detail"><FindingDetail item={selectedItem} /></div>
    </div>
  </section>;
}

export default App;
