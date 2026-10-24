
import React, { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Logo from "./Logo";
import Notification from "../notifications/Notification";
import { displayName } from "../../utils/helpers";

export default function Navbar() {
  const { user } = useAuth();
  const [mobile, setMobile] = useState(false);

  return (
    <header className="topbar">
      <button
        className="mobile-menu"
        type="button"
        onClick={() => setMobile((value) => !value)}
        aria-label={mobile ? "Close menu" : "Open menu"}
      >
        <Menu />
      </button>

      <div className="mobile-logo">
        <Logo compact />
      </div>

      <div className="top-search">
        <Search size={18} />
        <input
          placeholder="Search CivicPilot..."
          aria-label="Search CivicPilot"
        />
      </div>

      <div className="top-actions">
        <Notification />

        <div className="user-chip">
          <span>{displayName(user).slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{displayName(user)}</strong>
            <small>Citizen</small>
          </div>
        </div>
      </div>
    </header>
  );
}
