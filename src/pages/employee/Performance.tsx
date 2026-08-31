import { useEffect, useState } from "react";
import { getMyPerformance } from "@/features/performance/api";
import { StatCard, Loading, Panel, formatJD } from "@/features/dashboard/components";
import type { MyPerformance } from "@/types/db";

function monthLabel(offset: number): { key: string; label: string } {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - offset);
  return {
    key: d.toISOString().slice(0, 7),
    label: d.toLocaleDateString(undefined, { month: "short" })
  };
}

export default function EmployeePerformance() {
  const [current, setCurrent] = useState<MyPerformance | null>(null);
  const [history, setHistory] = useState<{ label: string; sales: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const months = [5, 4, 3, 2, 1, 0].map(monthLabel);
        const results = await Promise.all(months.map((m) => getMyPerformance(`${m.key}-01`)));
        if (!active) return;
        setCurrent(results[results.length - 1]);
        setHistory(months.map((m, i) => ({ label: m.label, sales: results[i]?.monthly_sales ?? 0 })));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load performance");
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
  if (!current) return <Panel>No performance data yet.</Panel>;

  const maxSales = Math.max(1, ...history.map((h) => h.sales));

  return (
    <div>
      <div className="dash-stats">
        <StatCard label="Total Contracts" value={String(current.total_contracts)} />
        <StatCard label="Confirmed" value={String(current.confirmed_contracts)} />
        <StatCard label="Paid" value={String(current.paid_contracts)} />
        <StatCard label="Cancelled" value={String(current.cancelled_contracts)} />
      </div>
      <div className="dash-stats">
        <StatCard label="Total Sales" value={formatJD(current.total_sales)} />
        <StatCard label="This Week" value={formatJD(current.weekly_sales)} />
        <StatCard label="Avg Contract Value" value={formatJD(current.average_contract_value)} />
        <StatCard label="Ranking" value={`#${current.rank}`} hint={`of ${current.headcount} employees`} />
      </div>

      <Panel title="Monthly Target Achievement">
        <p style={{ marginBottom: 10, color: "var(--muted)" }}>
          {formatJD(current.monthly_sales)} of {formatJD(current.monthly_target)} target
        </p>
        <div className="dash-progress">
          <i style={{ width: `${Math.min(100, current.achievement_pct)}%` }} />
        </div>
        <p style={{ marginTop: 10, fontFamily: "var(--font-display)", fontWeight: 800 }}>
          {current.achievement_pct}%
        </p>
      </Panel>

      <Panel title="Sales — Last 6 Months">
        <div className="dash-bars">
          {history.map((h) => (
            <div className="dash-bar-col" key={h.label}>
              <div className="dash-bar" style={{ height: `${(h.sales / maxSales) * 100}%` }} />
              <span>{h.label}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
