import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000; // You can change port if needed

// Middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: "YourStrongSecret123", // change this
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

// Hardcoded login
const LOGIN_EMAIL = "admin@example.com";
const LOGIN_PASSWORD = "123456789";

// ------------------ LOGIN API ------------------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === LOGIN_EMAIL && password === LOGIN_PASSWORD) {
    req.session.user = { email };
    return res.json({ success: true });
  } else {
    return res.status(401).json({ error: "Invalid email or password" });
  }
});

// ------------------ LOGOUT API ------------------
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ------------------ AUTH MIDDLEWARE ------------------
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// ------------------ Protected Route Example ------------------
app.get("/api/protected", requireAuth, (_req, res) => {
  res.json({ message: "You are logged in!" });
});

// ------------------ Serve Frontend ------------------
app.use(express.static(path.join(__dirname, "../dist"))); // Vite build folder

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
