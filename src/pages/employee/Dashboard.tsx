import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { getMyPerformance } from "@/features/performance/api";
import { listQuotations } from "@/features/quotations/api";
import { listContracts } from "@/features/contracts/api";
import { StatCard, Loading, Panel, EmptyState, QuotationStatusBadge, ContractStatusBadge, formatJD } from "@/features/dashboard/components";
import type { MyPerformance, Quotation, Contract } from "@/types/db";

export default function EmployeeDashboard() {
  const { profile } = useAuth();
  const [perf, setPerf] = useState<MyPerformance | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    let active = true;
    (async () => {
      try {
        const [p, q, c] = await Promise.all([
          getMyPerformance(),
          listQuotations({ employeeId: profile.id }),
          listContracts({ employeeId: profile.id })
        ]);
        if (!active) return;
        setPerf(p);
        setQuotations(q.slice(0, 5));
        setContracts(c.slice(0, 5));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [profile]);

  if (loading) return <Loading />;
  if (error) return <div className="dash-error">{error}</div>;

  return (
    <div>
      <div className="dash-stats">
        <StatCard label="Contracts" value={String(perf?.total_contracts ?? 0)} />
        <StatCard label="Sales" value={formatJD(perf?.total_sales ?? 0)} hint="Confirmed + Paid" />
        <StatCard label="Monthly Target" value={formatJD(perf?.monthly_target ?? 0)} />
        <StatCard
          label="Achievement"
          value={`${perf?.achievement_pct ?? 0}%`}
          hint={perf ? `Ranking #${perf.rank} of ${perf.headcount}` : undefined}
        />
      </div>

      <Panel
        title="Recent Quotations"
        actions={<Link className="tlink" to="/employee/quotations">View all</Link>}
      >
        {quotations.length === 0 ? (
          <EmptyState>No quotations yet. <Link className="tlink" to="/employee/quotation">Create one</Link>.</EmptyState>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <Link className="tlink" to={`/employee/quotations/${q.id}`}>{q.quotation_number}</Link>
                    </td>
                    <td>{q.customer_name}</td>
                    <td>{formatJD(q.total)}</td>
                    <td><QuotationStatusBadge status={q.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel
        title="Recent Contracts"
        actions={<Link className="tlink" to="/employee/contracts">View all</Link>}
      >
        {contracts.length === 0 ? (
          <EmptyState>No contracts yet.</EmptyState>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link className="tlink" to={`/employee/contracts/${c.id}`}>{c.contract_number}</Link>
                    </td>
                    <td>{c.customer_name}</td>
                    <td>{formatJD(c.total)}</td>
                    <td><ContractStatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
