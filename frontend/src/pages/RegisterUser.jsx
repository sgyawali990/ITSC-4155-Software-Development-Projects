import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterUser(){
  
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
      alert("Account created");
      navigate("/login");
    } else {
      const errorData = await res.json();
      console.error("Registration Error:", errorData);
      alert(errorData.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        {/* Added the Username input field */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />

        <input
          type="email"
          placeholder="Email"
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

        <button type="submit">Register</button>
      </form>
    </div>
  );
}