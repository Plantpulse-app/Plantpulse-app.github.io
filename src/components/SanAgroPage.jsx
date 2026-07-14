import { useState, useEffect } from "react";
import { GitCompare, Leaf, ArrowLeft, Sun, Moon, CheckCircle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "../css/sanagro.css";


  ///  Crop Images

import apple from "../assets/images/Crops/apple.jpg";
import banana from "../assets/images/Crops/banana.jpg";
import blackgram from "../assets/images/Crops/blackgram.jpg";
import cabbage from "../assets/images/Crops/cabbage.jpg";
import chickpea from "../assets/images/Crops/chickpea.jpg";
import coconut from "../assets/images/Crops/coconut.jpg";
import coffee from "../assets/images/Crops/coffee.jpg";
import cotton from "../assets/images/Crops/cotton.jpg";
import grapes from "../assets/images/Crops/grapes.jpg";
import jute from "../assets/images/Crops/jute.jpg";
import kidneybeans from "../assets/images/Crops/kidneybeans.jpg";
import lentil from "../assets/images/Crops/lentil.jpg";
import maize from "../assets/images/Crops/maize.jpg";
import mango from "../assets/images/Crops/mango.jpg";
import mothbeans from "../assets/images/Crops/mothbeans.jpg";
import mungbean from "../assets/images/Crops/mungbean.jpg";
import muskmelon from "../assets/images/Crops/muskmelon.jpg";
import orange from "../assets/images/Crops/orange.jpg";
import papaya from "../assets/images/Crops/papaya.jpg";
import pigeonpeas from "../assets/images/Crops/pigeonpeas.jpg";
import pomegranate from "../assets/images/Crops/pomegran.jpg";
import rice from "../assets/images/Crops/rice.jpg";
import watermelon from "../assets/images/Crops/watermelon.jpg";

  ///  Image Map

const CROP_IMAGES = {
  Apple: apple,
  Banana: banana,
  Blackgram: blackgram,
  Cabbage: cabbage,
  Chickpea: chickpea,
  Coconut: coconut,
  Coffee: coffee,
  Cotton: cotton,
  Grapes: grapes,
  Jute: jute,
  Kidneybeans: kidneybeans,
  Lentil: lentil,
  Maize: maize,
  Mango: mango,
  Mothbeans: mothbeans,
  Mungbean: mungbean,
  Muskmelon: muskmelon,
  Orange: orange,
  Papaya: papaya,
  Pigeonpeas: pigeonpeas,
  Pomegranate: pomegranate,
  Rice: rice,
  Watermelon: watermelon,
};


// crop data
const CROPS = Object.keys(CROP_IMAGES).map((name) => ({
  name,
  N: Math.floor(Math.random() * 120) + 20,
  P: Math.floor(Math.random() * 140) + 20,
  K: Math.floor(Math.random() * 200) + 20,
  R: Math.floor(Math.random() * 250) + 30,
}));

export default function SanAgroPage() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("plantpulse-theme") || "dark";
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("plantpulse-theme", theme);
  }, [theme]);

  const [activeCrop, setActiveCrop] = useState(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState([]);

  const selectCrop = (crop) => {
    if (!isCompareMode) {
      setActiveCrop(crop);
      return;
    }

    setCompareSelection((prev) => {
      const exists = prev.find((c) => c.name === crop.name);
      if (exists) {
        return prev.filter((c) => c.name !== crop.name);
      }
      // Limit comparison to 5 crops for readability
      if (prev.length < 5) {
        return [...prev, crop];
      }
      return [...prev.slice(1), crop];
    });
  };

  const toggleCompareMode = () => {
    setIsCompareMode((v) => !v);
    setActiveCrop(null);
    setCompareSelection([]);
  };

  return (
    <div className={`sanagro-layout ${theme === "light" ? "light-theme" : ""}`}>
      {/* Background radial glow spots */}
      <div className="sanagro-bg" />

      {/* Header */}
      <header className="sanagro-header">
        <div className="header-left">
          <Leaf className="logo-icon animate-pulse-glow" />
          <h1>Crop Intelligence Guide</h1>
        </div>

        <div className="header-actions">
          <button className="nav-btn btn-home" onClick={() => navigate("/")} title="Go to Home">
            <ArrowLeft size={16} /> <span className="btn-text">Home</span>
          </button>

          <button
            className={`nav-btn btn-compare ${isCompareMode ? "active" : ""}`}
            onClick={toggleCompareMode}
            title="Compare selected crops"
            style={{ position: "relative" }}
          >
            <GitCompare size={16} /> <span className="btn-text">Compare</span>
            {compareSelection.length > 0 && (
              <span className="compare-badge">{compareSelection.length}</span>
            )}
          </button>

          <button
            className="nav-btn btn-theme"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span className="btn-text">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </header>

      {/* Main Content (Center Aligned) */}
      <main className="sanagro-main">
        {/* Comparison Dashboard (Dynamic updates) */}
        {isCompareMode && (
          <div className="comparison-section glass-card animate-fade-in">
            <div className="comparison-header">
              <div>
                <h2>Multi-Crop Comparison Panel</h2>
                <p>Select multiple crops from the catalog below to compare nutrient and precipitation profiles.</p>
              </div>
              {compareSelection.length > 0 && (
                <button className="clear-btn" onClick={() => setCompareSelection([])}>
                  Clear Selection
                </button>
              )}
            </div>

            {compareSelection.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart
                    data={[
                      { name: "Nitrogen (N)", ...compareSelection.reduce((acc, c) => ({ ...acc, [c.name]: c.N }), {}) },
                      { name: "Phosphorus (P)", ...compareSelection.reduce((acc, c) => ({ ...acc, [c.name]: c.P }), {}) },
                      { name: "Potassium (K)", ...compareSelection.reduce((acc, c) => ({ ...acc, [c.name]: c.K }), {}) },
                      { name: "Rainfall (R)", ...compareSelection.reduce((acc, c) => ({ ...acc, [c.name]: c.R }), {}) },
                    ]}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--overlay-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "12px",
                        color: "var(--text-main)",
                      }}
                    />
                    <Legend />
                    {compareSelection.map((crop, index) => {
                      const colors = ["#00e676", "#3182ce", "#ecc94b", "#fa5757", "#9f7aec"];
                      return (
                        <Bar
                          key={crop.name}
                          dataKey={crop.name}
                          fill={colors[index % colors.length]}
                          radius={[6, 6, 0, 0]}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-compare-state">
                <GitCompare size={48} className="placeholder-icon" />
                <p>No crops selected. Tap crop cards below to start comparing.</p>
              </div>
            )}
          </div>
        )}

        {/* Crop Grid Catalog */}
        <div className="catalog-section">
          <div className="section-title">
            <h2>🌿 CROP LIST</h2>
            <p>
              {isCompareMode
                ? "Select up to 5 crops to compare metrics side-by-side."
                : "Click on the crop card to reveal quick stats"}
            </p>
          </div>

          <div className="sanagro-crop-grid">
            {CROPS.map((crop) => {
              const isSelected = compareSelection.some((c) => c.name === crop.name);
              return (
                <div
                  key={crop.name}
                  className={`crop-card glass-card ${isSelected ? "selected" : ""}`}
                  onClick={() => selectCrop(crop)}
                >
                  {/* Image Wrapper */}
                  <div className="crop-card-img-wrapper">
                    <img src={CROP_IMAGES[crop.name]} alt={crop.name} className="crop-image" />
                    <div className="crop-image-overlay" />
                    
                    {isCompareMode && isSelected && (
                      <div className="selection-badge">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>

                  {/* Glassy Info Panel */}
                  <div className="crop-card-info-area">
                    <div className="info-header-row">
                      <h3>{crop.name}</h3>
                      <span className="view-stats-text">Stats</span>
                    </div>

                    <div className="crop-card-stats-slide">
                      <div className="crop-stat-bar">
                        <div className="stat-label">
                          <span>Nitrogen (N)</span>
                          <span>{crop.N} mg/kg</span>
                        </div>
                        <div className="stat-track">
                          <div className="stat-fill n-fill" style={{ width: `${Math.min((crop.N / 150) * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="crop-stat-bar">
                        <div className="stat-label">
                          <span>Phosphorus (P)</span>
                          <span>{crop.P} mg/kg</span>
                        </div>
                        <div className="stat-track">
                          <div className="stat-fill p-fill" style={{ width: `${Math.min((crop.P / 150) * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="crop-stat-bar">
                        <div className="stat-label">
                          <span>Potassium (K)</span>
                          <span>{crop.K} mg/kg</span>
                        </div>
                        <div className="stat-track">
                          <div className="stat-fill k-fill" style={{ width: `${Math.min((crop.K / 220) * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="crop-stat-bar">
                        <div className="stat-label">
                          <span>Rainfall (R)</span>
                          <span>{crop.R} mm</span>
                        </div>
                        <div className="stat-track">
                          <div className="stat-fill r-fill" style={{ width: `${Math.min((crop.R / 300) * 100, 100)}%` }} />
                        </div>
                      </div>

                      <span className="card-tap-instruction">
                        {isCompareMode ? "Tap to compare" : "Tap for details chart"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Detail Analysis Modal */}
      {activeCrop && !isCompareMode && (
        <div className="modal-overlay" onClick={() => setActiveCrop(null)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveCrop(null)}>
              &times;
            </button>
            
            <div className="modal-header">
              <img src={CROP_IMAGES[activeCrop.name]} alt={activeCrop.name} className="modal-crop-image" />
              <div>
                <h2>{activeCrop.name} Analysis</h2>
                <p>Detailed distribution of soil nutrients and rainfall guide</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="chart-wrapper">
                <h3>Vitals Breakdown</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={[
                      { label: "Nitrogen (N)", value: activeCrop.N, fill: "#00e676" },
                      { label: "Phosphorus (P)", value: activeCrop.P, fill: "#3182ce" },
                      { label: "Potassium (K)", value: activeCrop.K, fill: "#ecc94b" },
                      { label: "Rainfall (R)", value: activeCrop.R, fill: "#38b2ac" },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                    <XAxis dataKey="label" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--overlay-bg)",
                        border: "1px solid var(--card-border)",
                        color: "var(--text-main)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#00e676" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="crop-details-stats">
                <h3>Vitals Scorecard</h3>
                <div className="indicator-grid">
                  <div className="indicator-card">
                    <span className="indicator-name">Nitrogen (N)</span>
                    <strong className="indicator-val">{activeCrop.N} mg/kg</strong>
                    <span className="indicator-status">Optimal: 40-120</span>
                  </div>
                  <div className="indicator-card">
                    <span className="indicator-name">Phosphorus (P)</span>
                    <strong className="indicator-val">{activeCrop.P} mg/kg</strong>
                    <span className="indicator-status">Optimal: 35-95</span>
                  </div>
                  <div className="indicator-card">
                    <span className="indicator-name">Potassium (K)</span>
                    <strong className="indicator-val">{activeCrop.K} mg/kg</strong>
                    <span className="indicator-status">Optimal: 90-190</span>
                  </div>
                  <div className="indicator-card">
                    <span className="indicator-name">Rainfall (R)</span>
                    <strong className="indicator-val">{activeCrop.R} mm</strong>
                    <span className="indicator-status">Optimal: 120-260</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-footer-close-btn" onClick={() => setActiveCrop(null)}>
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
