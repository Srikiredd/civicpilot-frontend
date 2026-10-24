import React from "react";
import { ArrowRight, Bot, CheckCircle2, FileCheck2, Map, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/layout/Logo";
const features=[
 ["AI Problem Understanding","Turn a real-world citizen problem into a structured service journey.",Bot],
 ["Intelligent Service Matching","Identify relevant government services from the needs detected in your situation.",Sparkles],
 ["Personalized Journey","See the services and preparation steps organized into one clear workflow.",Map],
 ["Visual Guidance","Understand procedures through verified resources and structured process maps.",FileCheck2],
 ["Application Readiness","Check preparation issues before you proceed to the official application.",CheckCircle2],
 ["Secure Experience","Use authenticated, protected access for your citizen workspace.",ShieldCheck]
];
export default function LandingPage(){
 return <div className="landing"><header className="landing-nav"><Logo/><div><Link to="/login" className="nav-login">Sign in</Link><Link to="/register" className="btn btn-primary btn-sm">Get Started</Link></div></header>
 <section className="hero"><div className="hero-copy"><span className="hero-badge"><Sparkles size={14}/> CITIZEN JOURNEY INTELLIGENCE</span><h1>Understand your problem.<br/><span>Discover the right services.</span><br/>Complete your journey.</h1><p>CivicPilot AI transforms complex government processes into simple, personalized citizen journeys — from problem understanding to application readiness.</p><div className="hero-actions"><Link className="btn btn-primary btn-lg" to="/register">Get Started <ArrowRight/></Link><a className="btn btn-secondary btn-lg" href="#features">Explore CivicPilot</a></div><div className="trust-row"><span><ShieldCheck/> Secure by design</span><span><CheckCircle2/> Guided preparation</span></div></div>
 <div className="hero-visual"><div className="orbit-card card-a"><Bot/><span>Problem<br/><strong>Understood</strong></span></div><div className="hero-core"><div className="core-glow"/><ShieldCheck size={52}/><strong>CivicPilot</strong><small>AI Citizen Journey</small></div><div className="orbit-card card-b"><Map/><span>Journey<br/><strong>Personalized</strong></span></div><div className="orbit-card card-c"><FileCheck2/><span>Readiness<br/><strong>Verified</strong></span></div></div></section>
 <section id="features" className="landing-section"><div className="section-heading centered"><span className="eyebrow">ONE CONTINUOUS JOURNEY</span><h2>Government processes, made understandable.</h2><p>CivicPilot connects the stages that citizens normally have to navigate separately.</p></div><div className="feature-grid">{features.map(([t,d,I])=><article className="feature-card" key={t}><span className="feature-icon"><I/></span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
 <section className="flow-banner"><div><span className="eyebrow">HOW CIVICPILOT WORKS</span><h2>From a real-world problem to a prepared citizen.</h2></div><div className="landing-flow">{["Citizen Problem","Understand","Services","Journey","Visual Guide","Readiness"].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><strong>{x}</strong>{i<5&&<ArrowRight/>}</div>)}</div></section>
 <footer className="landing-footer"><Logo/><span>© {new Date().getFullYear()} CivicPilot AI. Citizen guidance platform.</span></footer>
 </div>
}
