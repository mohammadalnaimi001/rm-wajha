import ServicePage from "@/components/sections/ServicePage";
import { getService } from "@/lib/services";
import Section from "@/components/ui/Section";
import InfoCard from "@/components/cards/InfoCard";
import StepCard from "@/components/cards/StepCard";
import Faq from "@/components/shared/Faq";
import Reveal from "@/components/ui/Reveal";

const BENEFITS = [
  { title: { en: "Fast by default", ar: "سريع افتراضياً" }, body: { en: "Green Core Web Vitals and 90+ Lighthouse scores are our baseline, not a stretch goal.", ar: "مؤشرات Core Web Vitals خضراء ونتائج Lighthouse فوق 90 هي خط الأساس لدينا، لا هدفاً بعيداً." } },
  { title: { en: "SEO-ready structure", ar: "بنية جاهزة لمحركات البحث" }, body: { en: "Semantic HTML, clean architecture, and metadata done right — so you can rank from day one.", ar: "HTML دلالي وبنية نظيفة وبيانات وصفية صحيحة — لتتمكن من التصدر من اليوم الأول." } },
  { title: { en: "Yours to edit", ar: "ملكك وتحرره بنفسك" }, body: { en: "A CMS your team can use: update pages, prices, and content without calling a developer.", ar: "نظام إدارة محتوى يستخدمه فريقك: حدّث الصفحات والأسعار والمحتوى دون الحاجة لمطوّر." } }
];
const TECH = ["React", "Next.js", "Node.js", "WordPress", "Shopify", "Tailwind CSS", "PostgreSQL", "Vercel"];
const STEPS = [
  { num: "01", title: { en: "Discover", ar: "الاكتشاف" }, body: { en: "We understand your business, audience, and goals — then agree on a fixed scope.", ar: "نفهم عملك وجمهورك وأهدافك — ثم نتفق على نطاق ثابت." } },
  { num: "02", title: { en: "Design", ar: "التصميم" }, body: { en: "Wireframes and UI you approve before a single line of code.", ar: "هياكل وواجهات توافق عليها قبل كتابة أي سطر برمجي." } },
  { num: "03", title: { en: "Build", ar: "البناء" }, body: { en: "Development with weekly progress updates — no black boxes.", ar: "تطوير مع تحديثات أسبوعية — لا صناديق سوداء." } },
  { num: "04", title: { en: "Launch", ar: "الإطلاق" }, body: { en: "QA, SEO checks, analytics, and full handover — you own everything.", ar: "فحص جودة وSEO وتحليلات وتسليم كامل — تملك كل شيء." } }
];
const FAQS = [
  { q: { en: "How long does a website take?", ar: "كم يستغرق بناء الموقع؟" }, a: { en: "A landing page typically ships in about two weeks; full websites in four to six. The timeline is agreed in writing with the scope.", ar: "صفحة الهبوط تُسلَّم خلال أسبوعين تقريباً، والمواقع الكاملة خلال 4–6 أسابيع. يُتفق على الجدول الزمني كتابياً مع النطاق." } },
  { q: { en: "Who owns the website?", ar: "من يملك الموقع؟" }, a: { en: "You do, 100%. Code, design files, content, accounts, and domain are registered to you and handed over at launch.", ar: "أنت، 100%. الكود وملفات التصميم والمحتوى والحسابات والدومين تُسجَّل باسمك وتُسلَّم عند الإطلاق." } },
  { q: { en: "What happens after launch?", ar: "ماذا بعد الإطلاق؟" }, a: { en: "Every build includes a post-launch support period, and optional care plans are available if you want us to keep maintaining and improving the site.", ar: "كل مشروع يشمل فترة دعم بعد الإطلاق، وتتوفر خطط عناية اختيارية إذا أردت أن نواصل صيانة الموقع وتطويره." } }
];

export default function WebDevelopment() {
  return (
    <ServicePage service={getService("web-development")}>
      <Section title={{ en: "Benefits", ar: "المزايا" }}>
        <div className="why-grid">
          {BENEFITS.map((b, i) => (<InfoCard key={i} title={b.title} body={b.body} delay={i * 0.06} />))}
        </div>
      </Section>
      <Section title={{ en: "Technologies", ar: "التقنيات" }}>
        <Reveal>
          <div className="chips-lg">{TECH.map((t) => (<span key={t} className="chip">{t}</span>))}</div>
        </Reveal>
      </Section>
      <Section title={{ en: "Our process", ar: "منهجيتنا" }}>
        <div className="steps-row">{STEPS.map((s) => (<StepCard key={s.num} {...s} />))}</div>
      </Section>
      <Section title={{ en: "FAQ", ar: "الأسئلة الشائعة" }} center>
        <Reveal><Faq items={FAQS} /></Reveal>
      </Section>
    </ServicePage>
  );
}
