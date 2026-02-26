import React, { useState } from "react";
import "./AdminLogin.css"; // Import the CSS

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Invalid credentials. Access denied.");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      window.location.reload();
    } catch (err) {
      setError("Connection failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>Admin Portal</h2>
        <p className="login-subtitle">Please enter your secure credentials</p>

        <div className="input-group">
          <label>Email Address</label>
          <input
            className="admin-input"
            type="email"
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            className="admin-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          className="login-button" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default AdminLogin;