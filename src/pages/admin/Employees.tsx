import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { listEmployees, createEmployee, setEmployeeActive } from "@/features/employees/api";
import { Loading, Panel, EmptyState } from "@/features/dashboard/components";
import type { Profile } from "@/types/db";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setEmployees(await listEmployees());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await createEmployee({ full_name: fullName, email, phone, password });
      setSuccess(`Employee ${fullName} created. Share their email/password with them to sign in.`);
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create employee");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(emp: Profile) {
    setError(null);
    try {
      await setEmployeeActive(emp.id, !emp.active);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update employee");
    }
  }

  return (
    <div>
      {error && <div className="dash-error">{error}</div>}
      {success && <div className="dash-success">{success}</div>}

      <Panel
        title="Employees"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "Add Employee"}
          </button>
        }
      >
        {showForm && (
          <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
            <div className="dash-form-row">
              <div className="dash-field">
                <label htmlFor="fullName">Full Name *</label>
                <input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="dash-field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="dash-form-row">
              <div className="dash-field">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="dash-field">
                <label htmlFor="password">Temporary Password *</label>
                <input
                  id="password"
                  type="text"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Share this with the employee"
                />
              </div>
            </div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create Employee"}
            </button>
          </form>
        )}

        {loading ? (
          <Loading />
        ) : employees.length === 0 ? (
          <EmptyState>No employees yet.</EmptyState>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <Link className="tlink" to={`/admin/employees/${emp.id}`}>
                        {emp.full_name}
                      </Link>
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.phone ?? "—"}</td>
                    <td>
                      <span className={`dash-badge ${emp.active ? "ok" : "bad"}`}>
                        {emp.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(emp)}>
                        {emp.active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
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
