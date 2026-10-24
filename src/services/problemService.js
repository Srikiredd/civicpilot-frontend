import api from "./apiClient";
export async function analyzeProblem(payload) { const { data } = await api.post("/api/problems/analyze", payload); return data; }
