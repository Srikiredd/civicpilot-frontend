import React from "react";
export default function StatusBadge({ status }) {
  const normalized = String(status || "PENDING").toUpperCase();
  return <span className={`status-badge status-${normalized.toLowerCase()}`}>{normalized.replaceAll("_"," ")}</span>;
}
