import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", {
        email,
        password,
      });

      // Save admin token
      localStorage.setItem(
        "naduvan_admin_token",
        response.data.token
      );

      // Go to dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">

        {/* Logo */}
        <div className="admin-logo">
          NADUVAN
          <small>ADMIN PANEL</small>
        </div>

        {/* Heading */}
        <h1>Welcome back</h1>

        <p>
          Manage products and customer orders.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <label>
            Email

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </label>

          {/* Password */}
          <label>
            Password

            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </label>

          {/* Error */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="green-btn"
            disabled={loading}
          >
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>

        </form>
      </div>
    </div>
  );
}