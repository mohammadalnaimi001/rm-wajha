import { useLang, type Pair } from "@/context/LanguageContext";
import Reveal from "@/components/ui/Reveal";

export default function StepCard({ num, title, body }: { num: string; title: Pair; body: Pair }) {
  const { L } = useLang();
  return (
    <Reveal>
      <div className="step-card" style={{ height: "100%" }}>
        <b>{num}</b>
        <h3>{L(title)}</h3>
        <p>{L(body)}</p>
      </div>
    </Reveal>
  );
}
