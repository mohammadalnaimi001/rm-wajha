import { Link, NavLink } from "react-router-dom";
import { useLang, type Pair } from "@/context/LanguageContext";

interface Props {
  links: { to: string; label: Pair }[];
  onNavigate: () => void;
}

export default function MobileMenu({ links, onNavigate }: Props) {
  const { L } = useLang();
  return (
    <div className="mobile-menu" id="mobileMenu">
      <NavLink to="/" onClick={onNavigate} style={{ transitionDelay: ".05s" }}>
        {L({ en: "Home", ar: "الرئيسية" })}
      </NavLink>
      {links.map((l, i) => (
        <NavLink key={l.to} to={l.to} onClick={onNavigate} style={{ transitionDelay: `${0.1 + i * 0.05}s` }}>
          {L(l.label)}
        </NavLink>
      ))}
      <Link className="btn btn-primary" to="/contact" onClick={onNavigate}>
        <span>{L({ en: "Start a Project", ar: "ابدأ مشروعك" })}</span>
      </Link>
    </div>
  );
}
