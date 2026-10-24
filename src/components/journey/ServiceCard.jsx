import React from "react";
import { ArrowUpRight, FileText, Landmark, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import {  asArray  } from "../../utils/helpers";
export default function ServiceCard({ service, onStart }) {
  const id = service?.id;
  const name = service?.name || service?.serviceName || "Government Service";
  const description = service?.description || service?.details || "Government service information";
  const docs = asArray(service?.requiredDocuments);
  return <article className="service-card">
    <div className="service-card-top"><span className="service-icon"><Landmark/></span><span className="verified"><ShieldCheck size={14}/> Verified data</span></div>
    <h3>{name}</h3><p>{description}</p>
    {service?.department && <div className="meta-line"><span>Department</span><strong>{service.department}</strong></div>}
    {docs.length>0 && <div className="doc-preview"><FileText size={15}/>{docs.slice(0,3).join(" • ")}{docs.length>3 ? " • …" : ""}</div>}
    <div className="card-actions">{id && <Link className="btn btn-secondary btn-sm" to={`/visual-guidance/${id}`}>View Guide <ArrowUpRight size={15}/></Link>}{onStart && <button className="btn btn-primary btn-sm" onClick={()=>onStart(service)}>Start Journey</button>}</div>
  </article>;
}
