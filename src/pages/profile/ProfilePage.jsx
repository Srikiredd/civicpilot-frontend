import React from "react";
import { Mail, ShieldCheck, UserRound, LogOut } from "lucide-react";
import {  useAuth  } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import {  displayName  } from "../../utils/helpers";
export default function ProfilePage(){const {user,logout}=useAuth();return <div className="workspace-page"><div className="page-hero compact"><div><span className="eyebrow">ACCOUNT</span><h1>Your profile.</h1><p>Manage your CivicPilot citizen workspace.</p></div></div><div className="profile-card panel"><div className="profile-avatar">{displayName(user).slice(0,1).toUpperCase()}</div><div className="profile-info"><span className="eyebrow">CITIZEN ACCOUNT</span><h2>{displayName(user)}</h2><div className="profile-detail"><Mail/> {user?.email||"Email returned by authentication session"}</div><div className="profile-detail"><UserRound/> {user?.role||"Citizen"}</div><div className="profile-secure"><ShieldCheck/><span>Authentication protected by JWT. Sensitive credentials are never displayed.</span></div><Button variant="danger" onClick={logout}><LogOut size={17}/> Logout</Button></div></div></div>}
