import React from "react";
import { ExternalLink, ImageOff, ShieldCheck, Sparkles } from "lucide-react";
import VisualProcessFlow from "./VisualProcessFlow";
import {  API_BASE_URL  } from "../../utils/constants";

function resolveImage(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function VisualGuide({ resources = [], procedureSteps = [] }) {
  return <div className="visual-guide-layout">
    <div className="visual-resource-column">
      {resources.length === 0 ? <div className="visual-empty"><ImageOff size={34}/><h3>No stored visual resource</h3><p>CivicPilot is showing a structured process flow instead.</p></div> : resources.map((r, i) => {
        const image = resolveImage(r.imageUrl || r.imageURL || r.url);
        const official = r.officialLink || r.officialUrl;
        const generated = String(r.type || "").toUpperCase() === "AI_GENERATED";
        return <article className="visual-resource-card" key={r.visualId || r.id || i}>
          <div className="visual-resource-head"><div><span className="eyebrow">{generated ? "AI-GENERATED" : "VERIFIED STATIC"}</span><h3>{r.title || "Service Visual Guide"}</h3></div><span className="visual-pill">{generated ? <Sparkles size={14}/> : <ShieldCheck size={14}/>} {generated ? "Explanatory" : "Verified"}</span></div>
          {image ? <img src={image} alt={r.title || "Government service visual guide"} className="guide-image"/> : <div className="image-placeholder"><ImageOff/><span>Image unavailable</span></div>}
          {r.description && <p>{r.description}</p>}
          {official && <a className="btn btn-secondary" href={official} target="_blank" rel="noopener noreferrer">Open Official Government Website <ExternalLink size={15}/></a>}
          <div className="disclaimer">Visual guidance is explanatory only. Always verify official requirements before submission.</div>
        </article>;
      })}
    </div>
    <div className="process-panel"><div className="section-heading"><span className="eyebrow">PROCESS MAP</span><h3>Step-by-step guidance</h3></div><VisualProcessFlow steps={procedureSteps}/></div>
  </div>;
}
