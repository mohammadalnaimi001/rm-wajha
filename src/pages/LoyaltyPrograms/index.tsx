import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";
import Section from "@/components/ui/Section";
import InfoCard from "@/components/cards/InfoCard";
import StepCard from "@/components/cards/StepCard";
import Reveal from "@/components/ui/Reveal";
import { useLang, type Pair } from "@/context/LanguageContext";

const FEATURES: Pair[] = [
  { en: "QR Loyalty", ar: "ولاء عبر رمز QR" },
  { en: "Reward Points", ar: "نقاط مكافآت" },
  { en: "Membership", ar: "برامج عضوية" },
  { en: "Customer Retention", ar: "أدوات الاحتفاظ بالعملاء" },
  { en: "Referral Program", ar: "نظام إحالات" },
  { en: "Birthday Rewards", ar: "مكافآت أعياد الميلاد" },
  { en: "Coupons", ar: "كوبونات وأكواد خصم" },
  { en: "Business Dashboard", ar: "لوحة صاحب العمل" },
  { en: "Customer Dashboard", ar: "لوحة العميل" },
  { en: "Analytics", ar: "تحليلات" },
  { en: "Multi-branch Support", ar: "دعم الفروع المتعددة" },
  { en: "POS Ready", ar: "جاهز للربط مع الكاشير POS" },
  { en: "WhatsApp Ready", ar: "جاهز للربط مع واتساب" }
];
const BENEFITS = [
  { title: { en: "More repeat visits", ar: "زيارات متكررة أكثر" }, body: { en: "Points and rewards give customers a concrete reason to pick you over the shop next door — again and again.", ar: "النقاط والمكافآت تمنح عملاءك سبباً ملموساً لاختيارك بدلاً من المحل المجاور — مرة بعد مرة." } },
  { title: { en: "A direct channel", ar: "قناة تواصل مباشرة" }, body: { en: "Reach your members on WhatsApp with offers and birthday rewards — no algorithm deciding who sees you.", ar: "تواصل مع أعضائك عبر واتساب بالعروض ومكافآت أعياد الميلاد — دون خوارزمية تقرر من يراك." } },
  { title: { en: "Know your customers", ar: "اعرف عملاءك" }, body: { en: "See visits, redemptions, and your top customers per branch in one dashboard — and act on it.", ar: "شاهد الزيارات والاستبدالات وأفضل عملائك لكل فرع في لوحة واحدة — وابنِ قراراتك عليها." } }
];
const TARGETS: Pair[] = [
  { en: "Restaurants", ar: "مطاعم" }, { en: "Coffee Shops", ar: "كوفي شوبس" }, { en: "Cafes", ar: "مقاهٍ" },
  { en: "Clinics", ar: "عيادات" }, { en: "Barbershops", ar: "صالونات حلاقة" }, { en: "Salons", ar: "صالونات تجميل" },
  { en: "Gyms", ar: "نوادي رياضية" }, { en: "Retail Stores", ar: "متاجر تجزئة" }, { en: "Car Washes", ar: "مغاسل سيارات" },
  { en: "Local Businesses", ar: "أعمال محلية" }
];
const STEPS = [
  { num: "01", title: { en: "Setup", ar: "الإعداد" }, body: { en: "We brand your program, set the rewards logic, and connect your branches and POS.", ar: "نصمم برنامجك بهويتك، ونضبط منطق المكافآت، ونربط فروعك ونظام الكاشير." } },
  { num: "02", title: { en: "Launch", ar: "الإطلاق" }, body: { en: "Customers join in seconds through a QR code or link — no app download required.", ar: "ينضم العملاء خلال ثوانٍ عبر رمز QR أو رابط — دون تحميل تطبيق." } },
  { num: "03", title: { en: "Grow", ar: "النمو" }, body: { en: "Track repeat visits in your dashboard and send offers via WhatsApp to bring people back.", ar: "تابع الزيارات المتكررة في لوحتك وأرسل العروض عبر واتساب لإعادة العملاء." } }
];

export default function LoyaltyPrograms() {
  const { L } = useLang();
  return (
    <ServicePage service={getService("loyalty-programs")}>
      <Section title={{ en: "What's included", ar: "ماذا يشمل الحل" }}>
        <div className="feat-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 0.05}><div className="feat-item">{L(f)}</div></Reveal>
          ))}
        </div>
      </Section>
      <Section title={{ en: "Why it pays off", ar: "لماذا يستحق الاستثمار" }}>
        <div className="why-grid">
          {BENEFITS.map((b, i) => (<InfoCard key={i} title={b.title} body={b.body} delay={i * 0.06} />))}
        </div>
      </Section>
      <Section title={{ en: "Built for", ar: "مصمم من أجل" }}>
        <Reveal>
          <div className="chips-lg">{TARGETS.map((t, i) => (<span key={i} className="chip">{L(t)}</span>))}</div>
        </Reveal>
      </Section>
      <Section title={{ en: "How it works", ar: "كيف يعمل" }}>
        <div className="steps-row three">{STEPS.map((s) => (<StepCard key={s.num} {...s} />))}</div>
      </Section>
    </ServicePage>
  );
}
