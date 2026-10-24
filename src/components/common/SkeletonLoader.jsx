import React from "react";
export default function SkeletonLoader({ rows=3 }) {
  return <div className="skeleton-list">{Array.from({length:rows},(_,i)=><div className="skeleton-row" key={i}><span/><div><b/><i/></div></div>)}</div>;
}
