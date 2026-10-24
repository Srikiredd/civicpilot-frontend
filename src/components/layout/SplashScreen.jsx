import React from "react";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Logo from "./Logo";

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 320);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`app-splash ${visible ? "is-visible" : "is-leaving"}`} aria-label="Loading CivicPilot AI">
      <div className="splash-grid" />
      <div className="splash-orb splash-orb-one" />
      <div className="splash-orb splash-orb-two" />
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <Logo splash />
        </div>
        <div className="splash-kicker"><Sparkles size={13} /> CITIZEN JOURNEY INTELLIGENCE</div>
        <h1>CivicPilot <span>AI</span></h1>
        <p>From problem to resolution through intelligent visual guidance.</p>
        <div className="splash-loader"><span /><span /><span /><span /></div>
        <small>Initializing your citizen workspace</small>
      </div>
    </div>
  );
}
