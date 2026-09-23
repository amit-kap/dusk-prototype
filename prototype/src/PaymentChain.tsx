import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/IconButton";
import {
  Background,
  BaseEdge,
  Handle,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  getStraightPath,
  useReactFlow,
  useStore,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { ExternalLink, KeyRound, Landmark, LocateFixed, Minus, Plus, ReceiptText, UserRound, X } from "lucide-react";

type ChainTone = "signal" | "danger";
type ChainNodeData = {
  kind: "entity" | "action";
  title: string;
  meta: string;
  foot: string;
  detail: string;
  source: string;
  tone?: ChainTone;
  icon: "actor" | "account" | "beneficiary" | "access" | "transfer";
  onSelect?: () => void;
};
type ChainGraphNode = Node<ChainNodeData, "chain">;
type ChainEdgeData = { order: number };
type ChainGraphEdge = Edge<ChainEdgeData, "flow">;

const chainNodes: ChainGraphNode[] = [
  {
    id: "marek",
    type: "chain",
    position: { x: 0, y: 0 },
    style: { width: 218, height: 131 },
    draggable: false,
    ariaLabel: "D. Marek, employee, dormant rights reactivated",
    data: {
      kind: "entity",
      icon: "actor",
      title: "D. Marek",
      meta: "Employee · Day 9 of 30-day notice",
      foot: "Dormant rights reactivated",
      source: "Identity and access event · Tue 09:12",
      detail: "Approval authority that had been dormant was used to access payroll. Attribution to Marek remains unverified.",
    },
  },
  {
    id: "access",
    type: "chain",
    position: { x: 226, y: 44.5 },
    style: { width: 100, height: 72 },
    draggable: false,
    ariaLabel: "Access event",
    data: {
      kind: "action",
      icon: "access",
      title: "Access",
      meta: "Tuesday · 09:12",
      foot: "Dormant authority",
      source: "Access event",
      detail: "Quarter-close approval rights granted six months earlier remained active. At 09:12, those rights were used to access 14 Critical finance accounts and queue payments within 20 minutes, at 12× normal volume.",
    },
  },
  {
    id: "payroll",
    type: "chain",
    position: { x: 334, y: 0 },
    style: { width: 218, height: 131 },
    draggable: false,
    ariaLabel: "Payroll Master EU, 14 accounts accessed at twelve times normal activity",
    data: {
      kind: "entity",
      icon: "account",
      title: "Payroll Master — EU",
      meta: "Payroll accounts · FY24 Comp & Equity",
      foot: "14 accessed · 12× activity",
      source: "Payroll access and transfer events · Tue 09:12–09:40",
      detail: "The named payroll accounts are examples within the 14-account access population. The complete account list still requires verification.",
    },
  },
  {
    id: "transfer",
    type: "chain",
    position: { x: 560, y: 44.5 },
    style: { width: 100, height: 72 },
    draggable: false,
    ariaLabel: "Two transfer events",
    data: {
      kind: "action",
      icon: "transfer",
      title: "Transfer (2)",
      meta: "Tuesday · 09:40",
      foot: "Unregistered beneficiary",
      source: "Transfer events",
      detail: "At 09:40, two payments were routed to a personal account not listed in the payee master.",
    },
  },
  {
    id: "beneficiary",
    type: "chain",
    position: { x: 668, y: 0 },
    style: { width: 218, height: 131 },
    draggable: false,
    ariaLabel: "External beneficiary j.doe.personal@gmail, funds withdrawn Tuesday at 22:07",
    data: {
      kind: "entity",
      icon: "beneficiary",
      title: "j.doe.personal@gmail",
      meta: "External beneficiary",
      foot: "Funds withdrawn · Tue 22:07",
      source: "Beneficiary and withdrawal events · Tue 22:07",
      detail: "The funds were withdrawn from an unrecognized device in a new geography. Beneficiary ownership and control of the withdrawal session remain unverified.",
      tone: "danger",
    },
  },
];

const chainEdges: ChainGraphEdge[] = [
  { id: "marek-access", source: "marek", target: "access", type: "flow", data: { order: 0 } },
  { id: "access-payroll", source: "access", target: "payroll", type: "flow", data: { order: 1 } },
  { id: "payroll-transfer", source: "payroll", target: "transfer", type: "flow", data: { order: 2 } },
  { id: "transfer-beneficiary", source: "transfer", target: "beneficiary", type: "flow", data: { order: 3 } },
];

const nodeTypes = { chain: ChainNode };
const edgeTypes = { flow: FlowEdge };
const chainHandleStyle = { width: 1, height: 1, minWidth: 1, minHeight: 1 };
const flowCycleMilliseconds = 750;
const flowStaggerMilliseconds = 125;

export function PaymentChain() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const closeExplorer = useCallback(() => setIsExplorerOpen(false), []);
  const openExplorer = useCallback(() => {
    setSelectedId(chainNodes[0].id);
    setIsExplorerOpen(true);
  }, []);

  return (
    <>
      <section className="finding-payment-chain" aria-labelledby="payment-chain-title">
        <div className="finding-section-heading">
          <h3 id="payment-chain-title">Payment chain</h3>
          <div className="payment-chain-heading-actions">
            <Button label="Explore" variant="ghost" size="sm" endContent={<ExternalLink size={16} />} onClick={openExplorer} />
          </div>
        </div>
        <PaymentChainGraph selectedId={selectedId} onSelect={setSelectedId} mode="compact" />
      </section>
      {isExplorerOpen && (
        <PaymentChainExplorer
          selectedId={selectedId}
          onSelect={setSelectedId}
          onClose={closeExplorer}
        />
      )}
    </>
  );
}

function PaymentChainGraph({ selectedId, onSelect, mode }: { selectedId: string | null; onSelect: (id: string | null) => void; mode: "compact" | "expanded" }) {
  const isExpanded = mode === "expanded";
  const nodes = useMemo<ChainGraphNode[]>(() => chainNodes.map((node) => ({ ...node, selected: node.id === selectedId, data: { ...node.data, onSelect: () => onSelect(node.id) } })), [onSelect, selectedId]);
  const connectedEdgeIds = useMemo(() => new Set(chainEdges.filter((edge) => edge.source === selectedId || edge.target === selectedId).map((edge) => edge.id)), [selectedId]);
  const edges = useMemo<ChainGraphEdge[]>(() => chainEdges.map((edge) => ({
    ...edge,
    selected: connectedEdgeIds.has(edge.id),
  })), [connectedEdgeIds]);

  return (
    <div className={`payment-chain-canvas is-${mode}`} aria-label="Interactive payment chain graph">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          elementsSelectable
          panOnDrag
          panOnScroll={false}
          zoomOnScroll={isExpanded}
          zoomOnPinch={isExpanded}
          zoomActivationKeyCode={isExpanded ? undefined : null}
          zoomOnDoubleClick={false}
          minZoom={0.55}
          maxZoom={1.8}
          fitView
          fitViewOptions={{ padding: mode === "compact" ? 0.01 : 0.16, maxZoom: mode === "compact" ? 1 : 1.2 }}
          colorMode="dark"
        >
          {mode === "expanded" && <Background color="rgba(113, 128, 120, .32)" gap={16} size={1} />}
          {mode === "expanded" && <GraphControls />}
          {!isExpanded && <CompactAutoFit />}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

function CompactAutoFit() {
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (!width || !height) return;
    const frame = requestAnimationFrame(() => { void fitView({ padding: 0.01, maxZoom: 1, duration: 0 }); });
    return () => cancelAnimationFrame(frame);
  }, [width, height, fitView]);
  return null;
}

function GraphControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <Panel position="top-right" className="payment-chain-controls">
      <IconButton label="Zoom out" variant="ghost" size="sm" icon={<Minus size={14} />} onClick={() => zoomOut({ duration: 180 })} />
      <IconButton label="Zoom in" variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => zoomIn({ duration: 180 })} />
      <IconButton label="Fit payment chain" variant="ghost" size="sm" icon={<LocateFixed size={14} />} onClick={() => fitView({ padding: 0.12, duration: 220, maxZoom: 1.2 })} />
    </Panel>
  );
}

function ChainNode({ data, selected }: NodeProps<ChainGraphNode>) {
  const icon = getNodeIcon(data.icon);
  if (data.kind === "action") {
    return (
      <button type="button" className={`finding-chain-action payment-chain-action-node${selected ? " is-selected" : ""}`} aria-label={data.title} onClick={data.onSelect}>
        <div className="payment-chain-action-icon">
          <Handle type="target" position={Position.Left} style={chainHandleStyle} />
          {icon}
          <Handle type="source" position={Position.Right} style={chainHandleStyle} />
        </div>
        <span>{data.title}</span>
      </button>
    );
  }
  return (
    <button type="button" className={`finding-chain-entity tone-${data.tone ?? "signal"}${selected ? " is-selected" : ""}`} aria-label={`${data.title}. ${data.meta}. ${data.foot}`} onClick={data.onSelect}>
      <Handle type="target" position={Position.Left} style={chainHandleStyle} />
      <div className="finding-chain-title">{icon}<strong>{data.title}</strong></div>
      <span>{data.meta}</span>
      <div className="finding-chain-divider" />
      <p>{data.foot}</p>
      <Handle type="source" position={Position.Right} style={chainHandleStyle} />
    </button>
  );
}

function FlowEdge({ id, sourceX, sourceY, targetX, targetY, data }: EdgeProps<ChainGraphEdge>) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const dashStyle = {
    animationDuration: `${flowCycleMilliseconds}ms`,
    animationDelay: `${(data?.order ?? 0) * flowStaggerMilliseconds - flowCycleMilliseconds}ms`,
  } as CSSProperties;
  return <BaseEdge id={id} path={edgePath} className="payment-chain-edge payment-chain-flow-dashes" style={dashStyle} />;
}

function PaymentChainExplorer({ selectedId, onSelect, onClose }: { selectedId: string | null; onSelect: (id: string | null) => void; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const selectedNode = chainNodes.find((node) => node.id === selectedId) ?? null;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') ?? []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className="payment-chain-overlay" role="presentation" onMouseDown={onClose}>
      <section ref={dialogRef} className="payment-chain-explorer" role="dialog" aria-modal="true" aria-labelledby="payment-chain-explorer-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="payment-chain-explorer-header">
          <div>
            <h2 id="payment-chain-explorer-title">Payment chain</h2>
            <p>FND-1042 · D. Marek · Tuesday, 09:12–22:07</p>
          </div>
          <IconButton ref={closeRef} label="Close payment chain" variant="ghost" size="sm" icon={<X size={16} />} onClick={onClose} />
        </header>
        <div className="payment-chain-explorer-body">
          <PaymentChainGraph selectedId={selectedId} onSelect={onSelect} mode="expanded" />
          <aside className="payment-chain-inspector" aria-label="Selected payment chain node details">
            {selectedNode ? <NodeDetails node={selectedNode} /> : <div className="payment-chain-inspector-empty"><p>Select a node</p><span>Choose an actor, account, event, or beneficiary to inspect its evidence.</span></div>}
          </aside>
        </div>
      </section>
    </div>
  );
}

function NodeDetails({ node }: { node: ChainGraphNode }) {
  return (
    <div className="payment-chain-node-details">
      <div className="payment-chain-node-details-heading">
        <div>
          <Badge variant={node.data.tone === "danger" ? "error" : "neutral"} label={node.data.kind === "action" ? "Event" : "Entity"} />
          <h3>{node.data.title}</h3>
        </div>
      </div>
      <p>{node.data.detail}</p>
      <span>{node.data.source}</span>
    </div>
  );
}

function getNodeIcon(icon: ChainNodeData["icon"]) {
  if (icon === "actor") return <UserRound size={20} />;
  if (icon === "account") return <Landmark size={20} />;
  if (icon === "beneficiary") return <ExternalLink size={20} />;
  if (icon === "access") return <KeyRound size={18} />;
  return <ReceiptText size={18} />;
}
