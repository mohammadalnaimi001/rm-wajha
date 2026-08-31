import type { ReactNode } from "react";
import type { ContractStatus, QuotationStatus } from "@/types/db";

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="dash-stat">
      <em>{label}</em>
      <b>{value}</b>
      {hint && <small>{hint}</small>}
    </div>
  );
}

const QUOTATION_TONE: Record<QuotationStatus, string> = {
  DRAFT: "warn",
  SENT: "info",
  APPROVED: "ok",
  REJECTED: "bad",
  EXPIRED: "bad"
};

const CONTRACT_TONE: Record<ContractStatus, string> = {
  PENDING: "warn",
  CONFIRMED: "info",
  PAID: "ok",
  CANCELLED: "bad"
};

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
  return <span className={`dash-badge ${QUOTATION_TONE[status]}`}>{status}</span>;
}

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return <span className={`dash-badge ${CONTRACT_TONE[status]}`}>{status}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="dash-empty">{children}</div>;
}

export function Loading() {
  return <div className="dash-loading">Loading…</div>;
}

export function Panel({ title, actions, children }: { title?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="dash-panel">
      {title && (
        <div className="dash-panel-head">
          <h2>{title}</h2>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function formatJD(n: number): string {
  return `${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} JD`;
}
