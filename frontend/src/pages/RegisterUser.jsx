import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      alert("Account created successfully!");
      navigate("/"); // Redirect to Login
    } else {
      const errorData = await res.json();
      console.error("Registration Error:", errorData);
      alert(errorData.error || errorData.message || "Registration failed");
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

        <h2 style={{ color: "#0a3d34", margin: "0 0 10px 0" }}>Create Account</h2>
        <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "0.9rem" }}>
          Join InvQ to start managing your stock
        </p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required 
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Register
          </button>
        </form>

        <div style={{ fontSize: "0.85rem" }}>
          <p style={{ color: "#64748b" }}>
            Already have an account?{" "}
            <span 
              onClick={() => navigate("/")}
              style={{ color: "#0a3d34", cursor: "pointer", fontWeight: "600" }}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
