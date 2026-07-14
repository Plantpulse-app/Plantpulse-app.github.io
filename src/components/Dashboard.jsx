import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  LogOut, 
  Activity, 
  Award, 
  ShieldAlert, 
  ThermometerSun, 
  Leaf, 
  Droplets, 
  Sprout, 
  Database, 
  RefreshCw, 
  Maximize2,
  CheckCircle,
  AlertTriangle,
  History,
  Sun,
  Moon
} from "lucide-react";
import "../css/Dashboard.css";

// Crop images
import apple from "../assets/images/Crops/apple.jpg";
import banana from "../assets/images/Crops/banana.jpg";
import coffee from "../assets/images/Crops/coffee.jpg";
import cotton from "../assets/images/Crops/cotton.jpg";
import rice from "../assets/images/Crops/rice.jpg";
import maize from "../assets/images/Crops/maize.jpg";

const MOCK_FARMS = [
  {
    id: "farm-1",
    name: "North Valley Orchard",
    crop: "Apple",
    image: apple,
    status: "Healthy",
    growth: 78,
    moisture: 62,
    temperature: 21,
    lastAction: "Drip Irrigation Active",
    rainfall: { current: 820, target: 900 },
    nutrients: [
      { name: "Nitrogen (N)", val: 65, status: "Optimal" },
      { name: "Phosphorus (P)", val: 42, status: "Low" },
      { name: "Potassium (K)", val: 88, status: "Optimal" }
    ],
    logs: [
      "12:10 PM - Automated soil scan complete",
      "10:00 AM - Nitrogen levels stable",
      "Yesterday - Leaf scab risk analysis run: 0.2%"
    ]
  },
  {
    id: "farm-2",
    name: "Sunshine Plantation",
    crop: "Banana",
    image: banana,
    status: "Monitoring",
    growth: 52,
    moisture: 75,
    temperature: 29,
    lastAction: "Humidifier ON",
    rainfall: { current: 1450, target: 1600 },
    nutrients: [
      { name: "Nitrogen (N)", val: 95, status: "Optimal" },
      { name: "Phosphorus (P)", val: 78, status: "Optimal" },
      { name: "Potassium (K)", val: 120, status: "Optimal" }
    ],
    logs: [
      "11:45 PM - Temperature sensor check",
      "08:30 AM - Foliage moisture check done",
      "2 days ago - Soil pH adjusted to 6.2"
    ]
  },
  {
    id: "farm-3",
    name: "Highland Estate",
    crop: "Coffee",
    image: coffee,
    status: "Optimal",
    growth: 90,
    moisture: 58,
    temperature: 19,
    lastAction: "Shade filter adjusting",
    rainfall: { current: 1950, target: 2000 },
    nutrients: [
      { name: "Nitrogen (N)", val: 40, status: "Low" },
      { name: "Phosphorus (P)", val: 30, status: "Low" },
      { name: "Potassium (K)", val: 95, status: "Optimal" }
    ],
    logs: [
      "12:05 PM - Light intensity report logged",
      "09:12 AM - Canopy humidity checked: 82%",
      "3 days ago - Rust disease scan: Negative"
    ]
  },
  {
    id: "farm-4",
    name: "Delta Cotton Fields",
    crop: "Cotton",
    image: cotton,
    status: "Needs Attention",
    growth: 35,
    moisture: 38,
    temperature: 33,
    lastAction: "Urgent Watering Recommended",
    rainfall: { current: 400, target: 650 },
    nutrients: [
      { name: "Nitrogen (N)", val: 28, status: "Critically Low" },
      { name: "Phosphorus (P)", val: 25, status: "Low" },
      { name: "Potassium (K)", val: 75, status: "Optimal" }
    ],
    logs: [
      "12:28 PM - Low moisture threshold alert",
      "10:15 AM - Automated drip controller malfunction",
      "Yesterday - Soil compaction analysis complete"
    ]
  },
  {
    id: "farm-5",
    name: "Riverside Paddy",
    crop: "Rice",
    image: rice,
    status: "Healthy",
    growth: 64,
    moisture: 92,
    temperature: 28,
    lastAction: "Water gate open 15%",
    rainfall: { current: 2200, target: 2400 },
    nutrients: [
      { name: "Nitrogen (N)", val: 80, status: "Optimal" },
      { name: "Phosphorus (P)", val: 60, status: "Optimal" },
      { name: "Potassium (K)", val: 110, status: "Optimal" }
    ],
    logs: [
      "12:00 PM - Inflow volume adjustment",
      "08:15 AM - Water temperature telemetry: 27.2°C",
      "Yesterday - Stem borer warning active in region"
    ]
  },
  {
    id: "farm-6",
    name: "Grand Prairie Ridge",
    crop: "Maize",
    image: maize,
    status: "Healthy",
    growth: 45,
    moisture: 68,
    temperature: 26,
    lastAction: "Soil aerators running",
    rainfall: { current: 710, target: 800 },
    nutrients: [
      { name: "Nitrogen (N)", val: 75, status: "Optimal" },
      { name: "Phosphorus (P)", val: 55, status: "Optimal" },
      { name: "Potassium (K)", val: 90, status: "Optimal" }
    ],
    logs: [
      "11:15 AM - Wind speed sensor check: 14km/h",
      "06:00 AM - Nitrates telemetry refreshed",
      "Yesterday - Corn borer AI drone flight complete"
    ]
  }
];

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState(MOCK_FARMS);
  const [farmTabs, setFarmTabs] = useState({}); // farmId -> "sprout" | "droplets" | "database"
  const [activeMobileCard, setActiveMobileCard] = useState(null); // farmId or null
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

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

  // Initialize tabs to "sprout"
  useEffect(() => {
    const initialTabs = {};
    farms.forEach(f => {
      initialTabs[f.id] = "sprout";
    });
    setFarmTabs(initialTabs);
  }, []);

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  // Trigger brief floating notifications
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simulate automated farming updates
  const simulateTelemetryTick = () => {
    setIsSimulating(true);
    
    // Choose 1-2 random farms to modify
    setFarms(prevFarms => {
      return prevFarms.map((farm, idx) => {
        // 50% chance of being updated
        if (Math.random() > 0.5) {
          const moistureDiff = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const tempDiff = Math.floor(Math.random() * 3) - 1; // -1 to +1
          const newMoisture = Math.max(10, Math.min(100, farm.moisture + moistureDiff));
          const newTemp = Math.max(10, Math.min(45, farm.temperature + tempDiff));
          const growthInc = farm.growth < 100 && Math.random() > 0.6 ? 1 : 0;
          
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const newLog = `${timeStr} - Live Update: Soil Moisture ${newMoisture}%, Temp ${newTemp}°C`;
          
          let updatedStatus = farm.status;
          if (newMoisture < 45) {
            updatedStatus = "Needs Attention";
          } else if (newMoisture > 90 && farm.crop !== "Rice") {
            updatedStatus = "Monitoring";
          } else {
            updatedStatus = "Healthy";
          }

          return {
            ...farm,
            moisture: newMoisture,
            temperature: newTemp,
            growth: farm.growth + growthInc,
            status: updatedStatus,
            logs: [newLog, ...farm.logs.slice(0, 2)]
          };
        }
        return farm;
      });
    });

    setTimeout(() => {
      setIsSimulating(false);
      showToast("Farms telemetry updated successfully via satellite link.");
    }, 600);
  };

  const setTab = (farmId, tab) => {
    setFarmTabs(prev => ({ ...prev, [farmId]: tab }));
  };

  const toggleMobileCard = (farmId) => {
    if (activeMobileCard === farmId) {
      setActiveMobileCard(null);
    } else {
      setActiveMobileCard(farmId);
    }
  };

  // Fallback initial
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  // Calculate metrics dynamically
  const avgGrowth = Math.round(farms.reduce((acc, f) => acc + f.growth, 0) / farms.length);
  const avgMoisture = Math.round(farms.reduce((acc, f) => acc + f.moisture, 0) / farms.length);
  const attentionCount = farms.filter(f => f.status === "Needs Attention").length;

  return (
    <div className={`dashboard-page ${theme === "light" ? "light-theme" : ""}`}>
      <div className="dashboard-bg" />

      {toastMessage && (
        <div className="dashboard-toast">
          <Activity size={18} className="spin-slow" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-title">
            <div className="title-row">
              <Leaf className="logo-icon" />
              <h1>Plant Pulse Command Center</h1>
            </div>
            <p>Welcome back to your smart farming advisor dashboard. Live sensor monitoring active.</p>
          </div>
          <div className="dashboard-actions">
            <button className="dash-btn dash-btn-home" onClick={() => navigate("/")}>
              <ArrowLeft size={18} /> Home
            </button>
            <button 
              className={`dash-btn dash-btn-simulate ${isSimulating ? "simulating" : ""}`} 
              onClick={simulateTelemetryTick}
              disabled={isSimulating}
              title="Click to fetch live weather & moisture updates for crop fields"
            >
              <RefreshCw size={18} className={isSimulating ? "spin-icon" : ""} /> 
              {isSimulating ? "Fetching..." : "Fetch Live Updates"}
            </button>
            <button 
              className="dash-btn dash-btn-theme" 
              onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <button className="dash-btn dash-btn-logout" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Top Summary Bar */}
        <div className="dashboard-summary-bar">
          <div className="user-profile-widget">
            <div className="user-avatar-sm">{userInitial}</div>
            <div className="user-info-sm">
              <h4>Farmer Account</h4>
              <p>{user?.email || "farmer@plantpulse.com"}</p>
            </div>
          </div>
          <div className="pulse-network-status">
            <span className="pulse-dot animate-pulse-glow" />
            <span className="pulse-text">System Link: Active (6 Farm Channels Connected)</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon-wrapper progress-cyan">
              <Sprout size={24} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-title">Average Growth</div>
              <div className="stat-card-value">{avgGrowth}%</div>
              <div className="stat-card-desc">Average maturity stage across active crop sectors.</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon-wrapper progress-blue">
              <Droplets size={24} />
            </div>
            <div className="stat-card-info">
              <div className="stat-card-title">Mean Soil Moisture</div>
              <div className="stat-card-value">{avgMoisture}%</div>
              <div className="stat-card-desc">Overall moisture retention from IoT ground probe array.</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon-wrapper progress-orange">
              {attentionCount > 0 ? (
                <ShieldAlert size={24} className="alert-shake" />
              ) : (
                <CheckCircle size={24} />
              )}
            </div>
            <div className="stat-card-info">
              <div className="stat-card-title">Sectors Needing Action</div>
              <div className="stat-card-value" style={{ color: attentionCount > 0 ? "#fa5757" : "#00e676" }}>
                {attentionCount}
              </div>
              <div className="stat-card-desc">Sectors reporting metrics below optimal health threshold.</div>
            </div>
          </div>
        </div>

        {/* Main Crop Farms Hub */}
        <section className="crop-farms-section">
          <div className="section-header">
            <h2>🌿 Live Smart Farm Monitors</h2>
            <p className="desktop-hint">Hover over any farm card to see rainfalls, nutrients, and telemetry logs.</p>
            <p className="mobile-hint">Tap any farm card to toggle rainfall trackers, nutrient charts, and telemetry logs.</p>
          </div>

          <div className="farms-grid">
            {farms.map((farm) => {
              const currentTab = farmTabs[farm.id] || "sprout";
              const isMobileActive = activeMobileCard === farm.id;

              return (
                <div 
                  key={farm.id} 
                  className={`farm-card ${isMobileActive ? "mobile-active" : ""}`}
                  onClick={() => toggleMobileCard(farm.id)}
                >
                  {/* Card Background Image */}
                  <div className="farm-card-image-bg" style={{ backgroundImage: `url(${farm.image})` }}>
                    <div className="farm-card-gradient-overlay" />
                  </div>

                  {/* Standard Face Content */}
                  <div className="farm-card-content">
                    <div className="farm-card-header">
                      <span className={`status-badge badge-${farm.status.toLowerCase().replace(" ", "-")}`}>
                        <span className="status-badge-dot" />
                        {farm.status}
                      </span>
                      <span className="crop-badge">{farm.crop}</span>
                    </div>

                    <div className="farm-card-body">
                      <h3>{farm.name}</h3>
                      <div className="quick-metrics">
                        <div className="q-metric">
                          <Sprout size={14} />
                          <span>{farm.growth}% Grown</span>
                        </div>
                        <div className="q-metric">
                          <Droplets size={14} />
                          <span>{farm.moisture}% Moisture</span>
                        </div>
                      </div>
                    </div>

                    <div className="mobile-tap-hint">
                      <Maximize2 size={14} />
                      <span>{isMobileActive ? "Close Details" : "Tap to inspect"}</span>
                    </div>
                  </div>

                  {/* Interactive Details Hover Overlay */}
                  <div className="farm-card-overlay" onClick={(e) => e.stopPropagation()}>
                    <div className="overlay-header">
                      <h4>{farm.name}</h4>
                      <p>Sensing Channel ID: {farm.id}</p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="overlay-tabs">
                      <button 
                        className={`tab-btn ${currentTab === "sprout" ? "active" : ""}`}
                        onClick={() => setTab(farm.id, "sprout")}
                        title="Live Telemetry Updates"
                      >
                        <Sprout size={16} />
                        <span>Live Feed</span>
                      </button>
                      <button 
                        className={`tab-btn ${currentTab === "droplets" ? "active" : ""}`}
                        onClick={() => setTab(farm.id, "droplets")}
                        title="Rainfall Indicators"
                      >
                        <Droplets size={16} />
                        <span>Rainfall</span>
                      </button>
                      <button 
                        className={`tab-btn ${currentTab === "database" ? "active" : ""}`}
                        onClick={() => setTab(farm.id, "database")}
                        title="Nutrient Levels Graph"
                      >
                        <Database size={16} />
                        <span>NPK</span>
                      </button>
                    </div>

                    {/* Tab Panels */}
                    <div className="overlay-tab-content">
                      {currentTab === "sprout" && (
                        <div className="tab-pane-sprout">
                          <div className="pane-row">
                            <div className="pane-growth-circle">
                              <svg width="48" height="48" viewBox="0 0 36 36">
                                <circle className="circle-bg" cx="18" cy="18" r="15.915" />
                                <circle 
                                  className="circle-fill" 
                                  cx="18" 
                                  cy="18" 
                                  r="15.915" 
                                  strokeDasharray={`${farm.growth} ${100 - farm.growth}`}
                                  strokeDashoffset="25"
                                />
                              </svg>
                              <div className="circle-text">{farm.growth}%</div>
                            </div>
                            <div className="pane-telemetry-metrics">
                              <div className="p-metric">
                                <span className="p-label">Soil Moisture:</span>
                                <span className="p-val">{farm.moisture}%</span>
                              </div>
                              <div className="p-metric">
                                <span className="p-label">Soil Temp:</span>
                                <span className="p-val">{farm.temperature}°C</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="last-action-feed">
                            <strong>Current Stage:</strong>
                            <p>{farm.lastAction}</p>
                          </div>

                          <div className="sensor-logs-container">
                            <div className="logs-title">
                              <History size={12} />
                              <span>Live Sensor Log</span>
                            </div>
                            <div className="logs-scroller">
                              {farm.logs.map((log, lIdx) => (
                                <div key={lIdx} className="log-line">{log}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentTab === "droplets" && (
                        <div className="tab-pane-rainfall">
                          <div className="rainfall-metrics">
                            <div className="rain-level">
                              <span className="lbl">Current Rain</span>
                              <strong className="val">{farm.rainfall.current}mm</strong>
                            </div>
                            <div className="rain-target">
                              <span className="lbl">Optimal Target</span>
                              <strong className="val">{farm.rainfall.target}mm</strong>
                            </div>
                          </div>

                          {/* Graphical Wave Water Tank */}
                          <div className="water-tank-container">
                            <div className="water-tank-glass">
                              <div 
                                className="water-tank-fluid" 
                                style={{ height: `${Math.min((farm.rainfall.current / farm.rainfall.target) * 100, 100)}%` }}
                              >
                                <div className="fluid-wave" />
                              </div>
                              <div className="tank-cap">
                                {Math.round((farm.rainfall.current / farm.rainfall.target) * 100)}%
                              </div>
                            </div>
                          </div>

                          <p className="rainfall-status-desc">
                            {farm.rainfall.current >= farm.rainfall.target 
                              ? "✓ Precipitation optimal. Supplementary drip turned off." 
                              : "⚠ Rainfall below target. Automating micro-drip emitters."}
                          </p>
                        </div>
                      )}

                      {currentTab === "database" && (
                        <div className="tab-pane-nutrients">
                          <h5>NPK Soil Nutrient Profiles</h5>
                          
                          <div className="npk-vertical-bar-chart">
                            {farm.nutrients.map((nut) => {
                              const maxVal = 130;
                              const pct = Math.min((nut.val / maxVal) * 100, 100);
                              
                              let colorClass = "nut-optimal";
                              if (nut.status.includes("Low")) colorClass = "nut-low";
                              if (nut.status.includes("Critically")) colorClass = "nut-critical";

                              return (
                                <div key={nut.name} className="npk-bar-item">
                                  <div className="npk-bar-track">
                                    <div 
                                      className={`npk-bar-fill ${colorClass}`} 
                                      style={{ height: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="npk-bar-value">{nut.val}</span>
                                  <span className="npk-bar-name">{nut.name.split(" ")[0]}</span>
                                  <span className={`npk-bar-status ${colorClass}-text`}>{nut.status}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Activity Card */}
        <div className="recent-activity-card">
          <h3><Activity size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} /> Smart Advisories & Activities</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-details">
                <p>Apple Scab detected & treatment calculated</p>
                <span>Today, 10:24 AM</span>
              </div>
              <span className="activity-badge badge-success">
                <ShieldAlert size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} /> AI Model Success
              </span>
            </div>
            <div className="activity-item">
              <div className="activity-details">
                <p>Weather Sync: Precipitation levels forecast high for next 48h</p>
                <span>Yesterday, 4:15 PM</span>
              </div>
              <span className="activity-badge badge-info">
                <ThermometerSun size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Weather API
              </span>
            </div>
            <div className="activity-item">
              <div className="activity-details">
                <p>Nutrient recipe formulated for Banana plantation</p>
                <span>June 8, 2026, 1:12 PM</span>
              </div>
              <span className="activity-badge badge-success">
                <Award size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Crop Advisory
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;