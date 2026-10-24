import React from "react";
export default function ProgressBar({ value=0, label }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className="progress-wrap">
    {label && <div className="progress-label"><span>{label}</span><strong>{safe}%</strong></div>}
    <div className="progress-track"><div className="progress-fill" style={{width:`${safe}%`}} /></div>
  </div>;
}
