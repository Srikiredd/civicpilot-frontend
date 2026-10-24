import React from "react";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Map, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAllJourneys } from "../services/journeyService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { errorMessage } from "../utils/helpers";

function getJourneyId(journey) {
  return journey?.id ?? journey?.journeyId ?? journey?.citizenJourneyId ?? null;
}

function getStepId(step) {
  return step?.id ?? step?.stepId ?? step?.journeyStepId ?? null;
}

function getSteps(journey) {
  return journey?.steps || journey?.journeySteps || [];
}

export default function ReadinessHubPage() {
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
          setError(errorMessage(err, "Unable to load journeys for readiness."));
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
          <span className="eyebrow">PHASE 08 • APPLICATION READINESS</span>
          <h1>Check your application readiness.</h1>
          <p>
            Select a journey and then choose the service step you want CivicPilot
            to check.
          </p>
        </div>
        <Link className="btn btn-secondary" to="/journeys">
          <Map size={16} />
          My Journeys
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Loading journeys for readiness..." />
      ) : journeys.length === 0 ? (
        <EmptyState
          title="No journey available"
          message="Create a citizen journey before running an application readiness check."
          action={
            <Link className="btn btn-primary" to="/problem-analysis">
              Describe a Problem
            </Link>
          }
        />
      ) : (
        <div className="readiness-hub-list">
          {journeys.map((journey) => {
            const journeyId = getJourneyId(journey);
            const steps = getSteps(journey);

            return (
              <section className="panel" key={journeyId}>
                <div className="panel-head">
                  <div>
                    <span className="eyebrow">JOURNEY #{journeyId}</span>
                    <h2>
                      {journey?.title || journey?.name || "Citizen Service Journey"}
                    </h2>
                  </div>
                  <ShieldCheck />
                </div>

                {steps.length === 0 ? (
                  <p>No service steps are available for this journey.</p>
                ) : (
                  <div className="readiness-step-list">
                    {steps.map((step, index) => {
                      const stepId = getStepId(step);
                      const service = step?.governmentService || {};
                      const name =
                        step?.serviceName ||
                        service?.name ||
                        `Service Step ${index + 1}`;

                      return (
                        <button
                          key={stepId || index}
                          type="button"
                          className="readiness-step-item"
                          disabled={!stepId}
                          onClick={() => {
                            if (stepId) navigate(`/readiness/${stepId}`);
                          }}
                        >
                          <span className="readiness-step-icon">
                            <CheckCircle2 size={18} />
                          </span>
                          <span className="readiness-step-text">
                            <strong>Step {index + 1}: {name}</strong>
                            <small>
                              {step?.procedureDescription ||
                                step?.description ||
                                "Run the application readiness check for this service."}
                            </small>
                          </span>
                          <ArrowRight size={18} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
