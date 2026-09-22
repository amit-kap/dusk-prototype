import { Badge } from "@astryxdesign/core/Badge";

export type FindingVerdict = "Fraudulent" | "Suspicious" | "Legitimate";

export type FindingMasterItemData = {
  id: string;
  entity: string;
  timestamp: string;
  title: string;
  verdict: FindingVerdict;
  confidence: string;
  status: "Open" | "Cleared";
};

type FindingMasterItemProps = FindingMasterItemData & {
  selected?: boolean;
  onSelect?: () => void;
};

const badgeVariant = {
  Fraudulent: "error",
  Suspicious: "warning",
  Legitimate: "success",
} as const;

export function FindingMasterItem({ entity, timestamp, title, verdict, confidence, status, selected, onSelect }: FindingMasterItemProps) {
  return (
    <button className={`finding-master-item ${selected ? "is-selected" : ""}`} type="button" aria-pressed={selected} onClick={onSelect}>
      <span className="finding-master-entity">{entity} · {timestamp}</span>
      <span className="finding-master-title">{title}</span>
      <span className="finding-master-footer">
        <Badge className={`finding-badge tone-${verdict.toLowerCase()}`} variant={badgeVariant[verdict]} label={verdict} />
        <span className="finding-confidence">{confidence}</span>
        <span className={`finding-status finding-status-${status.toLowerCase()}`}>{status}</span>
      </span>
    </button>
  );
}
