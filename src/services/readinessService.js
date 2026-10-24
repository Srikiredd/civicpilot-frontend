import api from "./apiClient";
export async function checkReadiness(payload) { const { data } = await api.post("/api/readiness/check", payload); return data; }
export async function getReadiness(id) { const { data } = await api.get(`/api/readiness/${id}`); return data; }
export async function getAllReadiness() { const { data } = await api.get("/api/readiness"); return data; }
