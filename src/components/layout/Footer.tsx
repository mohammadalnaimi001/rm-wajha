import { type FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { SERVICES, servicePath } from "@/lib/services";
import { CONFIG } from "@/lib/config";
import { waLink } from "@/utils/wa";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

export default function Footer() {
  const { L, lang } = useLang();
  const emailRef = useRef<HTMLInputElement>(null);
  const [sent, setSent] = useState(false);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    const em = emailRef.current;
    if (!em || !em.reportValidity()) return;
    const subj = lang === "ar" ? "اشتراك في النشرة البريدية" : "Newsletter subscription";
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(em.value)}`;
    em.value = "";
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <footer>
      <div className="container">
        <div className="ft-grid">
          <div className="ft-brand">
            <Link className="logo" to="/" aria-label="Nexora Agency — home">
              <img className="logo-img" src="/logo.svg" alt="Nexora Agency" />
            </Link>
            <p>{L({ en: "Full-service digital agency engineering growth through design, code, and AI.", ar: "وكالة رقمية متكاملة تهندس النمو عبر التصميم والبرمجة والذكاء الاصطناعي." })}</p>
            <div className="ct-socials">
              <a className="soc" href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" /></svg>
              </a>
              <a className="soc" href={CONFIG.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.2 8h4.6v14.8H.2Zm7.6 0h4.4v2h.1c.6-1.2 2.1-2.4 4.4-2.4 4.7 0 5.5 3.1 5.5 7.1v8.1h-4.6v-7.2c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8v7.3H7.8Z" /></svg>
              </a>
              <a className="soc" href={waLink(L({ en: "Hi Nexora 👋 I'd like to talk about a project.", ar: "مرحباً نكسورا 👋 أود التحدث عن مشروع." }))} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon className="" />
              </a>
            </div>
          </div>
          <div className="ft-col">
            <h4>{L({ en: "Services", ar: "الخدمات" })}</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}><Link to={servicePath(s)}>{L(s.name)}</Link></li>
              ))}
            </ul>
          </div>
          <div className="ft-col">
            <h4>{L({ en: "Company", ar: "الشركة" })}</h4>
            <ul>
              <li><Link to="/">{L({ en: "Home", ar: "الرئيسية" })}</Link></li>
              <li><Link to="/about">{L({ en: "About", ar: "من نحن" })}</Link></li>
              <li><Link to="/services">{L({ en: "Services", ar: "الخدمات" })}</Link></li>
              <li><Link to="/contact">{L({ en: "Contact", ar: "تواصل" })}</Link></li>
            </ul>
          </div>
          <div className="ft-col ft-nl">
            <h4>{L({ en: "Newsletter", ar: "النشرة البريدية" })}</h4>
            <p>{L({ en: "Monthly insights on design, AI & growth. No spam, ever.", ar: "رؤى شهرية في التصميم والذكاء الاصطناعي والنمو. بلا إزعاج، أبداً." })}</p>
            <form className="nl-form" onSubmit={subscribe} noValidate>
              <label className="skip" htmlFor="nlEmail">{L({ en: "Email address", ar: "البريد الإلكتروني" })}</label>
              <input
                ref={emailRef}
                type="email"
                id="nlEmail"
                required
                placeholder={sent ? L({ en: "Opening your email app…", ar: "جارٍ فتح تطبيق البريد…" }) : "you@company.com"}
              />
              <button className="nl-btn" type="submit" aria-label={L({ en: "Subscribe", ar: "اشترك" })}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </form>
          </div>
        </div>
        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} Nexora Agency. {L({ en: "All rights reserved.", ar: "جميع الحقوق محفوظة." })}</span>
        </div>
      </div>
    </footer>
  );
}
