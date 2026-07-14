import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ ADDED useNavigate
import { useScroll, useTransform, motion } from "framer-motion";
import farming3 from "../assets/images/farming3.jpg";
import home from "../assets/video/home.mp4";
import Friendly from "../assets/images/Friendly.jpeg";
import anishImg from "../assets/images/anish.jpg";
import priantuImg from "../assets/images/priantu.jpg";
import nitalImg from "../assets/images/nital.jpg";
import biswajitImg from "../assets/images/biswajit.jpg";
import aritraImg from "../assets/images/aritra.jpg";
import Innovative from "../assets/images/Innovative.webp";
import plant_disease from "../assets/images/plant_disease.webp";
import "../css/home.css";
import { useAuth } from "../contexts/AuthContext";

const TEAM_MEMBERS = [
  {
    name: "Anish Bhaduri",
    role: "Web Developer",
    img: anishImg,
    linkedin: "https://linkedin.com/in/anish-bhaduri",
    email: "anish@gmail.com",
  },
  {
    name: "Priantu Das",
    role: "ML Engineer",
    img: priantuImg,
    linkedin: "https://linkedin.com/in/priantu-das",
    email: "priantu@gmail.com",
  },
  {
    name: "Nital Kumari",
    role: "UX/UI Designer",
    img: nitalImg,
    linkedin: "https://linkedin.com/in/nital-kumari",
    email: "nital@gmail.com",
  },
  {
    name: "Biswajyoti Ray",
    role: "ML Engineer",
    img: biswajitImg,
    linkedin: "https://linkedin.com/in/biswajyoti-ray",
    email: "biswajyoti@gmail.com",
  },
  {
    name: "Aritra Kar",
    role: "Supporter",
    img: aritraImg,
    linkedin: "https://linkedin.com/in/aritra-kar",
    email: "aritra@gmail.com",
  },
];

const FloatingBackground = ({ count = 12 }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      size: Math.random() * 25 + 15, // 15px to 40px
      delay: `${Math.random() * 12}s`,
      duration: `${Math.random() * 15 + 15}s`, // 15s to 30s
      type: Math.random() > 0.45 ? "leaf" : "particle",
    }));
    setItems(newItems);
  }, [count]);

  return (
    <div className="floating-container">
      {items.map((item) => (
        <div
          key={item.id}
          className={`floating-item ${item.type === "leaf" ? "leaf-item" : "particle"}`}
          style={{
            left: item.left,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.type === "leaf" && (
            <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
              <path d="M17 8C8 10 5.9 16.1 5 20C9.1 19.1 15.2 17 17 8M2 2C2 2 11 3 16 10C21 17 22 22 22 22C22 22 17 21 10 16C3 11 2 2 2 2Z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const { scrollY } = useScroll();
  const { user, signOut } = useAuth();
  const [showGreeting, setShowGreeting] = useState(false);

  const navigate = useNavigate(); // ✅ ADDED

  const username = user?.email ? user.email.split("@")[0] : "Farmer";
  const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

  // Show welcome greeting popup once per session
  useEffect(() => {
    const hasGreeted = sessionStorage.getItem("plantpulse-greeted");
    if (!hasGreeted && user) {
      // Set a small delay for a better user experience so it doesn't pop up instantly before assets load
      const timer = setTimeout(() => {
        setShowGreeting(true);
        sessionStorage.setItem("plantpulse-greeted", "true");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // ✅ ADDED logout handler
  const handleLogout = async () => {
    await signOut();
    sessionStorage.removeItem("plantpulse-greeted");
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      const featuresSection = document.getElementById("features");
      if (featuresSection) {
        const threshold = featuresSection.offsetTop - 120;
        if (window.scrollY >= threshold) {
          setShowScrollBtn(true);
        } else {
          setShowScrollBtn(false);
        }
      } else {
        if (window.scrollY > 500) {
          setShowScrollBtn(true);
        } else {
          setShowScrollBtn(false);
        }
      }

      // Check overlap between scroll-to-home button and footer
      const footer = document.querySelector(".footer");
      const btn = document.querySelector(".scroll-to-home-btn");
      if (footer && btn) {
        const footerRect = footer.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        // Check if the top of the footer is above the bottom of the button
        if (footerRect.top <= btnRect.bottom) {
          btn.classList.add("over-footer");
        } else {
          btn.classList.remove("over-footer");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 880 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const handleMenuClick = () => setMenuOpen((prev) => !prev);
  const handleNavLinkClick = () => setMenuOpen(false);

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const yParallax = useTransform(scrollY, [0, 800], [0, -40]);

  const features = [
    {
      title: "Plant Disease Identification",
      desc: `Keeping crops healthy is the key to a successful harvest. Our AI-powered Plant Disease Identification system helps farmers detect crop problems early — just by uploading a photo of the affected plant. Within seconds, you’ll receive accurate disease detection, causes, and practical treatment recommendations.
By identifying issues before they spread, you can reduce crop loss, improve yield quality, and save time and resources. Whether it’s pests, nutrient deficiencies, or fungal infections, our intelligent system ensures your fields stay green and productive.
Empowering farmers with technology that works in the field, not just in theory — because every healthy plant matters.`,
      img: plant_disease,
    },
    {
      title: "Smart Farming, Simple Guidance",
      desc: "Discover how technology can make farming easier. Our smart plant disease identification tool helps you detect problems early, protect your crops, and improve yield — all with simple, easy-to-follow guidance.",
      img: farming3,
    },
    {
      title: "Innovations for Modern Farms",
      desc: "Farming today is more than hard work — it’s about working smart. Our modern innovations bring the power of technology to your fingertips, helping you identify plant diseases, monitor field conditions, and protect your crops with ease. By combining traditional farming knowledge with advanced AI tools, we’re making it simple for farmers to grow healthier crops and achieve better harvests season after season.",
      img: Innovative,
    },
    {
      title: "User-Friendly Interface",
      desc: "Our platform is designed with farmers in mind. With an easy-to-use interface, you can quickly upload plant images, view instant disease reports, and access solutions — all in just a few taps. No complex tools or technical skills needed — just clear, simple guidance to help you protect your crops.",
      img: Friendly,
    },
  ];

  return (
    <div>
      <button
        className={`scroll-to-home-btn ${showScrollBtn ? "show" : ""}`}
        onClick={() =>
          document.getElementById("home").scrollIntoView({ behavior: "smooth" })
        }
      >
        ▲
      </button>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>🌿 Plant Pulse</h1>
        </div>

        <nav className={`navbar${menuOpen ? " active" : ""}`}>
          <a href="#home" className="nav-link" onClick={(e) => handleScrollToSection(e, "home")}>
            Home
          </a>
          <a href="#features" className="nav-link" onClick={(e) => handleScrollToSection(e, "features")}>
            Features
          </a>
          <a href="#about" className="nav-link" onClick={(e) => handleScrollToSection(e, "about")}>
            About
          </a>
          <a href="#contact" className="nav-link" onClick={(e) => handleScrollToSection(e, "contact")}>
            Contact
          </a>
          <Link to="/dashboard" className="nav-link" onClick={handleNavLinkClick}>
            Dashboard
          </Link>
          <Link to="/upload" className="btn nav-link" onClick={handleNavLinkClick}>
            Model
          </Link>
          <button
            onClick={() => {
              handleNavLinkClick();
              handleLogout();
            }}
            className="logout-btn"
            title="Logout"
          >
            Logout
          </button>
        </nav>
         

        <button
          id="menu-btn"
          className={`menu-icon ${menuOpen ? "open" : ""}`}
          onClick={handleMenuClick}
        >
          <span className="bar bar1" />
          <span className="bar bar2" />
          <span className="bar bar3" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="home" id="home">
        <video className="video" src={home} autoPlay loop muted />
        <FloatingBackground count={14} />
        <motion.div
          className="content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.h1>YOUR SMART FARMING ASSISTANT</motion.h1>
          <motion.p>Smart Crops, Smart Choices with Plant Pulse!</motion.p>
          <Link to="/guidepage" className="home-btn">
            Smart Farming Guide
          </Link>
        </motion.div>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features" aria-label="Features">
        <FloatingBackground count={10} />
        <motion.div
          className="heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 1 }}
        >
          <h1>Features</h1>
          <p>
            PlantPulse empowers farmers with AI-driven crop recommendations,
            disease detection, and climate insights to make smarter, sustainable
            farming decisions.
          </p>
        </motion.div>

        <div className="button-container0">
          <Link to="/Weatherforcast" className="buttonn active">
            Weather Forecasting
          </Link>
          <Link to="/upload" className="buttonn">
            Identify Diseases
          </Link>
          <Link to="/guidepage" className="buttonn">
            Smart Farming Guidance
          </Link>
        </div>

        <div className="features-list">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`feature-row ${index % 2 !== 0 ? "reverse" : ""}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="image">
                <motion.img
                  src={feature.img}
                  alt={feature.title}
                  className="rounded-corner-image parallax-img"
                  whileHover={{ scale: 1.05 }}
                />
              </div>
              <div className="content">
                <h1>{feature.title}</h1>
                <p>{feature.desc}</p>
                <Link to={
                  index === 0 ? "/upload" :
                  index === 1 ? "/guidepage" :
                  index === 2 ? "/dashboard" : "/guidepage"
                } className="all-btn">
                  {index === 0 ? "Identify Diseases" :
                   index === 1 ? "Get Farming Guide" :
                   index === 2 ? "View Dashboard" : "Learn More"}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about" aria-label="About">
        <div className="responsive-container-block outer-container" style={{ position: "relative", overflow: "hidden" }}>
          <FloatingBackground count={8} />
          <div className="responsive-container-block inner-container">
            <h1 className="text-blk section-head-text">Meet Our Team</h1>
            <p className="text-blk section-subhead-text">
              A passionate team of innovators blending agriculture and
              technology to help farmers grow healthier crops and maximize their yields.
            </p>
            <div className="responsive-container-block team-list-container">
              <div className="team-track">
                <div className="team-group">
                  {TEAM_MEMBERS.map((member, index) => (
                    <div key={`member-orig-${index}`} className="responsive-cell-block team-card-container">
                      <div className="team-card">
                        <div className="img-wrapper">
                          <img className="team-img" src={member.img} alt={member.name} />
                        </div>
                        <p className="text-blk name">{member.name}</p>
                        <p className="text-blk position">{member.role}</p>
                        <div className="social-media-links">
                          <a href={member.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="social-icon linkedin-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                          <a href={`mailto:${member.email}`} title="Email" className="social-icon email-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="team-group cloned-group">
                  {TEAM_MEMBERS.map((member, index) => (
                    <div key={`member-clone-${index}`} className="responsive-cell-block team-card-container">
                      <div className="team-card">
                        <div className="img-wrapper">
                          <img className="team-img" src={member.img} alt={member.name} />
                        </div>
                        <p className="text-blk name">{member.name}</p>
                        <p className="text-blk position">{member.role}</p>
                        <div className="social-media-links">
                          <a href={member.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="social-icon linkedin-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                          <a href={`mailto:${member.email}`} title="Email" className="social-icon email-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="footer" id="contact" aria-label="Footer">
        <div className="box-container">
          <div className="box">
            <h3>Quick Links</h3>
            <a href="#home" onClick={(e) => handleScrollToSection(e, "home")}>Home</a>
            <a href="#features" onClick={(e) => handleScrollToSection(e, "features")}>Features</a>
            <a href="#about" onClick={(e) => handleScrollToSection(e, "about")}>About</a>
          </div>
          <div className="box">
            <h3>Extra Links</h3>
            <a href="#" onClick={(e) => e.preventDefault()}>Ask Questions</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms of Use</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          </div>
          <div className="box">
            <h3>Helpful Resources</h3>
            <a href="#" onClick={(e) => e.preventDefault()}>FAQs</a>
            <a href="#" onClick={(e) => e.preventDefault()}>User Guides</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Support Center</a>
          </div>
          <div className="box">
            <h3>Stay Connected</h3>
            <a href="#" onClick={(e) => e.preventDefault()}>Future Scope</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Community Forum</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Newsletter</a>
          </div>
        </div>

        <div className="credit">
          © 2026 <span>Plant Pulse</span> — All Rights Reserved
        </div>
      </footer>

      {/* Welcome Greeting Popup */}
      {showGreeting && (
        <div className="welcome-popup-overlay" onClick={() => setShowGreeting(false)}>
          <div className="welcome-popup-content glass-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button className="welcome-popup-close" onClick={() => setShowGreeting(false)}>
              &times;
            </button>
            <div className="welcome-popup-header">
               <div className="welcome-icon-wrapper">
                 <span className="welcome-emoji-icon">🌿</span>
              </div> 
              <h2> Welcome to Plant Pulse!</h2>
              <p className="welcome-subtitle">Your Smart Farming Journey Starts Here</p>
            </div>
            <div className="welcome-popup-body">
              <p>
                We are thrilled to assist you today. Plant Pulse helps you monitor crop health, identify diseases instantly, and get real-time weather forecasts to maximize your harvest.
              </p>
              {/* <div className="welcome-quick-links">
                <h4>Quick Actions: </h4>
                <div className="quick-links-grid">
                  <Link to="/upload" className="quick-link-item" onClick={() => setShowGreeting(false)}>
                    <span className="icon">🔍</span>
                    <span>Identify Diseases</span>
                  </Link>
                  <Link to="/Weatherforcast" className="quick-link-item" onClick={() => setShowGreeting(false)}>
                    <span className="icon">☀️</span>
                    <span>Weather Forecast</span>
                  </Link>
                  <Link to="/guidepage" className="quick-link-item" onClick={() => setShowGreeting(false)}>
                    <span className="icon">📖</span>
                    <span>Farming Guide</span>
                  </Link>
                </div>
              </div> */}
            </div>
            <div className="welcome-popup-footer">
              <button className="welcome-dismiss-btn" onClick={() => setShowGreeting(false)}>
                Get Started!🌿
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
