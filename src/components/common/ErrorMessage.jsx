import React from "react";
import { AlertTriangle, X } from "lucide-react";
export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;
  return <div className="error-box"><AlertTriangle size={18}/><span>{message}</span>{onClose && <button onClick={onClose} aria-label="Close"><X size={16}/></button>}</div>;
}
