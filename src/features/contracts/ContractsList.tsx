import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listContracts } from "./api";
import { listEmployees } from "@/features/employees/api";
import { Loading, Panel, EmptyState, ContractStatusBadge, formatJD } from "@/features/dashboard/components";
import type { Contract, ContractStatus, Profile } from "@/types/db";

const STATUSES: ContractStatus[] = ["PENDING", "CONFIRMED", "PAID", "CANCELLED"];

export default function ContractsList({
  basePath,
  employeeId,
  showEmployeeFilter
}: {
  basePath: "employee" | "admin";
  employeeId?: string;
  showEmployeeFilter?: boolean;
}) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContractStatus | "">("");
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
    listContracts({
      employeeId: employeeId ?? employeeFilter ?? undefined,
      status: status || undefined,
      search: search || undefined
    })
      .then((data) => {
        if (active) setContracts(data);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "Failed to load contracts");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [employeeId, employeeFilter, status, search]);

  const totalValue = contracts.reduce((sum, c) => sum + Number(c.total), 0);

  return (
    <Panel>
      <div className="dash-filters">
        <input placeholder="Search customer…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value as ContractStatus | "")}>
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
      ) : contracts.length === 0 ? (
        <EmptyState>No contracts found.</EmptyState>
      ) : (
        <>
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
                {contracts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link className="tlink" to={`/${basePath}/contracts/${c.id}`}>
                        {c.contract_number}
                      </Link>
                    </td>
                    <td>{c.customer_name}</td>
                    <td>{formatJD(Number(c.total))}</td>
                    <td>
                      <ContractStatusBadge status={c.status} />
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 16, color: "var(--muted)", fontSize: ".88rem" }}>
            {contracts.length} contract(s) · Total value {formatJD(totalValue)}
          </p>
        </>
      )}
    </Panel>
  );
}
