import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Weather.css";

import sunnyVideo from "../assets/video/sunny.mp4";
import rainVideo from "../assets/video/rain.mp4";
import cloudsVideo from "../assets/video/cloud.mp4";

/* 🌾 Crop Images */
import riceImg from "../assets/images/Crops/rice.jpg";
import maizeImg from "../assets/images/Crops/maize.jpg";
import cottonImg from "../assets/images/Crops/cotton.jpg";
import chickpeaImg from "../assets/images/Crops/chickpea.jpg";
import lentilImg from "../assets/images/Crops/lentil.jpg";
import watermelonImg from "../assets/images/Crops/watermelon.jpg";
import coconutImg from "../assets/images/Crops/coconut.jpg";

const cropImages = {
  Rice: riceImg,
  Maize: maizeImg,
  Cotton: cottonImg,
  Chickpea: chickpeaImg,
  Lentil: lentilImg,
  Watermelon: watermelonImg,
  Coconut: coconutImg,
};

/* 📋 Detailed Crop Cultivation Playbook Database */
const CROP_DETAILS = {
  Rice: {
    description: "Rice is the primary staple food crop in tropical regions. It is highly water-intensive and grows in clayey flooded fields.",
    temperature: "22°C - 32°C (Warm & Humid)",
    water: "Very High (150-300 cm or standing water)",
    soil: "Clayey or heavy loam (retains water)",
    sowing: "June - July (Monsoon onset)",
    harvesting: "November - December (Post-monsoon)",
    nutrients: "NPK (Nitrogen-heavy) & trace Zinc",
    tips: "Maintain standing water during vegetative stages. Drain field 2 weeks before harvesting."
  },
  Maize: {
    description: "Maize (Corn) is a versatile grain grown across varied climates. It requires well-drained fertile land and adequate sunshine.",
    temperature: "21°C - 27°C",
    water: "Moderate (50-100 cm rainfall)",
    soil: "Well-drained alluvial or red loam soils",
    sowing: "June - July (Kharif) or Oct - Nov (Rabi)",
    harvesting: "September - October or Feb - March",
    nutrients: "High Nitrogen, Phosphorus, Potassium & Zinc",
    tips: "Highly sensitive to waterlogging. Ensure excellent field drainage to prevent root damage."
  },
  Cotton: {
    description: "Cotton is a key industrial cash crop. It grows best in semi-arid regions and needs dry weather during harvest to protect the fiber.",
    temperature: "21°C - 30°C",
    water: "Low to Moderate (50-80 cm, drip-preferred)",
    soil: "Deep black clay soil (retains moisture)",
    sowing: "May - June (Kharif pre-monsoon)",
    harvesting: "October - December",
    nutrients: "Balanced NPK and trace Boron",
    tips: "Needs clear sunny days during boll-bursting stage to prevent staining and damage to cotton lint."
  },
  Chickpea: {
    description: "Chickpea (Gram) is an important winter pulse crop. It is highly drought-tolerant and increases soil nitrogen.",
    temperature: "15°C - 25°C (Cool climate)",
    water: "Low (requires light pre-sowing moisture)",
    soil: "Well-drained clayey or sandy loam alluvial soils",
    sowing: "October - November (Rabi season)",
    harvesting: "February - April",
    nutrients: "Phosphorus, sulfur & nitrogen-fixing inoculants",
    tips: "Avoid over-irrigation. Excessive soil moisture triggers root rot and reduces seed development."
  },
  Lentil: {
    description: "Lentil is a highly nutritious winter legume. It requires minimal water and thrives in drylands.",
    temperature: "15°C - 20°C",
    water: "Low (10-25 cm water requirements)",
    soil: "Light loam or deep sandy-loam red soils",
    sowing: "October - November (Rabi season)",
    harvesting: "March - April",
    nutrients: "Phosphorus and trace sulfur",
    tips: "Prepare a fine seedbed. Plant at shallow depths (3-4 cm) for quick and uniform seedling emergence."
  },
  Watermelon: {
    description: "Watermelon is a sweet, water-rich summer fruit requiring dry heat and high light levels to sweeten the flesh.",
    temperature: "24°C - 35°C (Frost-sensitive)",
    water: "Low to Moderate (drip irrigation is preferred)",
    soil: "Well-aerated sandy loam soils that heat up fast",
    sowing: "February - March (Zaid / Summer season)",
    harvesting: "May - June",
    nutrients: "Potassium, organic manure & phosphorus",
    tips: "Reduce watering as the fruit reaches maturity to boost sweetness and prevent fruit cracking."
  },
  Coconut: {
    description: "Coconut palm is a perennial coastal crop. It is salt-tolerant and requires high ambient humidity to thrive.",
    temperature: "22°C - 32°C (Humid tropical climate)",
    water: "High (150-250 cm evenly distributed)",
    soil: "Coastal sand, saline soils, or well-drained laterites",
    sowing: "June (Monsoon onset)",
    harvesting: "Year-round (every 45-60 days)",
    nutrients: "Potassium-rich fertilizers & sodium chloride",
    tips: "Maintain a spacing of 7.5 meters. Mulch palm bases with coir dust to conserve soil moisture."
  }
};

/* 🗺️ State Capitals (for state search) */
const STATE_CAPITALS = {
  kerala: { lat: 8.5241, lon: 76.9366 },
  maharashtra: { lat: 19.076, lon: 72.8777 },
  "west bengal": { lat: 22.5726, lon: 88.3639 },
  "tamil nadu": { lat: 13.0827, lon: 80.2707 },
  karnataka: { lat: 12.9716, lon: 77.5946 },
  rajasthan: { lat: 26.9124, lon: 75.7873 },
  punjab: { lat: 30.7333, lon: 76.7794 },
  odisha: { lat: 20.2961, lon: 85.8245 },
};

/* 🌱 AUTO SOIL DETECTION BASED ON MAP */
const detectSoilFromLocation = (lat, lon) => {
  if (lat >= 8 && lat <= 13 && lon >= 74 && lon <= 78) return "Laterite"; // Kerala
  if (lat >= 18 && lat <= 23 && lon >= 72 && lon <= 79) return "Black"; // Maharashtra
  if (lat >= 28 && lat <= 31 && lon >= 73 && lon <= 78) return "Alluvial"; // Punjab/Haryana
  if (lat >= 22 && lat <= 26 && lon >= 82 && lon <= 87) return "Red"; // Odisha
  if (lat >= 24 && lon <= 75) return "Sandy"; // Rajasthan
  return "Alluvial"; // default India
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [input, setInput] = useState("");
  const [soilType, setSoilType] = useState("Alluvial");
  const [autoSoil, setAutoSoil] = useState("");
  const [videoBg, setVideoBg] = useState(sunnyVideo);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [coords, setCoords] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(!!window.L);

  // Poll for Leaflet library load from index.html CDN to avoid race conditions
  useEffect(() => {
    if (window.L) return;
    const interval = setInterval(() => {
      if (window.L) {
        setLeafletLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const videoRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Force reload and play video on source changes (ensures cross-browser auto-play updates)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Playback prevented by browser autoplay policy:", error);
        });
      }
    }
  }, [videoBg]);

  /* 🎥 Background */
  const updateBackground = (clouds, rain) => {
    if (rain > 0) setVideoBg(rainVideo);
    else if (clouds > 60) setVideoBg(cloudsVideo);
    else setVideoBg(sunnyVideo);
  };

  /* 🌦 Weather fetch (REST API only) */
  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setCoords({ lat, lon });
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&temperature_unit=celsius&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,cloud_cover`
      );

      const json = await res.json();
      const c = json.current;

      const soil = detectSoilFromLocation(lat, lon);
      setAutoSoil(soil);
      setSoilType(soil);

      const data = {
        temperature: c.temperature_2m,
        feels_like: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        rainfall: c.precipitation,
        cloud_cover: c.cloud_cover,
      };

      setWeatherData(data);
      updateBackground(data.cloud_cover, data.rainfall);
      setErrorMsg("");
      setLoading(false);
    } catch {
      setErrorMsg("Weather service unavailable.");
      setLoading(false);
    }
  };

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* 📍 Auto detect location */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Bounding box filter for India regions
        if (latitude >= 6 && latitude <= 38 && longitude >= 68 && longitude <= 98) {
          fetchWeather(latitude, longitude);
        } else {
          setErrorMsg("Location outside India detected. Centered on New Delhi.");
          fetchWeather(28.6139, 77.2090);
        }
      },
      () => {
        setErrorMsg("Location access denied. Centered on New Delhi.");
        fetchWeather(28.6139, 77.2090); // Default fallback coordinates (New Delhi)
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 🗺️ Map initialization and sync (avoids React callback ref timing gotchas) */
  useEffect(() => {
    if (!leafletLoaded || !coords || !mapContainerRef.current || !window.L) return;

    const { lat, lon } = coords;

    // Destroy stale map if it exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = window.L.map(mapContainerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView([lat, lon], 10);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    window.L.circle([lat, lon], {
      color: "#00ffaa",
      fillColor: "#00ffaa",
      fillOpacity: 0.15,
      radius: 5000,
    }).addTo(map);

    markerRef.current = window.L.marker([lat, lon])
      .addTo(map)
      .bindPopup(
        `<b>Your Farming Area</b><br>5km Radius Activated<br>Lat: ${lat.toFixed(4)}<br>Lon: ${lon.toFixed(4)}`
      )
      .openPopup();

    mapRef.current = map;

    // Force Leaflet to recalculate container size
    const timer = setTimeout(() => map.invalidateSize(), 200);

    // Cleanup on unmount or when dependencies change
    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coords, leafletLoaded]);

  /* 🔍 City / State Search */
  const searchLocation = async () => {
    if (!input) return;
    setLoading(true);

    const key = input.trim().toLowerCase();

    if (STATE_CAPITALS[key]) {
      const { lat, lon } = STATE_CAPITALS[key];
      fetchWeather(lat, lon);
      return;
    }

    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          input
        )}&count=10`
      );
      const data = await res.json();

      if (data.results?.length) {
        // Filter for results specifically within India
        const indianResult = data.results.find(
          (r) => r.country_code === "IN" || r.country?.toLowerCase() === "india"
        );

        if (indianResult) {
          fetchWeather(indianResult.latitude, indianResult.longitude);
        } else {
          setErrorMsg("Location not found in India. Please search for an Indian region.");
          setLoading(false);
        }
      } else {
        setErrorMsg("Location not found.");
        setLoading(false);
      }
    } catch {
      setErrorMsg("Search failed.");
      setLoading(false);
    }
  };

  /* 🗓 Season */
  const getSeason = () => {
    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 10) return "Kharif";
    if (m >= 11 || m <= 3) return "Rabi";
    return "Zaid";
  };

  /* 🌾 Crop Logic (SOIL PRIORITY) */
  const getCrops = () => {
    if (soilType === "Black") return ["Cotton", "Chickpea"];
    if (soilType === "Laterite") return ["Coconut"];
    if (soilType === "Sandy") return ["Watermelon"];
    if (soilType === "Red") return ["Maize", "Lentil"];

    const season = getSeason();
    if (season === "Kharif") return ["Rice", "Maize"];
    if (season === "Rabi") return ["Chickpea", "Lentil"];
    return ["Maize"];
  };

  /* Auto sync selected crop details when recommendations list changes */
  const recommendedCrops = getCrops();
  useEffect(() => {
    if (recommendedCrops && recommendedCrops.length > 0) {
      if (!selectedCrop || !recommendedCrops.includes(selectedCrop)) {
        setSelectedCrop(recommendedCrops[0]);
      }
    } else {
      setSelectedCrop(null);
    }
  }, [soilType, weatherData, recommendedCrops, selectedCrop]);

  /* 🤖 Advisory */
  const getAdvisory = () => {
    if (soilType === "Laterite")
      return "Laterite soil detected within your area. Coconut palm and plantation systems are highly recommended.";
    if (soilType === "Black")
      return "Black soil contains rich moisture retention. Cotton and deep-rooted legumes are highly suitable.";
    if (soilType === "Sandy")
      return "Sandy soil has extremely fast drainage. Frequent irrigation or Zaid crops (like Watermelon) are required.";
    return "Weather and Alluvial soil parameters are highly suited for cereal crops and seasonal farming.";
  };

  return (
    <div className={`weather-container ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <video ref={videoRef} key={videoBg} autoPlay loop muted playsInline className="background-video" src={videoBg} />
      <div className="overlay" />

      {/* Floating fixed controls */}
      <button className="back-home" onClick={() => navigate("/")} title="Back to Home">
        🏠
      </button>

      <button 
        className="theme-toggle-btn" 
        onClick={() => setIsDarkMode(!isDarkMode)} 
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <div className="weather-content">
        <header className="page-header">
          <h1 className="title">🌦 Smart Weather & Crop Advisory</h1>
          <p className="header-subtitle">
            Providing smart localized crop recommendations for farmers based on exact soil conditions and weather patterns.
          </p>
        </header>

        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) searchLocation();
          }}
        >
          <input
            placeholder="Search by city, town or Indian state..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">{loading ? "..." : "Search"}</button>
        </form>

        <div className="controls-row">
          {autoSoil && (
            <div className="info-banner">
              🌍 Map-Detected Soil: <strong>{autoSoil}</strong>
            </div>
          )}
        </div>



        {errorMsg && <p className="error">{errorMsg}</p>}

        {loading && (
          <div className="weather-loading-container">
            <div className="weather-spinner"></div>
            <p>Fetching real-time agricultural climate data...</p>
          </div>
        )}

        {!weatherData && !loading && (
          <div className="weather-prompt-container">
            <span className="prompt-icon">📍</span>
            <p>Please authorize location access or search for a location to load localized weather and crop recommendations.</p>
          </div>
        )}

        {weatherData && !loading && (
          <div className="main-section">
            {/* Left Card Panel: Weather & Map */}
            <div className="left-panel">
              <div className="weather-card">
                <h2>🌦 Local Weather Station</h2>
                <div className="temp-row">
                  <div className="temp">{weatherData.temperature}°C</div>
                  <div className="weather-season-badge">{getSeason()} Season</div>
                </div>
                <div className="weather-stats-grid">
                  <div className="stat-block">
                    <span className="stat-icon">🌡️</span>
                    <span className="stat-label">Feels Like</span>
                    <span className="stat-value">{weatherData.feels_like}°C</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-icon">💧</span>
                    <span className="stat-label">Humidity</span>
                    <span className="stat-value">{weatherData.humidity}%</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-icon">🌧️</span>
                    <span className="stat-label">Rainfall</span>
                    <span className="stat-value">{weatherData.rainfall} mm</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-icon">🌱</span>
                    <span className="stat-label">Soil Moisture</span>
                    <span className="stat-value">{weatherData.humidity > 70 ? "High" : "Optimal"}</span>
                  </div>
                </div>
              </div>


            </div>

            {/* Middle Card Panel: Crop Recommendations */}
            <div className="agri-card">
              <h2>🌾 Crop Recommendations</h2>
              <span className="grid-helper">Select any crop card below to open its step-by-step farming instructions:</span>
              <div className="crop-grid">
                {recommendedCrops.map((c) => (
                  <div
                    className={`crop-item ${selectedCrop === c ? "active-crop" : ""}`}
                    key={c}
                    onClick={() => setSelectedCrop(c)}
                  >
                    <img src={cropImages[c]} alt={c} />
                    <p>{c}</p>
                  </div>
                ))}
              </div>

              <div className="agri-tips">
                <strong> Farming tips:</strong>
                <p>{getAdvisory()}</p>
              </div>
            </div>

            {/* Right Card Panel: Crop Details */}
            {selectedCrop && CROP_DETAILS[selectedCrop] && (
              <div className="crop-detail-card">
                <h2>📋 Cultivation Playbook: {selectedCrop}</h2>
                <div className="detail-item desc">
                  <p>{CROP_DETAILS[selectedCrop].description}</p>
                </div>
                
                <div className="detail-grid">
                  <div className="detail-box">
                    <span className="icon">🌡️</span>
                    <div className="text">
                      <span className="label">Optimal Temp</span>
                      <span className="value">{CROP_DETAILS[selectedCrop].temperature}</span>
                    </div>
                  </div>
                  <div className="detail-box">
                    <span className="icon">💧</span>
                    <div className="text">
                      <span className="label">Water Needs</span>
                      <span className="value">{CROP_DETAILS[selectedCrop].water}</span>
                    </div>
                  </div>
                  <div className="detail-box">
                    <span className="icon">🌱</span>
                    <div className="text">
                      <span className="label">Soil Types</span>
                      <span className="value">{CROP_DETAILS[selectedCrop].soil}</span>
                    </div>
                  </div>
                  <div className="detail-box">
                    <span className="icon">⏳</span>
                    <div className="text">
                      <span className="label">Sowing Stage</span>
                      <span className="value">{CROP_DETAILS[selectedCrop].sowing}</span>
                    </div>
                  </div>
                  <div className="detail-box">
                    <span className="icon">🚜</span>
                    <div className="text">
                      <span className="label">Harvest Time</span>
                      <span className="value">{CROP_DETAILS[selectedCrop].harvesting}</span>
                    </div>
                  </div>
                  <div className="detail-box">
                    <span className="icon">🧪</span>
                    <div className="text">
                      <span className="label">Key Nutrients</span>
                      <span className="value">{CROP_DETAILS[selectedCrop].nutrients}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-item tips">
                  <strong>💡 Pro-Farming Tips:</strong>
                  <p>{CROP_DETAILS[selectedCrop].tips}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
