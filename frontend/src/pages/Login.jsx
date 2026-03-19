import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState(""); // Changed to username
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
        console.error("Backend didn't return JSON:", parseError);
        return alert("Server Error: The backend sent an invalid response.");
      }

      if (res.ok && data.token) {
        localStorage.setItem("invq_token", data.token);
        navigate("/dashboard");
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
      <p onClick={() => navigate("/register")} style={{cursor: 'pointer'}}>
        Create Account
      </p>
    </div>
  );
}