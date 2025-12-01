// frontend/src/pages/SignUpPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUpPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillsOfferedInput: "",
    skillsNeededInput: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Convert comma-separated values to arrays
    const skillsOffered = form.skillsOfferedInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, timeCredit: 1 }));

    const skillsNeeded = form.skillsNeededInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        skillsOffered,
        skillsNeeded
      });

      if (res.success) {
        navigate("/dashboard");
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch (submitError) {
      setError(submitError.message || "Registration failed. Please try again.");
    }
  };// done by chat: added error handling for registration

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="logo">ChronoTrade</Link>
          <Link to="/login" className="link">
            Login
          </Link>
        </div>
        <h1>Sign Up</h1>
        <p className="subtitle">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Skills Offered (comma separated)
            <input
              type="text"
              name="skillsOfferedInput"
              placeholder="e.g. Guitar, Python"
              value={form.skillsOfferedInput}
              onChange={handleChange}
            />
          </label>

          <label>
            Skills Needed (comma separated)
            <input
              type="text"
              name="skillsNeededInput"
              placeholder="e.g. Cooking, English"
              value={form.skillsNeededInput}
              onChange={handleChange}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary full-width">
            Sign up
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
