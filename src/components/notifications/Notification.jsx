
import React, { useEffect, useState } from "react";
import { Bell, CheckCircle2, Mail, X } from "lucide-react";

export default function Notification() {
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-wrap">
      <button
        className="notification-btn"
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={20} />
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-head">
            <div>
              <span className="eyebrow">CIVICPILOT</span>
              <h3>Notifications</h3>
            </div>

            <button
              type="button"
              className="notification-close"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>

          <div className="notification-item">
            <span className="notification-icon">
              <CheckCircle2 size={17} />
            </span>
            <div>
              <strong>Journey workspace ready</strong>
              <p>Your CivicPilot journey events appear here.</p>
            </div>
          </div>

          <div className="notification-item">
            <span className="notification-icon">
              <Mail size={17} />
            </span>
            <div>
              <strong>Email updates</strong>
              <p>Email notifications are triggered by the backend workflow.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
