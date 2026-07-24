import { useLang, type Pair } from "@/context/LanguageContext";
import Reveal from "@/components/ui/Reveal";

export default function InfoCard({ title, body, delay = 0 }: { title: Pair; body: Pair; delay?: number }) {
  const { L } = useLang();
  return (
    <Reveal delay={delay}>
      <article className="card why-card" style={{ height: "100%" }}>
        <h3>{L(title)}</h3>
        <p>{L(body)}</p>
      </article>
    </Reveal>
  );
}
