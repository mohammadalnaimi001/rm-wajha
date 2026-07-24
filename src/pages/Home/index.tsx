import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import Section from "@/components/ui/Section";
import ServicesGrid from "@/components/sections/ServicesGrid";
import InfoCard from "@/components/cards/InfoCard";
import Reveal from "@/components/ui/Reveal";

const WHY = [
  { title: { en: "Senior talent only", ar: "خبراء فقط" }, body: { en: "No juniors learning on your budget. Every project is led by specialists with 8+ years shipping real products.", ar: "لا مبتدئين يتعلمون على حسابك. كل مشروع يقوده متخصصون بخبرة تتجاوز 8 سنوات في إطلاق منتجات حقيقية." } },
  { title: { en: "Fixed scope, fixed price", ar: "نطاق ثابت وسعر ثابت" }, body: { en: "You approve the number before we start — and it doesn't move. Revisions live inside the scope, not on top of it.", ar: "توافق على الرقم قبل أن نبدأ — ولا يتغير. التعديلات ضمن النطاق، لا فوقه." } },
  { title: { en: "Weekly demos", ar: "عروض أسبوعية" }, body: { en: "See real progress every Friday. No black boxes, no radio silence, no launch-day surprises.", ar: "شاهد تقدماً حقيقياً كل جمعة. لا صناديق سوداء، ولا صمت، ولا مفاجآت يوم الإطلاق." } }
];

export default function Home() {
  const { L } = useLang();
  useSEO(
    { en: "Nexora Agency — Engineering Digital Growth", ar: "نكسورا — نهندس النمو الرقمي" },
    { en: "Full-service digital agency: web, mobile, SaaS, AI, automation, marketing, branding, BI, and loyalty programs.", ar: "وكالة رقمية متكاملة: ويب وجوال وSaaS وذكاء اصطناعي وأتمتة وتسويق وهوية وذكاء أعمال وبرامج ولاء." }
  );

  return (
    <>
      <section className="hero" id="top">
        <div className="container">
          <div className="hero-wrap">
            <span className="hero-badge">
              <span className="pulse" />
              <span>{L({ en: "Web · AI · Marketing — Amman, Jordan", ar: "ويب · ذكاء اصطناعي · تسويق — عمّان، الأردن" })}</span>
            </span>
            <h1>
              <span>{L({ en: "Engineering", ar: "نهندس" })}</span>
              <span className="accent">{L({ en: "Digital Growth.", ar: "النمو الرقمي." })}</span>
            </h1>
            <p className="hero-sub">{L({ en: "We partner with ambitious brands to design, build, and scale digital products that move markets — combining strategy, design, engineering, and AI under one roof.", ar: "نشارك العلامات الطموحة في تصميم وبناء وتنمية منتجات رقمية تصنع الفرق — باستراتيجية وتصميم وهندسة وذكاء اصطناعي تحت سقف واحد." })}</p>
            <div className="hero-ctas">
              <Link className="btn btn-primary arr" to="/contact"><span>{L({ en: "Start Your Project", ar: "ابدأ مشروعك" })}</span></Link>
              <Link className="btn btn-ghost" to="/services">{L({ en: "Explore Services", ar: "استكشف خدماتنا" })}</Link>
            </div>
          </div>
        </div>
      </section>

      <Section
        center
        eyebrow={{ en: "Our Services", ar: "خدماتنا" }}
        title={{ en: "Everything your brand needs to win online.", ar: "كل ما تحتاجه علامتك للفوز رقمياً." }}
        lead={{ en: "Nine core services. One senior team. Zero hand-offs between agencies.", ar: "تسع خدمات أساسية. فريق خبير واحد. صفر تسليمات بين وكالات." }}
      >
        <ServicesGrid />
      </Section>

      <Section eyebrow={{ en: "Why Nexora", ar: "لماذا نكسورا" }} title={{ en: "An agency built like a product team.", ar: "وكالة تعمل بعقلية فريق منتج." }}>
        <div className="why-grid">
          {WHY.map((w, i) => (<InfoCard key={i} title={w.title} body={w.body} delay={i * 0.06} />))}
        </div>
      </Section>

      <Section
        center
        eyebrow={{ en: "About Nexora", ar: "من نحن" }}
        title={{ en: "A senior team focused on outcomes.", ar: "فريق خبير يركز على النتائج." }}
        lead={{ en: "Nexora is a digital agency based in Amman, Jordan, working with clients worldwide. We design, build, and grow digital products — combining engineering, design, and AI in one team.", ar: "نكسورا وكالة رقمية مقرها عمّان، الأردن، تعمل مع عملاء حول العالم. نصمم ونبني وننمي المنتجات الرقمية — بدمج الهندسة والتصميم والذكاء الاصطناعي في فريق واحد." }}
      >
        <Reveal>
          <div style={{ textAlign: "center" }}>
            <Link className="btn btn-ghost arr" to="/about"><span>{L({ en: "More About Us", ar: "المزيد عنا" })}</span></Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
