import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/sidebar.css";
import "./styles/dashboard.css";
import "./styles/forms.css";
import "./styles/cards.css";
import "./styles/journey.css";
import "./styles/visual-guide.css";
import "./styles/readiness.css";
import "./styles/responsive.css";
import "./styles/landing.css";
import "./styles/civicpilot.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
