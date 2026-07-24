import { Link } from "react-router-dom";
import { useLang, type Pair } from "@/context/LanguageContext";

export default function Breadcrumbs({ trail, current }: { trail?: { to: string; label: Pair }[]; current: Pair }) {
  const { L } = useLang();
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link to="/">{L({ en: "Home", ar: "الرئيسية" })}</Link>
      {(trail ?? []).map((t) => (
        <span key={t.to}><i>/</i> <Link to={t.to}>{L(t.label)}</Link></span>
      ))}
      <i>/</i> <b aria-current="page">{L(current)}</b>
    </nav>
  );
}
