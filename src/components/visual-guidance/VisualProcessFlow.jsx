import React from "react";
import { CheckCircle2, FileText, Send, Search, Award } from "lucide-react";
const icons=[CheckCircle2,FileText,Send,Search,Award];
export default function VisualProcessFlow({ steps=[] }) {
  const fallback = steps.length ? steps : [
    {title:"Review requirements",description:"Confirm eligibility and official requirements."},
    {title:"Collect documents",description:"Prepare the required documents."},
    {title:"Submit application",description:"Submit through the official channel."},
    {title:"Verification",description:"The concerned authority verifies the application."},
    {title:"Decision / issuance",description:"Track the official outcome."}
  ];
  return <div className="process-flow">{fallback.map((s,i)=>{const Icon=icons[i%icons.length];return <div className="flow-step" key={s.id||i}><div className="flow-number"><Icon size={19}/></div><div><span>STEP {i+1}</span><h4>{s.title||s.name||`Step ${i+1}`}</h4><p>{s.description||s.procedureDescription||""}</p></div>{i<fallback.length-1&&<div className="flow-line"/>}</div>})}</div>;
}
