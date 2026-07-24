import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { servicePath, type Service } from "@/lib/services";
import ServiceIcon from "./ServiceIcon";
import Reveal from "@/components/ui/Reveal";

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { L } = useLang();
  return (
    <Reveal delay={(index % 3) * 0.06}>
      <article className="card sv-card" style={{ height: "100%" }}>
        <span className="sv-num">{String(index + 1).padStart(2, "0")}</span>
        <div className="sv-ic"><ServiceIcon slug={service.slug} /></div>
        <h3>{L(service.name)}</h3>
        <p>{L(service.cardDesc)}</p>
        <Link className="tlink arr" to={servicePath(service)}>
          {L({ en: "Explore", ar: "استكشف" })}
        </Link>
      </article>
    </Reveal>
  );
}
