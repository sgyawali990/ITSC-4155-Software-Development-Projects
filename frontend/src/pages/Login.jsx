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
        localStorage.setItem("invq_token", data.token);
        localStorage.setItem("invq_user_name", username);
        localStorage.setItem("invq_user_email", data.user?.email || "");

        // Check if the user has a store/items already
        try {
          const resInventory = await fetch("http://localhost:4000/inventory", {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const items = await resInventory.json();

          if (items.length === 0) {
            navigate("/create-store");
          } else {
            navigate("/dashboard");
          }
        } catch (invError) {
          navigate("/dashboard");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Could not connect to the server. Is the backend running on port 4000?");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    boxSizing: "border-box"
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      backgroundColor: "#f1f5f9"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "400px", 
        backgroundColor: "white", 
        padding: "40px", 
        borderRadius: "16px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        textAlign: "center" 
      }}>
        {/* Brand Logo */}
        <div style={{ 
          backgroundColor: "#0a3d34", 
          width: "50px", 
          height: "50px", 
          borderRadius: "12px", 
          margin: "0 auto 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold"
        }}>
          InvQ
        </div>

        <h2 style={{ color: "#0a3d34", margin: "0 0 10px 0" }}>Welcome Back</h2>
        <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "0.9rem" }}>
          Log in to manage your inventory
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button 
            type="submit" 
            style={{ 
              width: "100%", 
              padding: "12px", 
              backgroundColor: "#0a3d34", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "20px"
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ fontSize: "0.85rem" }}>
          <p style={{ margin: "5px 0" }}>
            <span 
              onClick={() => navigate("/forgot-password")}
              style={{ color: "#0a3d34", cursor: "pointer", fontWeight: "600" }}
            >
              Forgot Password?
            </span>
          </p>
          <p style={{ color: "#64748b" }}>
            Don't have an account?{" "}
            <span 
              onClick={() => navigate("/register")}
              style={{ color: "#0a3d34", cursor: "pointer", fontWeight: "600" }}
            >
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
