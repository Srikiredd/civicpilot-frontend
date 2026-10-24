import React from "react";
import { ArrowRight, CheckCircle2, FileText, Image, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { asArray } from "../../utils/helpers";

function getStepId(step) {
  return step?.id ?? step?.stepId ?? step?.journeyStepId ?? null;
}
export default function JourneyStepCard({ step, index }) {
  const service = step?.governmentService || {};
  const name = step?.serviceName || service?.name || `Journey Step ${index+1}`;
  const docs = asArray(step?.requiredDocuments);
  return <div className="journey-step-card">
    <div className="journey-node">{step?.status?.toUpperCase()==="COMPLETED" ? <CheckCircle2/> : index+1}</div>
    <div className="journey-step-content">
      <div className="step-header"><div><span className="eyebrow">STEP {index+1}</span><h3>{name}</h3></div><StatusBadge status={step?.status || "PENDING"}/></div>
      <p>{step?.procedureDescription || step?.procedure || step?.description || "Follow the official process for this service."}</p>
      {docs.length>0 && <div className="step-docs"><FileText size={15}/><span>{docs.join(" • ")}</span></div>}
      <div className="step-actions">
        {service?.id && <Link className="text-btn" to={`/visual-guidance/${service.id}`}><Image size={16}/> Visual guide</Link>}
        {getStepId(step) && <Link className="text-btn primary-text" to={`/readiness/${getStepId(step)}`}><ShieldCheck size={16}/> Check readiness <ArrowRight size={16}/></Link>}
      </div>
    </div>
  </div>;
}
