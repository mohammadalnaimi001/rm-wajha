import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import WebDevelopment from "@/pages/WebDevelopment";
import MobileApps from "@/pages/MobileApps";
import SaaS from "@/pages/SaaS";
import AISolutions from "@/pages/AISolutions";
import BusinessAutomation from "@/pages/BusinessAutomation";
import DigitalMarketing from "@/pages/DigitalMarketing";
import Branding from "@/pages/Branding";
import BusinessIntelligence from "@/pages/BusinessIntelligence";
import LoyaltyPrograms from "@/pages/LoyaltyPrograms";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "services", element: <Services /> },
      { path: "services/web-development", element: <WebDevelopment /> },
      { path: "services/mobile-app-development", element: <MobileApps /> },
      { path: "services/saas-development", element: <SaaS /> },
      { path: "services/ai-solutions", element: <AISolutions /> },
      { path: "services/business-automation", element: <BusinessAutomation /> },
      { path: "services/digital-marketing", element: <DigitalMarketing /> },
      { path: "services/branding", element: <Branding /> },
      { path: "services/business-intelligence", element: <BusinessIntelligence /> },
      { path: "services/loyalty-programs", element: <LoyaltyPrograms /> },
      { path: "*", element: <Navigate to="/" replace /> }
    ]
  }
]);
