import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./App.css";
import SanAgroPage from "./components/SanAgroPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import FileUploader from "./components/FileUploader.jsx";
import Home from "./components/home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./components/login.jsx";
import Weather from "./components/Weather.jsx";
import PageLoader from "./components/PageLoader.jsx";

const AppRoutes = () => {
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    // Show page loader on route changes
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600); // Quick premium route transition loader
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {pageLoading && <PageLoader />}
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <FileUploader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Weatherforcast"
          element={
            <ProtectedRoute>
              <Weather />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guidepage"
          element={
            <ProtectedRoute>
              <SanAgroPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", padding: "4rem", color: "#fff", background: "#111", minHeight: "100vh" }}>
              <h1 style={{ fontSize: "4rem" }}>404</h1>
              <p style={{ fontSize: "1.2rem", color: "#aaa" }}>Page not found.</p>
              <a href="#/" style={{ color: "#48bb78", textDecoration: "underline", fontSize: "1rem" }}>← Go back home</a>
            </div>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show initial splash loader on website first load
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <PageLoader isSplash={true} />;
  }

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;