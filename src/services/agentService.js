import api from "./apiClient";

export async function startAgent(journeyId) {
  const { data } = await api.post(`/api/agent/journeys/${journeyId}/start`, null, { timeout: 120000 });
  return data;
}

export async function getAgentStatus(runId) {
  const { data } = await api.get(`/api/agent/runs/${runId}`, { timeout: 30000 });
  return data;
}

export async function uploadAgentDocument(runId, stepExecutionId, documentType, file) {
  const formData = new FormData();
  formData.append("documentType", documentType);
  formData.append("file", file);

  const { data } = await api.post(
    `/api/agent/runs/${runId}/steps/${stepExecutionId}/documents`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" }, timeout: 120000 }
  );

  return data;
}

export async function executeAgent(runId) {
  const { data } = await api.post(`/api/agent/runs/${runId}/execute`, null, { timeout: 120000 });
  return data;
}
