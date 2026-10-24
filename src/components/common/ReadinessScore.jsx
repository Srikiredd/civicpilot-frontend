import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
export default function ReadinessScore({ score=0, status }) {
  const value=Math.max(0,Math.min(100,Number(score)||0));
  const ready=String(status).toUpperCase()==="READY";
  return <div className="readiness-score-card"><div className="score-ring" style={{"--score":`${value*3.6}deg`}}><div><strong>{value}</strong><span>%</span></div></div><div><span className="eyebrow">APPLICATION READINESS</span><h2>{ready?"READY":"NEEDS ATTENTION"}</h2><p>{ready?"Your preparation appears ready for the next step.":"Resolve the highlighted preparation issues before submission."}</p><div className={`score-status ${ready?"good":"warn"}`}>{ready?<CheckCircle2/>:<AlertCircle/>}{ready?"Preparation checks passed":"Preparation requires attention"}</div></div></div>;
}
