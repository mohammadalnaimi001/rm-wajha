import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "@/styles/dashboard.css";
import { useAuth } from "@/features/auth/AuthContext";
import {
  IconGrid,
  IconFile,
  IconStack,
  IconContract,
  IconChart,
  IconUsers,
  IconSettings,
  IconLogout,
  IconMenu
} from "./icons";

type NavItem = { to: string; label: string; icon: () => JSX.Element };

const EMPLOYEE_NAV: NavItem[] = [
  { to: "/employee/dashboard", label: "Dashboard", icon: IconGrid },
  { to: "/employee/quotation", label: "New Quotation", icon: IconFile },
  { to: "/employee/quotations", label: "Quotations", icon: IconStack },
  { to: "/employee/contracts", label: "Contracts", icon: IconContract },
  { to: "/employee/performance", label: "Performance", icon: IconChart }
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: IconGrid },
  { to: "/admin/employees", label: "Employees", icon: IconUsers },
  { to: "/admin/quotations", label: "Quotations", icon: IconStack },
  { to: "/admin/contracts", label: "Contracts", icon: IconContract },
  { to: "/admin/performance", label: "Performance", icon: IconChart },
  { to: "/admin/settings", label: "Settings", icon: IconSettings }
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function DashboardLayout({ area, title }: { area: "employee" | "admin"; title: string }) {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = area === "employee" ? EMPLOYEE_NAV : ADMIN_NAV;

  return (
    <div className="dash">
      <div className="dash-shell">
        <aside className={`dash-sidebar${open ? " open" : ""}`}>
          <div className="dash-brand">
            <img src="/logo.svg" alt="Nexora Agency" />
            <div>
              <b>NEXORA</b>
              <small>{area === "admin" ? "Admin" : "Employee"}</small>
            </div>
          </div>
          <nav className="dash-nav">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <item.icon />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="dash-nav-foot">
            <button className="dash-signout" onClick={() => signOut()}>
              <IconLogout />
              Sign out
            </button>
          </div>
        </aside>

        <div className="dash-main">
          <header className="dash-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="dash-topbar-menu" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
                <IconMenu />
              </button>
              <h1>{title}</h1>
            </div>
            <div className="dash-who">
              <span>{profile?.full_name}</span>
              <div className="dash-avatar">{profile ? initials(profile.full_name) : ""}</div>
            </div>
          </header>
          <div className="dash-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
