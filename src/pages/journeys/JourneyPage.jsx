import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Map,
  ShieldCheck,
  Sparkles,
  WandSparkles
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJourney } from "../../services/journeyService";
import JourneyStepCard from "../../components/journey/JourneyStepCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { errorMessage } from "../../utils/helpers";

export default function JourneyPage() {
  const { journeyId } = useParams();
  const navigate = useNavigate();

  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadJourney() {
      setLoading(true);
      setError("");

      try {
        const data = await getJourney(journeyId);
        if (active) {
          setJourney(data);
        }
      } catch (err) {
        if (active) {
          setError(
            errorMessage(err, "Unable to load this journey.")
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (journeyId) {
      loadJourney();
    } else {
      setError("Journey ID is missing.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [journeyId]);

  if (loading) {
    return (
      <LoadingSpinner message="Loading your citizen journey..." />
    );
  }

  if (error) {
    return (
      <div className="workspace-page">
        <Link className="back-link" to="/journeys">
          <ArrowLeft size={16} />
          Back to journeys
        </Link>
        <ErrorMessage message={error} />
      </div>
    );
  }

  const steps = journey?.steps || journey?.journeySteps || [];
  const actualJourneyId = journey?.id ?? journey?.journeyId ?? journey?.citizenJourneyId ?? journeyId;

  return (
    <div className="workspace-page">
      <Link className="back-link" to="/journeys">
        <ArrowLeft size={16} />
        Back to journeys
      </Link>

      <div className="journey-hero upgraded-journey-hero">
        <div>
          <span className="eyebrow">
            PHASE 06 • PERSONALIZED JOURNEY
          </span>

          <h1>
            {journey?.title ||
              journey?.name ||
              "Your Citizen Journey"}
          </h1>

          <p>
            {journey?.description ||
              "A step-by-step workflow for your government-service needs."}
          </p>

          <div className="journey-hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  `/journeys/${actualJourneyId}/experience?mode=AI`
                )
              }
            >
              <WandSparkles size={16} />
              Open Journey Experience
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <span className="journey-id">
          <Map />
          Journey #{actualJourneyId}
        </span>
      </div>

      <div className="journey-summary-strip">
        <span>
          <Map size={16} />
          <strong>{steps.length}</strong> service steps
        </span>

        <span>
          <Sparkles size={16} />
          Personalized for you
        </span>

        <span>
          <ShieldCheck size={16} />
          Readiness available
        </span>

        <span>
          <Bot size={16} />
          Agent mode ready for next phase
        </span>
      </div>

      <div className="journey-layout">
        <section>
          <div className="timeline">
            {steps.map((step, index) => (
              <JourneyStepCard
                key={step?.id || index}
                step={step}
                index={index}
              />
            ))}
          </div>
        </section>

        <aside className="journey-aside">
          <div className="aside-card premium-aside">
            <ShieldCheck />

            <span className="eyebrow">
              CIVICPILOT GUIDANCE
            </span>

            <h3>Choose how you want to continue.</h3>

            <p>
              Open the journey experience to switch between
              Static, AI Visual and Agent modes.
            </p>

            <button
              type="button"
              className="btn btn-primary full"
              onClick={() =>
                navigate(
                  `/journeys/${actualJourneyId}/experience?mode=STATIC`
                )
              }
            >
              Explore modes
              <ArrowRight size={15} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
