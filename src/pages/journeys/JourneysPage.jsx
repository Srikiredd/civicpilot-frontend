import React from "react";
import { useEffect, useState } from "react";
import { ArrowRight, Map, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllJourneys } from "../../services/journeyService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import ProgressBar from "../../components/common/ProgressBar";
import { errorMessage } from "../../utils/helpers";

function getJourneyId(journey) {
  return journey?.id ?? journey?.journeyId ?? journey?.citizenJourneyId ?? null;
}

function getSteps(journey) {
  return journey?.steps || journey?.journeySteps || [];
}

export default function JourneysPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadJourneys() {
      try {
        const response = await getAllJourneys();
        if (!active) return;

        const rawItems = Array.isArray(response)
          ? response
          : response?.journeys || response?.data || [];

        const validItems = rawItems.filter((journey) => getJourneyId(journey) !== null);
        setItems(validItems);
      } catch (err) {
        if (active) {
          setError(errorMessage(err, "Unable to load your journeys."));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
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
          <span className="eyebrow">CITIZEN JOURNEYS</span>
          <h1>Your personalized workflows.</h1>
          <p>
            Each journey connects your real-world situation to the government
            services you may need.
          </p>
        </div>

        <Link className="btn btn-primary" to="/problem-analysis">
          <Plus />
          New Journey
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Loading your journeys..." />
      ) : items.length ? (
        <div className="journey-grid">
          {items.map((journey, index) => {
            const journeyId = getJourneyId(journey);
            const steps = getSteps(journey);
            const completed = steps.filter(
              (step) => String(step?.status || "").toUpperCase() === "COMPLETED"
            ).length;
            const percentage = steps.length
              ? Math.round((completed / steps.length) * 100)
              : 0;

            return (
              <Link
                to={`/journeys/${journeyId}`}
                className="journey-overview-card"
                key={journeyId}
              >
                <div className="overview-top">
                  <span className="journey-card-icon">
                    <Map />
                  </span>
                  <span>JOURNEY #{journeyId || index + 1}</span>
                </div>

                <h2>
                  {journey?.title ||
                    journey?.name ||
                    "Citizen Service Journey"}
                </h2>

                <p>
                  {journey?.description ||
                    "Personalized government-service workflow"}
                </p>

                <ProgressBar
                  value={percentage}
                  label={`${completed} of ${steps.length} steps completed`}
                />

                <div className="overview-bottom">
                  <span>{steps.length} services / steps</span>
                  <ArrowRight />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No journeys yet"
          message="Describe your problem and CivicPilot will build a personalized government-service journey."
          action={
            <Link className="btn btn-primary" to="/problem-analysis">
              Describe a Problem
            </Link>
          }
        />
      )}
    </div>
  );
}
