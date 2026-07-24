import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { waLink } from "@/utils/wa";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";
import Reveal from "@/components/ui/Reveal";

export default function CTA() {
  const { L } = useLang();
  return (
    <section className="sec cv">
      <div className="container">
        <Reveal>
          <div className="cta-band">
            <h2>{L({ en: "Let's engineer your growth.", ar: "لنهندس نموك." })}</h2>
            <p>{L({ en: "Book a free 30-minute strategy call. Zero pressure — even if we're not a fit, you'll leave with a clear roadmap.", ar: "احجز مكالمة استراتيجية مجانية لمدة 30 دقيقة. دون أي ضغط — حتى لو لم نكن الأنسب، ستخرج بخارطة طريق واضحة." })}</p>
            <div className="btns">
              <a className="btn btn-primary" href={waLink(L({ en: "Hi Nexora 👋 I'd like to book a strategy call.", ar: "مرحباً نكسورا 👋 أود حجز مكالمة استراتيجية." }))} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                <span>{L({ en: "Book a Strategy Call", ar: "احجز مكالمة استراتيجية" })}</span>
              </a>
              <Link className="btn btn-ghost arr" to="/contact">
                <span>{L({ en: "Send Project Details", ar: "أرسل تفاصيل مشروعك" })}</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
