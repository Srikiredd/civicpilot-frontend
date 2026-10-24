import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Dashboard from "../pages/dashboard/Dashboard";
import ProblemAnalysisPage from "../pages/ProblemAnalysisPage";
import ServiceMatchingPage from "../pages/journeys/ServiceMatchingPage";
import JourneysPage from "../pages/journeys/JourneysPage";
import JourneyPage from "../pages/journeys/JourneyPage";
import JourneyExperiencePage from "../pages/journeys/JourneyExperiencePage";
import VisualGuidancePage from "../pages/visual-guidance/VisualGuidancePage";
import ReadinessPage from "../pages/readiness/ReadinessPage";
import GuidanceModesPage from "../pages/GuidanceModesPage";
import ReadinessHubPage from "../pages/ReadinessHubPage";
import ProfilePage from "../pages/profile/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problem-analysis" element={<ProblemAnalysisPage />} />
        <Route path="/service-matching/:analysisId" element={<ServiceMatchingPage />} />
        <Route path="/journeys" element={<JourneysPage />} />
        <Route path="/guidance" element={<GuidanceModesPage />} />
        <Route path="/readiness" element={<ReadinessHubPage />} />
        <Route path="/journeys/:journeyId" element={<JourneyPage />} />
        <Route
          path="/journeys/:journeyId/experience"
          element={<JourneyExperiencePage />}
        />
        <Route path="/visual-guidance/:serviceId" element={<VisualGuidancePage />} />
        <Route path="/readiness/:stepId" element={<ReadinessPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
