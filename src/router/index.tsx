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

import RequireRole from "@/features/auth/RequireRole";
import DashboardLayout from "@/features/dashboard/DashboardLayout";
import RouteError from "@/features/dashboard/RouteError";

import EmployeeLogin from "@/pages/employee/Login";
import EmployeeDashboard from "@/pages/employee/Dashboard";
import EmployeeQuotation from "@/pages/employee/Quotation";
import EmployeeQuotations from "@/pages/employee/Quotations";
import EmployeeQuotationDetail from "@/pages/employee/QuotationDetail";
import EmployeeContracts from "@/pages/employee/Contracts";
import EmployeeContractDetail from "@/pages/employee/ContractDetail";
import EmployeePerformance from "@/pages/employee/Performance";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminEmployees from "@/pages/admin/Employees";
import AdminEmployeeDetail from "@/pages/admin/EmployeeDetail";
import AdminQuotations from "@/pages/admin/Quotations";
import AdminQuotationDetail from "@/pages/admin/QuotationDetail";
import AdminContracts from "@/pages/admin/Contracts";
import AdminContractDetail from "@/pages/admin/ContractDetail";
import AdminPerformance from "@/pages/admin/Performance";
import AdminSettings from "@/pages/admin/Settings";

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
  },
  { path: "/employee/login", element: <EmployeeLogin />, errorElement: <RouteError /> },
  {
    path: "/employee",
    element: (
      <RequireRole role="employee">
        <DashboardLayout area="employee" title="Employee" />
      </RequireRole>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <EmployeeDashboard /> },
      { path: "quotation", element: <EmployeeQuotation /> },
      { path: "quotations", element: <EmployeeQuotations /> },
      { path: "quotations/:id", element: <EmployeeQuotationDetail /> },
      { path: "contracts", element: <EmployeeContracts /> },
      { path: "contracts/:id", element: <EmployeeContractDetail /> },
      { path: "performance", element: <EmployeePerformance /> }
    ]
  },
  { path: "/admin/login", element: <AdminLogin />, errorElement: <RouteError /> },
  {
    path: "/admin",
    element: (
      <RequireRole role="admin">
        <DashboardLayout area="admin" title="Admin" />
      </RequireRole>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "employees", element: <AdminEmployees /> },
      { path: "employees/:id", element: <AdminEmployeeDetail /> },
      { path: "quotations", element: <AdminQuotations /> },
      { path: "quotations/:id", element: <AdminQuotationDetail /> },
      { path: "contracts", element: <AdminContracts /> },
      { path: "contracts/:id", element: <AdminContractDetail /> },
      { path: "performance", element: <AdminPerformance /> },
      { path: "settings", element: <AdminSettings /> }
    ]
  }
]);
