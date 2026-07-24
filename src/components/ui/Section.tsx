import type { ReactNode } from "react";
import { useLang, type Pair } from "@/context/LanguageContext";
import Reveal from "./Reveal";

interface Props {
  eyebrow?: Pair;
  title: Pair;
  lead?: Pair;
  center?: boolean;
  children?: ReactNode;
  id?: string;
}

export default function Section({ eyebrow, title, lead, center, children, id }: Props) {
  const { L } = useLang();
  return (
    <section className="sec cv" id={id}>
      <div className="container">
        <Reveal className={`sec-head${center ? " center" : ""}`}>
          {eyebrow && <span className="eyebrow">{L(eyebrow)}</span>}
          <h2>{L(title)}</h2>
          {lead && <p>{L(lead)}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
