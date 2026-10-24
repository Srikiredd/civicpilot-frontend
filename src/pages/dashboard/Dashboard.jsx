import React from "react";
import { useEffect, useState } from "react";
import { ArrowRight, FileCheck2, Map, MessageSquareText, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import {  getAllJourneys  } from "../../services/journeyService";
import {  getAllReadiness  } from "../../services/readinessService";
import {  useAuth  } from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import {  displayName, errorMessage  } from "../../utils/helpers";
function getJourneyId(journey) {
  return journey?.id ?? journey?.journeyId ?? journey?.citizenJourneyId ?? null;
}

export default function Dashboard(){
 const {user}=useAuth(); const [journeys,setJourneys]=useState([]); const [readiness,setReadiness]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 useEffect(()=>{(async()=>{const results=await Promise.allSettled([getAllJourneys(),getAllReadiness()]);const journeyResult=results[0];const readinessResult=results[1];if(journeyResult.status==="fulfilled"){const value=journeyResult.value;setJourneys(Array.isArray(value)?value:value?.journeys||[]);}else{setError(errorMessage(journeyResult.reason,"Unable to load journeys."));}if(readinessResult.status==="fulfilled"){const value=readinessResult.value;setReadiness(Array.isArray(value)?value:value?.readiness||[]);}})().finally(()=>setLoading(false))},[]);
 const completed=journeys.reduce((n,j)=>(n+(j.steps||j.journeySteps||[]).filter(s=>String(s.status).toUpperCase()==="COMPLETED").length),0);
 const ready=readiness.filter(r=>String(r.readinessStatus).toUpperCase()==="READY").length;
 return <div className="dashboard"><section className="welcome"><div><span className="eyebrow">CITIZEN WORKSPACE</span><h1>Welcome back, {displayName(user)} <span>👋</span></h1><p>Let's simplify your government journey.</p></div><Link className="btn btn-primary" to="/problem-analysis"><MessageSquareText size={18}/> Describe Your Problem</Link></section>
 {error&&<ErrorMessage message={error}/>}
 <div className="quick-grid"><Link className="quick-card featured" to="/problem-analysis"><span><Sparkles/></span><div><strong>Describe a Problem</strong><p>Start a new citizen journey</p></div><ArrowRight/></Link><Link className="quick-card" to="/journeys"><span><Map/></span><div><strong>My Journeys</strong><p>View your active workflows</p></div><ArrowRight/></Link><Link className="quick-card" to="/readiness"><span><ShieldCheck/></span><div><strong>Application Readiness</strong><p>Open a journey and check a step</p></div><ArrowRight/></Link></div>
 {loading?<LoadingSpinner message="Loading your citizen workspace..."/>:<><div className="stats-grid"><div className="stat-card"><span><Map/></span><strong>{journeys.length}</strong><small>Active Journeys</small></div><div className="stat-card"><span><CheckCircle2/></span><strong>{completed}</strong><small>Completed Steps</small></div><div className="stat-card"><span><FileCheck2/></span><strong>{Math.max(0,journeys.length*1-completed)}</strong><small>Pending Actions</small></div><div className="stat-card"><span><ShieldCheck/></span><strong>{ready}</strong><small>Ready Applications</small></div></div><div className="dashboard-columns"><section className="panel"><div className="panel-head"><div><span className="eyebrow">YOUR WORKFLOWS</span><h2>Recent journeys</h2></div><Link to="/journeys">View all <ArrowRight size={15}/></Link></div>{journeys.length?journeys.slice(0,3).map((j,i)=><Link className="mini-journey" to={`/journeys/${getJourneyId(j)}`} key={getJourneyId(j)||i}><span className="mini-icon"><Map/></span><div><strong>{j.title||j.name||`Citizen Journey ${getJourneyId(j)||i+1}`}</strong><p>{j.description||"Personalized government-service journey"}</p></div><ArrowRight/></Link>):<EmptyState title="No journeys yet" message="Describe your problem and CivicPilot will help you build a personalized journey." action={<Link className="btn btn-primary btn-sm" to="/problem-analysis">Describe a Problem</Link>}/>}</section><section className="panel readiness-mini"><div className="panel-head"><div><span className="eyebrow">READINESS</span><h2>Preparation checks</h2></div><ShieldCheck/></div>{readiness.length?readiness.slice(0,4).map(r=><div className="readiness-mini-row" key={r.readinessId}><div><strong>{r.serviceName}</strong><StatusBadge status={r.readinessStatus}/></div><span>{r.readinessScore}%</span></div>):<div className="mini-empty"><ShieldCheck/><p>No readiness checks yet.</p><Link to="/journeys">Open a journey</Link></div>}</section></div></>}
 </div>;
}
