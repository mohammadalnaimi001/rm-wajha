import { useLang, type Pair } from "@/context/LanguageContext";

export default function Faq({ items }: { items: { q: Pair; a: Pair }[] }) {
  const { L } = useLang();
  return (
    <div className="faq">
      {items.map((it, i) => (
        <details key={i}>
          <summary>{L(it.q)}</summary>
          <p>{L(it.a)}</p>
        </details>
      ))}
    </div>
  );
}
