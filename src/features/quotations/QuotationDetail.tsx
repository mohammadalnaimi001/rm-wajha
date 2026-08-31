import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { getQuotation, updateQuotationStatus, convertQuotationToContract, type QuotationWithItems } from "./api";
import { getContractByQuotationId } from "@/features/contracts/api";
import { Loading, Panel, QuotationStatusBadge, formatJD } from "@/features/dashboard/components";
import type { Contract, QuotationStatus } from "@/types/db";

const ALL_STATUSES: QuotationStatus[] = ["DRAFT", "SENT", "APPROVED", "REJECTED", "EXPIRED"];

export default function QuotationDetail({ basePath }: { basePath: "employee" | "admin" }) {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<QuotationWithItems | null>(null);
  const [linkedContract, setLinkedContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isAdmin = basePath === "admin";
  const isOwner = quotation && profile ? quotation.employee_id === profile.id : false;
  const canChangeStatus = isAdmin || (isOwner && quotation?.status === "DRAFT");
  const canConvert = (isAdmin || isOwner) && quotation?.status !== "REJECTED" && quotation?.status !== "EXPIRED";

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [q, c] = await Promise.all([getQuotation(id), getContractByQuotationId(id)]);
        if (!active) return;
        setQuotation(q);
        setLinkedContract(c);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load quotation");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleStatusChange(status: QuotationStatus) {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      await updateQuotationStatus(id, status);
      setQuotation((q) => (q ? { ...q, status } : q));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setBusy(false);
    }
  }

  async function handleConvert() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const contractId = await convertQuotationToContract(id);
      navigate(`/${basePath}/contracts/${contractId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to convert to contract");
      setBusy(false);
    }
  }

  if (loading) return <Loading />;
  if (error && !quotation) return <div className="dash-error">{error}</div>;
  if (!quotation) return null;

  return (
    <div>
      {error && <div className="dash-error">{error}</div>}

      <Panel
        title={quotation.quotation_number}
        actions={<QuotationStatusBadge status={quotation.status} />}
      >
        <div className="dash-form-row">
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: 4 }}>Customer</p>
            <p>{quotation.customer_name}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: 4 }}>Company</p>
            <p>{quotation.company_name ?? "—"}</p>
          </div>
        </div>
        <div className="dash-form-row">
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: 4 }}>Phone</p>
            <p>{quotation.phone ?? "—"}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: 4 }}>Email</p>
            <p>{quotation.email ?? "—"}</p>
          </div>
        </div>
        {quotation.instagram && (
          <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>Instagram: {quotation.instagram}</p>
        )}
        {quotation.notes && (
          <p style={{ color: "var(--muted)", fontSize: ".9rem", marginTop: 10 }}>Notes: {quotation.notes}</p>
        )}
      </Panel>

      <Panel title="Services">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {quotation.quotation_items.map((item) => (
                <tr key={item.id}>
                  <td>{item.service_name}</td>
                  <td>{formatJD(Number(item.price))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dash-total-bar">
          <div>
            <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              Subtotal {formatJD(Number(quotation.subtotal))} · Discount {formatJD(Number(quotation.discount))}
            </div>
            <b>Total: {formatJD(Number(quotation.total))}</b>
          </div>
        </div>
      </Panel>

      <Panel title="Actions">
        {linkedContract ? (
          <p>
            Already converted to contract{" "}
            <Link className="tlink" to={`/${basePath}/contracts/${linkedContract.id}`}>
              {linkedContract.contract_number}
            </Link>
            .
          </p>
        ) : (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            {canChangeStatus && (
              <select
                value={quotation.status}
                disabled={busy}
                onChange={(e) => handleStatusChange(e.target.value as QuotationStatus)}
                style={{ maxWidth: 200 }}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
            {canConvert && (
              <button className="btn btn-primary btn-sm" onClick={handleConvert} disabled={busy}>
                {busy ? "Converting…" : "Convert to Contract"}
              </button>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
