import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateStore() {
  const [storeName, setStoreName] = useState("");
  const navigate = useNavigate();

  const applyTemplate = async (templateKey) => {
    if (!storeName.trim()) {
      return alert("Please enter a name for your store first!");
    }

    const token = localStorage.getItem("invq_token");

    // We hit the new endpoint in the controller
    const res = await fetch("http://localhost:4000/templates/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      // We send both the name and the template type
      body: JSON.stringify({ 
        storeName: storeName.trim(), 
        templateKey 
      })
    });

    if (res.ok) {
      alert(`${storeName} created with ${templateKey} starter items!`);
      navigate("/dashboard");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to create store");
    }
  };

  return (
    <div className="setup-page">
      <h2>Finalize Your Setup</h2>
      
      <div className="input-group">
        <label>Step 1: Name your location</label>
        <input
          placeholder="e.g. Main Office or Downtown Shop"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          style={{ display: 'block', margin: '10px 0', padding: '8px', width: '300px' }}
        />
      </div>

      <div className="template-group">
        <label>Step 2: Select a Business Template</label>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          This will auto-populate your inventory with common items.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => applyTemplate("OFFICE")}>
            🏢 Office
          </button>

          <button onClick={() => applyTemplate("WORKSHOP")}>
            🛠️ Workshop
          </button>

          <button onClick={() => applyTemplate("SMALL_RETAIL")}>
            🛒 Small Retail
          </button>
        </div>
      </div>
    </div>
  );
}