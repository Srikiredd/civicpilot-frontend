import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const PUBLIC_PATHS = ["/", "/login", "/register"];

export default function AppLayout({ children }) {
  const location = useLocation();
  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  return (
    <div className={isPublic ? "app-shell public-shell" : "app-shell"}>
      {!isPublic && <Sidebar />}

      <div className={isPublic ? "app-main public-main" : "app-main"}>
        {!isPublic && <Navbar />}

        <main className={isPublic ? "" : "page-container"}>
          {children}
        </main>
      </div>
    </div>
  );
}
