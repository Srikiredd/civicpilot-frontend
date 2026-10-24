import React from "react";
import {
  LayoutDashboard,
  MessageSquareText,
  Map,
  Sparkles,
  ShieldCheck,
  UserRound,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../../hooks/useAuth";

const items = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/problem-analysis", "My Problems", MessageSquareText],
  ["/journeys", "My Journeys", Map],
  ["/guidance", "Guidance & Modes", Sparkles],
  ["/readiness", "Application Readiness", ShieldCheck],
  ["/profile", "Profile", UserRound]
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo />
      </div>

      <div className="sidebar-label">CITIZEN WORKSPACE</div>

      <nav aria-label="Main navigation">
        {items.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="secure-note">
          <ShieldCheck size={16} />
          <div>
            <strong>Secure session</strong>
            <small>JWT protected</small>
          </div>
        </div>

        <button
          className="nav-item logout-btn"
          type="button"
          onClick={logout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
