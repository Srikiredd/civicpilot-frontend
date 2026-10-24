import React from "react";
import { Compass, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ compact = false, splash = false }) {
  const content = (
    <>
      <span className={`brand-mark ${splash ? "brand-mark-splash" : ""}`} aria-hidden="true">
        <span className="brand-monogram">CP</span>
        <ShieldCheck
          className="brand-shield"
          size={compact ? 10 : splash ? 17 : 13}
        />
        <Compass
          className="brand-compass"
          size={compact ? 7 : splash ? 10 : 8}
        />
      </span>

      {!compact && (
        <span className="brand-copy">
          <strong>CivicPilot</strong>
          <small>AI</small>
        </span>
      )}
    </>
  );

  if (splash) {
    return <div className="brand brand-splash">{content}</div>;
  }

  return (
    <Link
      className="brand"
      to={compact ? "/dashboard" : "/"}
      aria-label="CivicPilot AI"
    >
      {content}
    </Link>
  );
}
