import api from "./apiClient";

export async function matchServices(analysisId) {
  const { data } = await api.post(`/api/service-matching/${analysisId}`);
  return data;
}

export async function createJourney(analysisId, state = "Andhra Pradesh") {
  const { data } = await api.post(`/api/journeys/${analysisId}`, null, { params: { state } });
  return data;
}

export async function getJourney(journeyId) {
  const { data } = await api.get(`/api/journeys/${journeyId}`);
  return data;
}

export async function getAllJourneys() {
  const { data } = await api.get("/api/journeys");
  return data;
}
