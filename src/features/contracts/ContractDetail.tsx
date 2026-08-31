import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { getContract, updateContractStatus, updateContractNotes, type ContractWithItems } from "./api";
import { Loading, Panel, ContractStatusBadge, formatJD } from "@/features/dashboard/components";
import type { ContractStatus } from "@/types/db";

const ALL_STATUSES: ContractStatus[] = ["PENDING", "CONFIRMED", "PAID", "CANCELLED"];

export default function ContractDetail({ basePath }: { basePath: "employee" | "admin" }) {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const [contract, setContract] = useState<ContractWithItems | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isAdmin = basePath === "admin";
  const isOwner = contract && profile ? contract.employee_id === profile.id : false;

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const c = await getContract(id);
        if (!active) return;
        setContract(c);
        setNotes(c.notes ?? "");
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load contract");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleStatusChange(status: ContractStatus) {
    if (!id) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await updateContractStatus(id, status);
      setContract((c) => (c ? { ...c, status } : c));
      setSuccess("Status updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveNotes() {
    if (!id) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await updateContractNotes(id, notes);
      setSuccess("Notes saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save notes");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading />;
  if (error && !contract) return <div className="dash-error">{error}</div>;
  if (!contract) return null;

  const canEditNotes = isAdmin || (isOwner && contract.status === "PENDING");

  return (
    <div>
      {error && <div className="dash-error">{error}</div>}
      {success && <div className="dash-success">{success}</div>}

      <Panel title={contract.contract_number} actions={<ContractStatusBadge status={contract.status} />}>
        <div className="dash-form-row">
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: 4 }}>Customer</p>
            <p>{contract.customer_name}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: 4 }}>Company</p>
            <p>{contract.company_name ?? "—"}</p>
          </div>
        </div>
        <div className="dash-form-row">
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: 4 }}>Phone</p>
            <p>{contract.phone ?? "—"}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: 4 }}>Email</p>
            <p>{contract.email ?? "—"}</p>
          </div>
        </div>
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
              {contract.contract_items.map((item) => (
                <tr key={item.id}>
                  <td>{item.service_name}</td>
                  <td>{formatJD(Number(item.price))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dash-total-bar">
          <b>Total: {formatJD(Number(contract.total))}</b>
        </div>
      </Panel>

      <Panel title="Status & Notes">
        <div className="dash-field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={contract.status}
            disabled={busy || !isAdmin}
            onChange={(e) => handleStatusChange(e.target.value as ContractStatus)}
            style={{ maxWidth: 220 }}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {!isAdmin && (
            <small style={{ display: "block", color: "var(--muted-2)", marginTop: 6 }}>
              Only an admin can confirm, mark paid, or cancel a contract.
            </small>
          )}
        </div>
        <div className="dash-field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            disabled={!canEditNotes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {canEditNotes && (
          <button className="btn btn-primary btn-sm" onClick={handleSaveNotes} disabled={busy}>
            Save Notes
          </button>
        )}
      </Panel>
    </div>
  );
}
