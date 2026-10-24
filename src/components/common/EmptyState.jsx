import React from "react";
import { Inbox } from "lucide-react";
export default function EmptyState({ title, message, action }) {
  return <div className="empty-state"><span className="empty-icon"><Inbox/></span><h3>{title}</h3><p>{message}</p>{action}</div>;
}
