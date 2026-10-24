export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  if (!error.response) return "Unable to reach CivicPilot backend. Make sure Spring Boot is running on http://localhost:8080.";
  const status = error.response.status;
  const data = error.response.data;
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return data?.message || "The requested resource was not found.";
  if (status >= 500) return "The CivicPilot server encountered an error. Please try again.";
  return data?.message || data?.error || fallback;
}
export function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return value.split(",").map(v => v.trim()).filter(Boolean);
  return [];
}
export function displayName(user) {
  return user?.name || user?.fullName || user?.username || user?.email?.split("@")[0] || "Citizen";
}
