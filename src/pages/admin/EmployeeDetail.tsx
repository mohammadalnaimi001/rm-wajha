import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { getEmployee, sendPasswordReset } from "@/features/employees/api";
import { setEmployeeTarget, getAllEmployeePerformance, type EmployeePerformanceRow } from "@/features/performance/api";
import { Loading, Panel, StatCard, formatJD } from "@/features/dashboard/components";
import QuotationsList from "@/features/quotations/QuotationsList";
import ContractsList from "@/features/contracts/ContractsList";
import type { Profile } from "@/types/db";

function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

export default function AdminEmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Profile | null>(null);
  const [perf, setPerf] = useState<EmployeePerformanceRow | null>(null);
  const [target, setTarget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const [emp, rows] = await Promise.all([getEmployee(id), getAllEmployeePerformance(currentMonthKey())]);
      setEmployee(emp);
      const row = rows.find((r) => r.employee_id === id) ?? null;
      setPerf(row);
      setTarget(row?.monthly_target ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load employee");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSetTarget(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await setEmployeeTarget(id, currentMonthKey(), target);
      setSuccess("Monthly target updated.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set target");
    } finally {
      setBusy(false);
    }
  }

  async function handleResetPassword() {
    if (!employee) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      await sendPasswordReset(employee.email);
      setSuccess(`Password reset email sent to ${employee.email}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send reset email");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading />;
  if (error && !employee) return <div className="dash-error">{error}</div>;
  if (!employee) return null;

  return (
    <div>
      {error && <div className="dash-error">{error}</div>}
      {success && <div className="dash-success">{success}</div>}

      <Panel title={employee.full_name} actions={<span className={`dash-badge ${employee.active ? "ok" : "bad"}`}>{employee.active ? "Active" : "Inactive"}</span>}>
        <div className="dash-form-row">
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem" }}>Email</p>
            <p>{employee.email}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: ".82rem" }}>Phone</p>
            <p>{employee.phone ?? "—"}</p>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleResetPassword} disabled={busy} style={{ marginTop: 10 }}>
          Send Password Reset Email
        </button>
      </Panel>

      {perf && (
        <div className="dash-stats">
          <StatCard label="Contracts" value={String(perf.total_contracts)} />
          <StatCard label="Sales (this month)" value={formatJD(perf.monthly_sales)} />
          <StatCard label="Target" value={formatJD(perf.monthly_target)} />
          <StatCard label="Achievement" value={`${perf.achievement_pct}%`} />
        </div>
      )}

      <Panel title="Set Monthly Target">
        <form onSubmit={handleSetTarget} style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="dash-field" style={{ marginBottom: 0 }}>
            <label htmlFor="target">Target (JD)</label>
            <input
              id="target"
              type="number"
              min={0}
              step="0.01"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value) || 0)}
              style={{ maxWidth: 200 }}
            />
          </div>
          <button className="btn btn-primary btn-sm" type="submit" disabled={busy}>
            Save Target
          </button>
        </form>
      </Panel>

      <Panel title="Quotations">
        <QuotationsList basePath="admin" employeeId={employee.id} />
      </Panel>

      <Panel title="Contracts">
        <ContractsList basePath="admin" employeeId={employee.id} />
      </Panel>
    </div>
  );
}
