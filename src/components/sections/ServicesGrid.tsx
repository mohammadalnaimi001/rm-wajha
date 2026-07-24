import { SERVICES } from "@/lib/services";
import ServiceCard from "@/components/cards/ServiceCard";

export default function ServicesGrid() {
  return (
    <div className="sv-grid">
      {SERVICES.map((s, i) => (
        <ServiceCard key={s.slug} service={s} index={i} />
      ))}
    </div>
  );
}
