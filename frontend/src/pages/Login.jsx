import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (parseError) {
        return alert("Server Error: The backend sent an invalid response.");
      }

      if (res.ok && data.token) {
        const token = data.token;
        localStorage.setItem("invq_token", token);

        try {
          const resInventory = await fetch("http://localhost:4000/inventory", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const items = await resInventory.json();

          if (items.length === 0) {
            navigate("/create-store");
          } else {
            navigate("/dashboard");
          }
        } catch (invError) {
          console.error("Inventory check failed, defaulting to dashboard");
          navigate("/dashboard");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Could not connect to the server. Is the backend running on port 4000?");
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p
        onClick={() => navigate("/forgot-password")}
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
      >
        Forgot Password?
      </p>

      <p
        onClick={() => navigate("/register")}
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
      >
        Create Account
      </p>
    </div>
  );
}