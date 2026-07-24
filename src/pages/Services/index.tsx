import { useSEO } from "@/hooks/useSEO";
import PageHero from "@/components/sections/PageHero";
import ServicesGrid from "@/components/sections/ServicesGrid";

export default function Services() {
  useSEO(
    { en: "Our Services — Nexora Agency", ar: "خدماتنا — نكسورا" },
    { en: "Web, mobile, SaaS, AI, automation, marketing, branding, BI, and loyalty programs — one senior team.", ar: "ويب وجوال وSaaS وذكاء اصطناعي وأتمتة وتسويق وهوية وذكاء أعمال وبرامج ولاء — فريق خبير واحد." }
  );
  return (
    <>
      <PageHero
        eyebrow={{ en: "Services", ar: "الخدمات" }}
        title={{ en: "Nine services. One senior team.", ar: "تسع خدمات. فريق خبير واحد." }}
        sub={{ en: "Everything your brand needs to win online — designed, built, and grown under one roof.", ar: "كل ما تحتاجه علامتك للفوز رقمياً — يُصمَّم ويُبنى ويُنمَّى تحت سقف واحد." }}
      />
      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="container">
          <ServicesGrid />
        </div>
      </section>
    </>
  );
}
