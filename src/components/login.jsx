// src/components/login.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { useAuth } from "../contexts/AuthContext"; // new

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        // create account
        await signUp(email, password);
        // user is automatically signed in by Firebase after sign up
      } else {
        // sign in
        await signIn(email, password);
      }

      // successful sign-in — navigate to protected page
      navigate("/" /* or "/" depending on your app */);
    } catch (err) {
      console.error(err);
      // Friendly error mapping
      const msg = err?.code || err?.message || "Authentication failed";
      // map common firebase codes to nicer messages
      if (msg.includes("auth/wrong-password")) setError("Wrong password");
      else if (msg.includes("auth/user-not-found")) setError("No account found for that email");
      else if (msg.includes("auth/email-already-in-use")) setError("Email already in use");
      else if (msg.includes("auth/weak-password")) setError("Password should be at least 6 characters");
      else setError(err.message || "Login failed");
    }
  }

  return (
    <div className="login-page">
    <div className="login-bg" />
    <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="auth-wrapper"
    >
    <div className="auth-card">
    <div className="auth-header">
    <Leaf className="auth-icon" />
    <h1>Plant Pulse</h1>
    <p>
    {isSignup
      ? "Create an account to start."
      : "Welcome back! Let's cultivate success together."}
      </p>
      </div>

      <motion.form
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="auth-form"
      onSubmit={handleSubmit}
      >
      <input
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      />
      <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      />

      {error && <p className="error-msg">{error}</p>}

      <button type="submit" className="auth-button">
      {!isSignup ? (
        <>
        <LogIn size={18} /> Sign In
        </>
      ) : (
        <>
        <UserPlus size={18} /> Create Account
        </>
      )}
      </button>
      </motion.form>

      <div className="auth-toggle">
      <p>
      {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
      <button type="button" onClick={() => setIsSignup(!isSignup)}>
      {isSignup ? "Log in" : "Sign up"}
      </button>
      </p>
      </div>
      </div>
      </motion.div>
      </div>
  );
}
