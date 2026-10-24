import React from "react";
import { Check, CircleAlert, HelpCircle } from "lucide-react";
import {  asArray  } from "../../utils/helpers";
export default function DocumentChecklist({ required=[], missing=[] }) {
  const req=asArray(required), miss=asArray(missing).map(x=>x.toLowerCase());
  return <div className="document-list">{req.length===0 ? <div className="unknown-doc"><HelpCircle/> No document list was returned by the backend.</div> : req.map((d,i)=>{const isMissing=miss.includes(d.toLowerCase())||miss.some(m=>d.toLowerCase().includes(m));return <div className={`document-item ${isMissing?"missing":"available"}`} key={i}>{isMissing?<CircleAlert/>:<Check/>}<span>{d}</span><strong>{isMissing?"Missing":"Available"}</strong></div>})}</div>;
}
