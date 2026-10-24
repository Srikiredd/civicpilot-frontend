import React from "react";
import { useEffect, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, Map, ShieldCheck, Sparkles, Target, WandSparkles } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {  matchServices, createJourney  } from "../../services/journeyService";
import ServiceCard from "../../components/journey/ServiceCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import {  errorMessage  } from "../../utils/helpers";

const modes = [
  { key: "STATIC", title: "Static Journey", icon: ShieldCheck, tag: "Verified", description: "Fast, predictable guidance using predefined service visuals." },
  { key: "AI", title: "AI Visual Journey", icon: WandSparkles, tag: "Intelligent", description: "Generate step-specific visual guidance from your personalized journey." },
  { key: "AGENT", title: "Agent Journey", icon: Bot, tag: "Coming next", description: "Let CivicPilot prepare and eventually execute the workflow with agent assistance." }
];

export default function ServiceMatchingPage() {
  const { analysisId } = useParams();
  const nav = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await matchServices(analysisId);
        setServices(Array.isArray(r) ? r : r?.services || r?.matchedServices || []);
      } catch (e) { setError(errorMessage(e, "Service matching failed.")); }
      finally { setLoading(false); }
    })();
  }, [analysisId]);

  const chooseMode = async (mode) => {
    setCreating(mode);
    setError("");
    try {
      const j = await createJourney(analysisId, localStorage.getItem("cp_state") || "Andhra Pradesh");
      const id = j?.id || j?.journeyId;
      if (!id) throw new Error("Journey was created but no journey ID was returned.");
      nav(`/journeys/${id}/experience?mode=${mode}`);
    } catch (e) { setError(errorMessage(e, "Journey creation failed.")); }
    finally { setCreating(""); }
  };

  return <div className="workspace-page matching-page">
    <div className="page-hero matching-hero"><div><span className="eyebrow">PHASE 05 • INTELLIGENT SERVICE MATCHING</span><h1>Your services are taking shape.</h1><p>CivicPilot has interpreted your situation. Review the matched services, then choose how you want to experience your journey.</p></div><div className="matching-badge"><Target/><span>Analysis <strong>#{analysisId}</strong></span></div></div>
    <ErrorMessage message={error}/>
    {loading ? <LoadingSpinner message="Finding relevant government services..."/> : <>
      {services.length ? <>
        <div className="matching-toolbar"><span><Sparkles size={17}/> {services.length} relevant service{services.length !== 1 ? "s" : ""} identified</span><span className="matching-note"><CheckCircle2 size={15}/> Based on your problem analysis</span></div>
        <div className="service-grid">{services.map((s, i) => <ServiceCard key={s.id || i} service={s} onStart={() => chooseMode("STATIC")} />)}</div>
        <section className="mode-selection">
          <div className="mode-selection-head"><div><span className="eyebrow">CHOOSE YOUR JOURNEY</span><h2>How should CivicPilot guide you?</h2><p>Same personalized service journey. Three different ways to experience it.</p></div><span className="mode-selection-badge"><Map size={15}/> Citizen-controlled</span></div>
          <div className="journey-mode-grid">{modes.map(({ key, title, icon: Icon, tag, description }) => <button className={`journey-mode-card mode-${key.toLowerCase()}`} key={key} onClick={() => chooseMode(key)} disabled={Boolean(creating)}><div className="mode-card-top"><span className="mode-card-icon"><Icon/></span><span className="mode-tag">{tag}</span></div><h3>{title}</h3><p>{description}</p><span className="mode-card-action">{creating === key ? "Preparing journey..." : "Choose this mode"}<ArrowRight size={16}/></span></button>)}</div>
        </section>
      </> : <div className="panel empty-state"><div className="empty-icon"><Target/></div><h3>No matched services were returned</h3><p>Try describing the situation with a little more detail.</p><Link className="btn btn-secondary" to="/problem-analysis">Describe another problem</Link></div>}
    </>}
  </div>;
}
