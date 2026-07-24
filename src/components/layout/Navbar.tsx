import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import MobileMenu from "./MobileMenu";

const LINKS = [
  { to: "/services", label: { en: "Services", ar: "الخدمات" } },
  { to: "/about", label: { en: "About", ar: "من نحن" } },
  { to: "/contact", label: { en: "Contact", ar: "تواصل" } }
];

export default function Navbar() {
  const { L, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`} id="siteNav">
      <div className="container nav-inner">
        <Link className="logo" to="/" aria-label="Nexora Agency — home" onClick={() => setOpen(false)}>
          <img className="logo-img" src="/logo.svg" alt="Nexora Agency" />
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {L(l.label)}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="lang-toggle" onClick={toggle} aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}>
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <Link className="btn btn-primary btn-sm" to="/contact">
            <span>{L({ en: "Start a Project", ar: "ابدأ مشروعك" })}</span>
          </Link>
          <button
            className="menu-btn"
            aria-label={L(open ? { en: "Close menu", ar: "أغلق القائمة" } : { en: "Open menu", ar: "افتح القائمة" })}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <MobileMenu links={LINKS} onNavigate={() => setOpen(false)} />
    </header>
  );
}
