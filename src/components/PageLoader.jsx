// src/components/PageLoader.jsx
import React from "react";
import "../css/PageLoader.css";

export default function PageLoader({ isSplash = false }) {
  return (
    <div className={`global-loader-overlay ${isSplash ? "is-splash" : ""}`}>
      <div className="loader-content">
        <div className="loader-leaf-wrapper">
          <span className="loader-leaf" role="img" aria-label="leaf-logo">🌿</span>
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
        </div>
        <h1 className="loader-title">Plant Pulse</h1>
        <p className="loader-subtitle">
          {isSplash ? "Cultivating Innovation & Sustainability..." : "Loading Page Assets..."}
        </p>
        <div className="loader-bar-container">
          <div className="loader-bar-progress"></div>
        </div>
      </div>
    </div>
  );
}
