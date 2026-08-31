import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { listServices } from "@/features/services/api";
import { createQuotation } from "@/features/quotations/api";
import { Loading, Panel, formatJD } from "@/features/dashboard/components";
import type { Service } from "@/types/db";

export default function CreateQuotation() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await listServices({ onlyActive: true });
        if (active) setServices(data);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load services");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const selectedServices = useMemo(() => services.filter((s) => selected[s.id]), [services, selected]);
  const subtotal = useMemo(() => selectedServices.reduce((sum, s) => sum + Number(s.price), 0), [selectedServices]);
  const total = Math.max(0, subtotal - discount);

  function toggle(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    if (selectedServices.length === 0) {
      setError("Select at least one service.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const quotation = await createQuotation({
        employee_id: profile.id,
        customer_name: customerName,
        company_name: companyName,
        phone,
        email,
        instagram,
        discount,
        notes,
        items: selectedServices.map((s) => ({ service_id: s.id, service_name: s.name, price: Number(s.price) }))
      });
      navigate(`/employee/quotations/${quotation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quotation");
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="dash-error">{error}</div>}

      <Panel title="Customer">
        <div className="dash-form-row">
          <div className="dash-field">
            <label htmlFor="customerName">Customer Name *</label>
            <input id="customerName" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div className="dash-field">
            <label htmlFor="companyName">Company Name</label>
            <input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
        </div>
        <div className="dash-form-row">
          <div className="dash-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="dash-field">
            <label htmlFor="cEmail">Email</label>
            <input id="cEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="dash-field">
          <label htmlFor="instagram">Instagram</label>
          <input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle" />
        </div>
      </Panel>

      <Panel title="Services">
        {services.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No active services configured yet. Ask an admin to add services in Settings.</p>
        ) : (
          <div className="dash-svc-grid">
            {services.map((s) => {
              const isSelected = !!selected[s.id];
              return (
                <button
                  type="button"
                  key={s.id}
                  className={`dash-svc${isSelected ? " selected" : ""}`}
                  onClick={() => toggle(s.id)}
                  aria-pressed={isSelected}
                >
                  <span className="dash-svc-check">{isSelected ? "✓" : ""}</span>
                  <h4>{s.name}</h4>
                  {s.description && <p>{s.description}</p>}
                  <b>{formatJD(Number(s.price))}</b>
                </button>
              );
            })}
          </div>
        )}

        <div className="dash-form-row">
          <div className="dash-field">
            <label htmlFor="discount">Discount (JD)</label>
            <input
              id="discount"
              type="number"
              min={0}
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            />
          </div>
          <div className="dash-field">
            <label htmlFor="notes">Notes</label>
            <input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="dash-total-bar">
          <div>
            <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>Subtotal {formatJD(subtotal)} · Discount {formatJD(discount)}</div>
            <b>Total: {formatJD(total)}</b>
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save Quotation"}
          </button>
        </div>
      </Panel>
    </form>
  );
}
