import { useEffect, useState, type FormEvent } from "react";
import { listServices, createService, updateService } from "@/features/services/api";
import { Loading, Panel, EmptyState } from "@/features/dashboard/components";
import type { Service, ServiceCategory } from "@/types/db";

const CATEGORIES: ServiceCategory[] = [
  "Website",
  "Booking",
  "Digital Identity",
  "Analytics",
  "SEO",
  "AI",
  "Automation",
  "Mobile",
  "Other"
];

export default function AdminSettings() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Website");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  async function refresh() {
    setLoading(true);
    try {
      setServices(await listServices());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load services");
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
    try {
      await createService({ name, category, description, price });
      setName("");
      setDescription("");
      setPrice(0);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePriceChange(service: Service, newPrice: number) {
    setError(null);
    try {
      await updateService(service.id, { price: newPrice });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update price");
    }
  }

  async function handleToggleActive(service: Service) {
    setError(null);
    try {
      await updateService(service.id, { active: !service.active });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update service");
    }
  }

  return (
    <div>
      {error && <div className="dash-error">{error}</div>}

      <Panel
        title="Services"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "Add Service"}
          </button>
        }
      >
        <p style={{ color: "var(--muted)", fontSize: ".88rem", marginBottom: 20 }}>
          Changing a price here only affects new quotations. Existing quotations and contracts keep the price
          that was in effect when they were created.
        </p>

        {showForm && (
          <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
            <div className="dash-form-row">
              <div className="dash-field">
                <label htmlFor="name">Name *</label>
                <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="dash-field">
                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="dash-form-row">
              <div className="dash-field">
                <label htmlFor="price">Price (JD) *</label>
                <input
                  id="price"
                  type="number"
                  required
                  min={0}
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                />
              </div>
              <div className="dash-field">
                <label htmlFor="description">Description</label>
                <input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Create Service"}
            </button>
          </form>
        )}

        {loading ? (
          <Loading />
        ) : services.length === 0 ? (
          <EmptyState>No services yet.</EmptyState>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.category}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        defaultValue={s.price}
                        style={{ maxWidth: 110 }}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (!Number.isNaN(val) && val !== Number(s.price)) handlePriceChange(s, val);
                        }}
                      />
                    </td>
                    <td>
                      <span className={`dash-badge ${s.active ? "ok" : "bad"}`}>{s.active ? "Active" : "Inactive"}</span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleToggleActive(s)}>
                        {s.active ? "Deactivate" : "Activate"}
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
