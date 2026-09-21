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
};

export function FindingMasterItem({ entity, timestamp, title, verdict, confidence, status, selected }: FindingMasterItemProps) {
  return (
    <button className={`finding-master-item ${selected ? "is-selected" : ""}`} type="button" aria-current={selected ? "true" : undefined}>
      <span className="finding-master-entity">{entity} · {timestamp}</span>
      <span className="finding-master-title">{title}</span>
      <span className="finding-master-footer">
        <span className={`finding-verdict finding-verdict-${verdict.toLowerCase()}`}><span className="finding-verdict-dot" />{verdict}</span>
        <span className="finding-confidence">{confidence}</span>
        <span className={`finding-status finding-status-${status.toLowerCase()}`}>{status}</span>
      </span>
    </button>
  );
}
