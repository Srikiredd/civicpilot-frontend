import api from "./apiClient";
export async function getGovernmentServices() { const { data } = await api.get("/api/government-services"); return data; }
