import React from "react";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {  useAuth  } from "../../hooks/useAuth";
import Logo from "../../components/layout/Logo";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import {  errorMessage  } from "../../utils/helpers";
export default function LoginPage(){
 const {login,loading}=useAuth(); const nav=useNavigate(); const loc=useLocation(); const [form,setForm]=useState({email:"",password:""}); const [show,setShow]=useState(false); const [error,setError]=useState("");
 const submit=async e=>{e.preventDefault();setError("");if(!form.email||!form.password){setError("Enter your email and password.");return}try{await login(form);nav(loc.state?.from||"/dashboard",{replace:true});}catch(err){setError(errorMessage(err,"Login failed. Please check your credentials."));}};
 return <div className="auth-page"><div className="auth-brand"><Logo/></div><div className="auth-layout"><div className="auth-art"><span className="hero-badge"><ShieldCheck size={14}/> SECURE CITIZEN WORKSPACE</span><h1>Your government journey starts with clarity.</h1><p>Sign in to continue your CivicPilot journey, review services and check application readiness.</p><div className="auth-points"><span><ShieldCheck/> JWT protected session</span><span><ArrowRight/> Personalized journey workspace</span></div></div><div className="auth-card"><div className="auth-card-head"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to CivicPilot</h2><p>Use your registered citizen account.</p></div><ErrorMessage message={error}/><form onSubmit={submit} className="form-stack"><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label>Password<div className="password-wrap"><input type={show?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label><Button type="submit" loading={loading}>Sign in <ArrowRight size={17}/></Button></form><p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p></div></div></div>;
}
