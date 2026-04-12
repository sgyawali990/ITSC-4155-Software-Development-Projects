import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4000/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Reset failed");
      }

      alert("Password updated successfully");
      navigate("/");
    } catch (err) {
      console.error("Reset password error:", err);
      alert("Could not reset password");
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
          iQ
        </div>

        <h2 style={{ color: "#0a3d34", margin: "0 0 10px 0" }}>New Password</h2>
        <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "0.9rem" }}>
          Almost there! Please enter your new secure password below.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
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
            }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
