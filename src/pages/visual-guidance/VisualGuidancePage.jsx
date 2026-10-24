import React from "react";
import { ArrowLeft, Eye } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  getVisualResourcesByService,
  getStaticVisualResources
} from "../../services/visualResourceService";
import VisualGuide from "../../components/visual-guidance/VisualGuide";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { errorMessage } from "../../utils/helpers";

export default function VisualGuidancePage() {
  const { serviceId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      const results = await Promise.allSettled([
        getVisualResourcesByService(serviceId),
        getStaticVisualResources(serviceId)
      ]);

      if (!active) return;

      const successful = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => {
          const value = result.value;
          return Array.isArray(value) ? value : value?.resources || [];
        });

      const unique = successful.filter((item, index, array) => {
        const key = item?.visualId || item?.id || JSON.stringify(item);
        return (
          index ===
          array.findIndex(
            (other) =>
              (other?.visualId || other?.id || JSON.stringify(other)) === key
          )
        );
      });

      setResources(unique);

      if (
        unique.length === 0 &&
        results.every((result) => result.status === "rejected")
      ) {
        setError(
          errorMessage(
            results[0].reason,
            "Unable to load visual guidance."
          )
        );
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [serviceId]);

  return (
    <div className="workspace-page">
      <Link className="back-link" to="/journeys">
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="page-hero compact">
        <div>
          <span className="eyebrow">PHASE 07 • VISUAL GUIDANCE</span>
          <h1>See the process clearly.</h1>
          <p>
            Visual resources are explanatory aids. Official government
            requirements remain authoritative.
          </p>
        </div>

        <span className="phase-chip">
          <Eye />
          Service #{serviceId}
        </span>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner message="Loading visual guidance..." />
      ) : (
        <VisualGuide resources={resources} />
      )}
    </div>
  );
}
