import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllEmployeePerformance, type EmployeePerformanceRow } from "@/features/performance/api";
import { Loading, Panel, EmptyState, formatJD } from "@/features/dashboard/components";

function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

function monthOptions(): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < 12; i++) {
    out.push({ key: d.toISOString().slice(0, 7), label: d.toLocaleDateString(undefined, { month: "long", year: "numeric" }) });
    d.setMonth(d.getMonth() - 1);
  }
  return out;
}

export default function AdminPerformance() {
  const [month, setMonth] = useState(currentMonthKey());
  const [rows, setRows] = useState<EmployeePerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllEmployeePerformance(month)
      .then((data) => {
        if (active) setRows(data.sort((a, b) => b.monthly_sales - a.monthly_sales));
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "Failed to load performance");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [month]);

  const maxSales = Math.max(1, ...rows.map((r) => r.monthly_sales));

  return (
    <div>
      <Panel>
        <div className="dash-filters">
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {monthOptions().map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      {error && <div className="dash-error">{error}</div>}

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Panel>
          <EmptyState>No employees yet.</EmptyState>
        </Panel>
      ) : (
        <>
          <Panel title="Monthly Sales Comparison">
            <div className="dash-bars">
              {rows.map((r) => (
                <div className="dash-bar-col" key={r.employee_id}>
                  <div className="dash-bar" style={{ height: `${(r.monthly_sales / maxSales) * 100}%` }} />
                  <span>{r.full_name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Ranking">
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Contracts</th>
                    <th>Sales</th>
                    <th>Target</th>
                    <th>Achievement</th>
                    <th>Avg Deal</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.employee_id}>
                      <td>#{i + 1}</td>
                      <td>
                        <Link className="tlink" to={`/admin/employees/${r.employee_id}`}>
                          {r.full_name}
                        </Link>
                      </td>
                      <td>{r.total_contracts}</td>
                      <td>{formatJD(r.monthly_sales)}</td>
                      <td>{formatJD(r.monthly_target)}</td>
                      <td>{r.achievement_pct}%</td>
                      <td>{formatJD(r.average_contract_value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
