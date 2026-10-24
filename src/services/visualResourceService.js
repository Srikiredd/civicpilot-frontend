import api from "./apiClient";

export async function createVisualResource(payload) {
  const { data } = await api.post("/api/visual-resources", payload);
  return data;
}

export async function getVisualResource(id) {
  const { data } = await api.get(`/api/visual-resources/${id}`);
  return data;
}

export async function getVisualResourcesByService(serviceId, language = "English") {
  const { data } = await api.get(`/api/visual-resources/service/${serviceId}`, { params: { language } });
  return data;
}

export async function getStaticVisualResources(serviceId, language = "English") {
  const { data } = await api.get(`/api/visual-resources/service/${serviceId}/static`, { params: { language } });
  return data;
}

export async function getJourneyVisualResources(journeyId, language = "English") {
  const { data } = await api.get(`/api/visual-resources/journey/${journeyId}`, { params: { language } });
  return data;
}

export async function getStaticJourneyVisualResources(journeyId, language = "English") {
  const { data } = await api.get(`/api/visual-resources/journey/${journeyId}/static`, { params: { language } });
  return data;
}

export async function generateAiVisualContent(journeyId) {
  const { data } = await api.post(`/api/ai-visual-content/journey/${journeyId}`);
  return data;
}

export async function saveAiVisuals(journeyId, aiVisualContents) {
  const { data } = await api.post(`/api/visual-resources/journey/${journeyId}/ai`, aiVisualContents);
  return data;
}
