import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listQuotations } from "./api";
import { listEmployees } from "@/features/employees/api";
import { Loading, Panel, EmptyState, QuotationStatusBadge, formatJD } from "@/features/dashboard/components";
import type { Profile, Quotation, QuotationStatus } from "@/types/db";

const STATUSES: QuotationStatus[] = ["DRAFT", "SENT", "APPROVED", "REJECTED", "EXPIRED"];

export default function QuotationsList({
  basePath,
  employeeId,
  showEmployeeFilter
}: {
  basePath: "employee" | "admin";
  employeeId?: string;
  showEmployeeFilter?: boolean;
}) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<QuotationStatus | "">("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  useEffect(() => {
    if (showEmployeeFilter) {
      listEmployees()
        .then(setEmployees)
        .catch(() => undefined);
    }
  }, [showEmployeeFilter]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listQuotations({
      employeeId: employeeId ?? employeeFilter ?? undefined,
      status: status || undefined,
      search: search || undefined
    })
      .then((data) => {
        if (active) setQuotations(data);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "Failed to load quotations");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [employeeId, employeeFilter, status, search]);

  return (
    <Panel>
      <div className="dash-filters">
        <input placeholder="Search customer…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value as QuotationStatus | "")}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {showEmployeeFilter && (
          <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}>
            <option value="">All employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <div className="dash-error">{error}</div>}

      {loading ? (
        <Loading />
      ) : quotations.length === 0 ? (
        <EmptyState>No quotations found.</EmptyState>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id}>
                  <td>
                    <Link className="tlink" to={`/${basePath}/quotations/${q.id}`}>
                      {q.quotation_number}
                    </Link>
                  </td>
                  <td>{q.customer_name}</td>
                  <td>{formatJD(Number(q.total))}</td>
                  <td>
                    <QuotationStatusBadge status={q.status} />
                  </td>
                  <td>{new Date(q.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
