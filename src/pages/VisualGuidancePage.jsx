import React from "react";
import { useEffect,useState } from "react";
import { ArrowLeft, Eye, ShieldCheck } from "lucide-react";
import { Link,useParams } from "react-router-dom";
import {  getVisualResourcesByService,getStaticVisualResources  } from "../services/visualResourceService";
import VisualGuide from "../components/visual-guidance/VisualGuide";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
export default function VisualGuidancePage(){
 const {serviceId}=useParams();const [resources,setResources]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{(async()=>{try{const [a,b]=await Promise.all([getVisualResourcesByService(serviceId),getStaticVisualResources(serviceId)]);const all=[...(Array.isArray(a)?a:a?.resources||[]),...(Array.isArray(b)?b:b?.resources||[])];const unique=all.filter((x,i)=>i===all.findIndex(y=>y.id===x.id||JSON.stringify(y)===JSON.stringify(x)));setResources(unique);}catch(e){setError(e.response?.status===404?"No visual resources were found for this service.":(e.message||"Unable to load visual guidance."));}finally{setLoading(false)}})()},[serviceId]);
 return <div className="workspace-page"><Link className="back-link" to="/journeys"><ArrowLeft size={16}/> Back</Link><div className="page-hero compact"><div><span className="eyebrow">PHASE 07 • VISUAL GUIDANCE</span><h1>See the process clearly.</h1><p>Visual resources are explanatory aids. Official government requirements remain authoritative.</p></div><span className="phase-chip"><Eye/> Service #{serviceId}</span></div>{error&&<ErrorMessage message={error}/>} {loading?<LoadingSpinner message="Loading visual guidance..."/>:<VisualGuide resources={resources}/>}</div>;
}
