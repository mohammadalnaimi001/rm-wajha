import type { ReactNode } from "react";
import { useLang, type Pair } from "@/context/LanguageContext";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

interface Props {
  eyebrow: Pair;
  title: Pair;
  sub: Pair;
  trail?: { to: string; label: Pair }[];
  crumbLabel?: Pair;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, sub, trail, crumbLabel, children }: Props) {
  const { L } = useLang();
  return (
    <section className="page-hero">
      <div className="container">
        <Breadcrumbs trail={trail} current={crumbLabel ?? eyebrow} />
        <span className="eyebrow">{L(eyebrow)}</span>
        <h1>{L(title)}</h1>
        <p className="hero-sub">{L(sub)}</p>
        {children}
      </div>
    </section>
  );
}
