import { useSEO } from "@/hooks/useSEO";
import PageHero from "@/components/sections/PageHero";
import ContactBlock from "@/components/sections/ContactBlock";

export default function Contact() {
  useSEO(
    { en: "Contact — Nexora Agency", ar: "تواصل معنا — نكسورا" },
    { en: "Tell us where you want to go. We reply within 24 hours — usually much faster.", ar: "أخبرنا إلى أين تريد الوصول. نرد خلال 24 ساعة — وغالباً أسرع بكثير." }
  );
  return (
    <>
      <PageHero
        eyebrow={{ en: "Contact", ar: "تواصل معنا" }}
        title={{ en: "Tell us where you want to go.", ar: "أخبرنا إلى أين تريد الوصول." }}
        sub={{ en: "We reply within 24 hours — usually much faster.", ar: "نرد خلال 24 ساعة — وغالباً أسرع بكثير." }}
      />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="container">
          <ContactBlock />
        </div>
      </section>
    </>
  );
}
