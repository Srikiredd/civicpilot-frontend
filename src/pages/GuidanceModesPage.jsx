import React from "react";
import { useEffect, useState } from "react";
import { Bot, Map, ShieldCheck, Sparkles, WandSparkles, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAllJourneys } from "../services/journeyService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { errorMessage } from "../utils/helpers";

function getJourneyId(journey) {
  return journey?.id ?? journey?.journeyId ?? journey?.citizenJourneyId ?? null;
}

function getSteps(journey) {
  return journey?.steps || journey?.journeySteps || [];
}

const modes = [
  {
    key: "STATIC",
    title: "Static Visual Guidance",
    icon: ShieldCheck,
    description: "Use predefined visual resources and verified process guidance."
  },
  {
    key: "AI",
    title: "AI Visual Guidance",
    icon: WandSparkles,
    description: "Generate step-specific explanatory visuals for the journey."
  },
  {
    key: "AGENT",
    title: "Autonomous AI Agent",
    icon: Bot,
    description: "Prepare the journey for the Phase 7.3 agent workflow."
  }
];

export default function GuidanceModesPage() {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadJourneys() {
      try {
        const response = await getAllJourneys();
        if (!active) return;

        const data = Array.isArray(response)
          ? response
          : response?.journeys || response?.data || [];

        setJourneys(data.filter((journey) => getJourneyId(journey) !== null));
      } catch (err) {
        if (active) {
          setError(errorMessage(err, "Unable to load journeys for guidance."));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJourneys();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="workspace-page">
      <div className="page-hero">
        <div>
          <span className="eyebrow">PHASE 07 • GUIDANCE & MODES</span>
          <h1>Choose how CivicPilot guides you.</h1>
          <p>
            Select a journey first, then choose Static, AI Visual, or Agent
            guidance for that journey.
          </p>
        </div>
        <Link className="btn btn-secondary" to="/journeys">
          <Map size={16} />
          My Journeys
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Loading your journeys..." />
      ) : journeys.length === 0 ? (
        <EmptyState
          title="No journey available"
          message="Create a citizen journey first, then choose its guidance mode."
          action={
            <Link className="btn btn-primary" to="/problem-analysis">
              Describe a Problem
            </Link>
          }
        />
      ) : (
        <div className="panel">
          <div className="section-heading">
            <span className="eyebrow">YOUR JOURNEYS</span>
            <h2>Select a journey</h2>
          </div>

          <div className="journey-grid">
            {journeys.map((journey) => {
              const journeyId = getJourneyId(journey);
              const steps = getSteps(journey);

              return (
                <article className="journey-overview-card" key={journeyId}>
                  <div className="overview-top">
                    <span className="journey-card-icon"><Map /></span>
                    <span>JOURNEY #{journeyId}</span>
                  </div>

                  <h2>
                    {journey?.title || journey?.name || "Citizen Service Journey"}
                  </h2>

                  <p>
                    {journey?.description || "Personalized government-service workflow"}
                  </p>

                  <span>{steps.length} service steps</span>

                  <div className="journey-mode-grid">
                    {modes.map(({ key, title, icon: Icon, description }) => (
                      <button
                        key={key}
                        type="button"
                        className={`journey-mode-card mode-${key.toLowerCase()}`}
                        onClick={() =>
                          navigate(`/journeys/${journeyId}/experience?mode=${key}`)
                        }
                      >
                        <div className="mode-card-top">
                          <span className="mode-card-icon"><Icon /></span>
                        </div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                        <span className="mode-card-action">
                          Open <ArrowRight size={15} />
                        </span>
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
