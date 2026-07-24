import { type FormEvent, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { CONFIG } from "@/lib/config";
import { waLink } from "@/utils/wa";
import Reveal from "@/components/ui/Reveal";

const SERVICES_OPTS = [
  { en: "Web Development", ar: "تطوير المواقع" },
  { en: "Mobile Apps", ar: "تطبيقات الجوال" },
  { en: "SaaS Development", ar: "تطوير SaaS" },
  { en: "AI Solutions", ar: "حلول الذكاء الاصطناعي" },
  { en: "Business Automation", ar: "أتمتة الأعمال" },
  { en: "Digital Marketing", ar: "التسويق الرقمي" },
  { en: "Branding & Design", ar: "الهوية والتصميم" },
  { en: "Business Intelligence", ar: "ذكاء الأعمال" },
  { en: "Loyalty Programs", ar: "برامج الولاء" },
  { en: "Not sure yet", ar: "لست متأكداً بعد" }
];
const BUDGETS = ["< $3,000", "$3,000 – $10,000", "$10,000 – $25,000", "$25,000+"];

export default function ContactBlock() {
  const { L } = useLang();
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const lines = [
      L({ en: "Hi Nexora 👋 New project inquiry:", ar: "مرحباً نكسورا 👋 استفسار مشروع جديد:" }),
      `${L({ en: "Name", ar: "الاسم" })}: ${v("name")}`,
      `${L({ en: "Email", ar: "البريد" })}: ${v("email")}`
    ];
    if (v("company")) lines.push(`${L({ en: "Company", ar: "الشركة" })}: ${v("company")}`);
    if (v("service")) lines.push(`${L({ en: "Service", ar: "الخدمة" })}: ${v("service")}`);
    if (v("budget")) lines.push(`${L({ en: "Budget", ar: "الميزانية" })}: ${v("budget")}`);
    lines.push(`${L({ en: "Details", ar: "التفاصيل" })}: ${v("message")}`);
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="ct-grid">
      <Reveal className="ct-info">
        <div>
          <div className="ct-item">
            <span className="ct-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 7L22 7" /></svg></span>
            <div><em>{L({ en: "Email", ar: "البريد الإلكتروني" })}</em><b><a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></b></div>
          </div>
          <div className="ct-item">
            <span className="ct-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6a13 13 0 0 1-5-4.4c-.5-.8-.9-1.7-.9-2.7 0-1 .5-1.5.8-1.8.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.1.3.6 1 1.4 1.7.9.8 1.7 1.1 2 1.2.3.1.5.1.7-.1l.6-.7c.2-.3.4-.3.7-.2l2 1c.3.2.5.2.6.4.1.1.1.5-.1.8Z" /></svg></span>
            <div><em>WhatsApp</em><b><a href={waLink(L({ en: "Hi Nexora 👋 I'd like to talk about a project.", ar: "مرحباً نكسورا 👋 أود التحدث عن مشروع." }))} target="_blank" rel="noopener noreferrer" dir="ltr">+962 77 906 0506</a></b></div>
          </div>
          <div className="ct-item">
            <span className="ct-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></span>
            <div><em>{L({ en: "Headquarters", ar: "المقر الرئيسي" })}</em><b>{L({ en: "Amman, Jordan — serving clients worldwide", ar: "عمّان، الأردن — نخدم عملاء حول العالم" })}</b></div>
          </div>
          <div className="ct-item">
            <span className="ct-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg></span>
            <div><em>{L({ en: "Response time", ar: "زمن الاستجابة" })}</em><b>{L({ en: "Under 24 hours", ar: "أقل من 24 ساعة" })}</b></div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <form className="ct-form" onSubmit={submit} noValidate>
          <div className="f-row">
            <div className="f-group">
              <label htmlFor="fName">{L({ en: "Full name", ar: "الاسم الكامل" })} <i>*</i></label>
              <input id="fName" name="name" type="text" required autoComplete="name" placeholder={L({ en: "Alex Haddad", ar: "مثال: أحمد حداد" })} />
            </div>
            <div className="f-group">
              <label htmlFor="fEmail">{L({ en: "Work email", ar: "البريد الإلكتروني" })} <i>*</i></label>
              <input id="fEmail" name="email" type="email" required autoComplete="email" placeholder="name@company.com" />
            </div>
          </div>
          <div className="f-group">
            <label htmlFor="fCompany">{L({ en: "Company (optional)", ar: "الشركة (اختياري)" })}</label>
            <input id="fCompany" name="company" type="text" autoComplete="organization" placeholder={L({ en: "Company name", ar: "اسم الشركة" })} />
          </div>
          <div className="f-row">
            <div className="f-group">
              <label htmlFor="fService">{L({ en: "Service", ar: "الخدمة" })} <i>*</i></label>
              <select id="fService" name="service" required defaultValue="">
                <option value="" disabled>{L({ en: "Select a service…", ar: "اختر خدمة…" })}</option>
                {SERVICES_OPTS.map((o, i) => (
                  <option key={i} value={L(o)}>{L(o)}</option>
                ))}
              </select>
            </div>
            <div className="f-group">
              <label htmlFor="fBudget">{L({ en: "Budget range", ar: "نطاق الميزانية" })}</label>
              <select id="fBudget" name="budget" defaultValue="">
                <option value="">{L({ en: "Select a range…", ar: "اختر نطاقاً…" })}</option>
                {BUDGETS.map((b) => (<option key={b} value={b}>{b}</option>))}
              </select>
            </div>
          </div>
          <div className="f-group">
            <label htmlFor="fMsg">{L({ en: "Project details", ar: "تفاصيل المشروع" })} <i>*</i></label>
            <textarea id="fMsg" name="message" required placeholder={L({ en: "Tell us about your project, goals, and timeline…", ar: "حدثنا عن مشروعك وأهدافك وجدولك الزمني…" })} />
          </div>
          <button className="btn btn-primary" type="submit">
            <span>{sent ? L({ en: "Opening WhatsApp… ✓", ar: "جارٍ فتح واتساب… ✓" }) : L({ en: "Send via WhatsApp", ar: "أرسل عبر واتساب" })}</span>
          </button>
          <p className="ct-alt">{L({ en: "Prefer email?", ar: "تفضّل البريد؟" })} <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></p>
        </form>
      </Reveal>
    </div>
  );
}
