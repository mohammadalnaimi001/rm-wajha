import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import StepCard from "@/components/cards/StepCard";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  { num: "01", title: { en: "Discover", ar: "الاكتشاف" }, body: { en: "We understand your business, audience, and goals — then agree on a fixed scope and price.", ar: "نفهم عملك وجمهورك وأهدافك — ثم نتفق على نطاق وسعر ثابتين." } },
  { num: "02", title: { en: "Design", ar: "التصميم" }, body: { en: "Wireframes and UI you approve before a single line of code.", ar: "هياكل وواجهات توافق عليها قبل كتابة أي سطر برمجي." } },
  { num: "03", title: { en: "Build", ar: "البناء" }, body: { en: "Development with weekly progress updates — no black boxes.", ar: "تطوير مع تحديثات أسبوعية — لا صناديق سوداء." } },
  { num: "04", title: { en: "Launch & Grow", ar: "الإطلاق والنمو" }, body: { en: "QA, analytics, and full handover — then ongoing improvement if you want us alongside.", ar: "فحص جودة وتحليلات وتسليم كامل — ثم تطوير مستمر إذا أردتنا بجانبك." } }
];

export default function About() {
  const { L } = useLang();
  useSEO(
    { en: "About — Nexora Agency", ar: "من نحن — نكسورا" },
    { en: "Nexora is a digital agency based in Amman, Jordan, combining engineering, design, and AI in one senior team.", ar: "نكسورا وكالة رقمية مقرها عمّان، الأردن، تجمع الهندسة والتصميم والذكاء الاصطناعي في فريق خبير واحد." }
  );
  return (
    <>
      <PageHero
        eyebrow={{ en: "About Nexora", ar: "من نحن" }}
        title={{ en: "A senior team focused on outcomes.", ar: "فريق خبير يركز على النتائج." }}
        sub={{ en: "Nexora is a digital agency based in Amman, Jordan, working with clients worldwide. We design, build, and grow digital products — combining engineering, design, and AI in one team.", ar: "نكسورا وكالة رقمية مقرها عمّان، الأردن، تعمل مع عملاء حول العالم. نصمم ونبني وننمي المنتجات الرقمية — بدمج الهندسة والتصميم والذكاء الاصطناعي في فريق واحد." }}
      />
      <Section title={{ en: "How we work", ar: "كيف نعمل" }} lead={{ en: "We keep things simple: clear scope, fixed pricing, and honest communication from the first call to launch and beyond.", ar: "نبقي الأمور بسيطة: نطاق واضح، وسعر ثابت، وتواصل صادق من أول مكالمة حتى الإطلاق وما بعده." }}>
        <div className="steps-row">
          {STEPS.map((s) => (<StepCard key={s.num} {...s} />))}
        </div>
      </Section>
      <Section title={{ en: "Our team", ar: "فريقنا" }}>
        <Reveal>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: "64ch" }}>
            {/* TODO: replace with real team bios and photos when available */}
            {L({ en: "Team profiles are coming soon. Want to know who you'd be working with? Ask us on the strategy call — we'll introduce the exact people on your project.", ar: "ملفات الفريق قادمة قريباً. تريد معرفة من ستعمل معه؟ اسألنا في المكالمة الاستراتيجية — وسنعرّفك على الأشخاص الذين سيعملون على مشروعك تحديداً." })}
          </p>
        </Reveal>
      </Section>
    </>
  );
}
