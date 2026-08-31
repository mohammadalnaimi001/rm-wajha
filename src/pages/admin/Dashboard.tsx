import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listEmployees } from "@/features/employees/api";
import { listQuotations } from "@/features/quotations/api";
import { listContracts } from "@/features/contracts/api";
import { getAllEmployeePerformance, type EmployeePerformanceRow } from "@/features/performance/api";
import { StatCard, Loading, Panel, EmptyState, formatJD } from "@/features/dashboard/components";
import type { Contract, Quotation } from "@/types/db";

function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

export default function AdminDashboard() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [performance, setPerformance] = useState<EmployeePerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [employees, allQuotations, allContracts, perf] = await Promise.all([
          listEmployees(),
          listQuotations(),
          listContracts(),
          getAllEmployeePerformance(currentMonthKey())
        ]);
        if (!active) return;
        setEmployeeCount(employees.length);
        setActiveCount(employees.filter((e) => e.active).length);
        setQuotations(allQuotations);
        setContracts(allContracts);
        setPerformance(perf.sort((a, b) => b.monthly_sales - a.monthly_sales));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="dash-error">{error}</div>;

  const totalSales = contracts
    .filter((c) => c.status === "CONFIRMED" || c.status === "PAID")
    .reduce((sum, c) => sum + Number(c.total), 0);

  const monthStart = `${currentMonthKey()}-01`;
  const monthSales = contracts
    .filter((c) => (c.status === "CONFIRMED" || c.status === "PAID") && c.created_at >= monthStart)
    .reduce((sum, c) => sum + Number(c.total), 0);

  return (
    <div>
      <div className="dash-stats">
        <StatCard label="Total Employees" value={String(employeeCount)} />
        <StatCard label="Active Employees" value={String(activeCount)} />
        <StatCard label="Total Quotations" value={String(quotations.length)} />
        <StatCard label="Total Contracts" value={String(contracts.length)} />
      </div>
      <div className="dash-stats">
        <StatCard label="Total Sales" value={formatJD(totalSales)} hint="Confirmed + Paid" />
        <StatCard label="This Month Sales" value={formatJD(monthSales)} />
      </div>

      <Panel title="Top Performers" actions={<Link className="tlink" to="/admin/performance">View all</Link>}>
        {performance.length === 0 ? (
          <EmptyState>No employees yet.</EmptyState>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contracts</th>
                  <th>Sales</th>
                  <th>Target</th>
                  <th>Achievement</th>
                </tr>
              </thead>
              <tbody>
                {performance.slice(0, 10).map((p) => (
                  <tr key={p.employee_id}>
                    <td>
                      <Link className="tlink" to={`/admin/employees/${p.employee_id}`}>
                        {p.full_name}
                      </Link>
                    </td>
                    <td>{p.total_contracts}</td>
                    <td>{formatJD(p.monthly_sales)}</td>
                    <td>{formatJD(p.monthly_target)}</td>
                    <td>{p.achievement_pct}%</td>
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
