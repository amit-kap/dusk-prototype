import { createContext, useContext, useState, type ReactNode, type KeyboardEvent } from "react";
import { Button } from "@astryxdesign/core/Button";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Dialog } from "@astryxdesign/core/Dialog";
import { Check, FolderSearch, X } from "lucide-react";
import { initialCases, type CaseRecord } from "./caseData";
import { findingItems } from "./findingData";
import "./cases.css";

type CaseContextValue = { cases: CaseRecord[]; startInvestigation: (id: string) => void };
const CaseContext = createContext<CaseContextValue | null>(null);
export function useCases() {
  const value = useContext(CaseContext);
  if (!value) throw new Error("Cases must be used within CaseProvider");
  return value;
}

function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, input, textarea, select, [tabindex]'))
    .filter((node) => node.tabIndex >= 0 && !node.matches(':disabled, [aria-disabled="true"]') && node.getClientRects().length > 0);
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState(initialCases);
  const [findingId, setFindingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const finding = findingItems.find((item) => item.id === findingId);
  function createCase(name: string, purpose: string) {
    if (!finding || !name.trim() || !purpose.trim()) return;
    const current = cases;
      if (current.some((item) => item.findingIds.includes(finding.id))) {
        setCases(current);
        setFindingId(null);
        setConfirmation("An investigation has already been started for this finding.");
        return;
      }
      const next: CaseRecord = {
        id: `INV-${Math.max(205, ...current.map((item) => Number(item.id.slice(4)) || 0)) + 1}`,
        name: name.trim(), purpose: purpose.trim(), owner: "Carla Rivas", status: "Investigating",
        priority: finding.id === "FND-1042" ? "Critical" : "Unassigned",
        updated: new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        findingIds: [finding.id],
      };
      const updated = [next, ...current];
      setCases(updated);
      setFindingId(null);
      setConfirmation(`Investigation started · ${next.name}`);
  }
  return <CaseContext.Provider value={{ cases, startInvestigation: (id) => { setConfirmation(""); setFindingId(id); } }}>
    {children}
    {finding && <CreateCase findingId={finding.id} findingTitle={finding.title} onClose={() => setFindingId(null)} onSave={createCase} />}
    {confirmation && <div className="case-confirmation"><Check size={18} /><span role="status">{confirmation}</span><IconButton label="Dismiss confirmation" variant="ghost" size="sm" icon={<X size={16} />} onClick={() => setConfirmation("")} /></div>}
  </CaseContext.Provider>;
}

function CreateCase({ findingId, findingTitle, onClose, onSave }: { findingId: string; findingTitle: string; onClose: () => void; onSave: (name: string, purpose: string) => void }) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const valid = !!name.trim() && !!purpose.trim();
  return <Dialog className="case-dialog" isOpen onOpenChange={(open) => { if (!open) onClose(); }} onKeyDown={trapFocus} purpose="form" padding={0} width={600} aria-labelledby="create-case-title">
    <header className="case-modal-header"><div><h2 id="create-case-title">Create case</h2><p>Start an investigation from this finding.</p></div><IconButton label="Close create case" variant="ghost" icon={<X size={20} />} onClick={onClose} /></header>
    <form onSubmit={(event) => { event.preventDefault(); if (valid) onSave(name, purpose); }}>
      <div className="case-modal-body">
        <div className="case-finding-context"><FolderSearch size={20} /><div><small>Included finding · {findingId}</small><strong>{findingTitle}</strong></div></div>
        <label className="case-field">Case name<input autoFocus required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Unregistered payroll transfers" /></label>
        <label className="case-field">Investigation purpose<textarea required maxLength={600} rows={3} value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="What do you need to establish?" /></label>
        <p className="case-help">Owned by Carla Rivas. This finding will be attached and the case will be marked Investigating.</p>
      </div>
      <footer className="case-modal-footer"><Button label="Cancel" type="button" variant="secondary" onClick={onClose} /><Button label="Create case" type="submit" variant="primary" isDisabled={!valid} /></footer>
    </form>
  </Dialog>;
}

export function FindingCaseAction({ findingId }: { findingId: string }) {
  const { cases, startInvestigation } = useCases();
  const linked = cases.find((item) => item.findingIds.includes(findingId));
  return linked
    ? <Button label="View case" variant="primary" size="md" aria-label={`View case ${linked.id}: ${linked.name}`} />
    : <Button label="Start investigation" variant="primary" size="md" onClick={() => startInvestigation(findingId)} />;
}
