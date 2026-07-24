import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import type { Service } from "@/lib/services";
import { waLink } from "@/utils/wa";
import PageHero from "./PageHero";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

/** Shared template for all service pages. Extra sections go in `children`. */
export default function ServicePage({ service, children }: { service: Service; children?: ReactNode }) {
  const { L } = useLang();
  useSEO(
    { en: `${service.name.en} — Nexora Agency`, ar: `${service.name.ar} — نكسورا` },
    service.sub
  );
  return (
    <>
      <PageHero
        eyebrow={service.name}
        title={service.h1}
        sub={service.sub}
        trail={[{ to: "/services", label: { en: "Services", ar: "الخدمات" } }]}
      >
        <div className="hero-ctas" style={{ justifyContent: "flex-start" }}>
          <Link className="btn btn-primary arr" to="/contact">
            <span>{L({ en: "Start a Project", ar: "ابدأ مشروعك" })}</span>
          </Link>
          <a
            className="btn btn-ghost"
            href={waLink(L({ en: `Hi Nexora 👋 I'm interested in ${service.name.en}.`, ar: `مرحباً نكسورا 👋 مهتم بخدمة ${service.name.ar}.` }))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{L({ en: "Book a Strategy Call", ar: "احجز مكالمة استراتيجية" })}</span>
          </a>
        </div>
      </PageHero>

      <Section title={{ en: "Overview", ar: "نظرة عامة" }}>
        <Reveal>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: "64ch" }}>{L(service.overview)}</p>
        </Reveal>
      </Section>

      {service.chips.length > 0 && (
        <Section title={{ en: "What we deliver", ar: "ماذا نقدّم" }}>
          <Reveal>
            <div className="chips-lg">
              {service.chips.map((c, i) => (
                <span key={i} className="chip">{L(c)}</span>
              ))}
            </div>
          </Reveal>
        </Section>
      )}

      {children}
    </>
  );
}
