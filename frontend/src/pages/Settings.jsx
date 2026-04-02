import React, { useEffect, useState } from "react";

export default function Settings() {
  const [storeName, setStoreName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [updateMode, setUpdateMode] = useState("MANUAL");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("invq_token");

  const fetchStore = async () => {
    try {
      const res = await fetch("http://localhost:4000/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setStoreName(data.storeName || "");
      setBusinessType(data.businessType || "");
      setUpdateMode(data.updateMode || "MANUAL");
    } catch (err) {
      console.error("Failed to load store settings:", err);
      alert("Could not load store settings");
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (newMode) => {
    try {
      const res = await fetch("http://localhost:4000/store/update-mode", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updateMode: newMode }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Could not update mode");
      }

      setUpdateMode(newMode);
      alert("Update mode saved");
    } catch (err) {
      console.error("Mode update error:", err);
      alert("Failed to update mode");
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  if (loading) return <div className="settings-page">Loading settings...</div>;

  return (
    <div className="settings-page">
      <h2>Store Settings</h2>

      <div style={{ marginBottom: "16px" }}>
        <strong>Store Name:</strong>
        <p>{storeName || "N/A"}</p>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <strong>Business Type:</strong>
        <p>{businessType || "N/A"}</p>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <strong>Update Mode:</strong>
        <p>{updateMode}</p>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => handleModeChange("MANUAL")}>
          Set MANUAL
        </button>
        <button onClick={() => handleModeChange("EOD")}>
          Set EOD
        </button>
      </div>
    </div>
  );
}