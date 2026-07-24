import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CTA from "./CTA";
import BackToTop from "@/components/shared/BackToTop";

export default function Layout() {
  const { L } = useLang();
  const { pathname } = useLocation();
  return (
    <>
      <a className="skip" href="#main">{L({ en: "Skip to content", ar: "تخطَّ إلى المحتوى" })}</a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      {pathname !== "/contact" && <CTA />}
      <Footer />
      <BackToTop />
      <ScrollRestoration />
    </>
  );
}
