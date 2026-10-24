import React from "react";
import { useCallback, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import SplashScreen from "./components/layout/SplashScreen";
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
  const { isAuthenticated } = useAuth();
  const [ready, setReady] = useState(false);

  const finishSplash = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <>
      {!ready && <SplashScreen onDone={finishSplash} />}

      <div className={ready ? "app-ready" : "app-hidden"}>
        <AppLayout key={isAuthenticated ? "authenticated" : "guest"}>
          <ErrorBoundary><AppRoutes /></ErrorBoundary>
        </AppLayout>
      </div>
    </>
  );
}
