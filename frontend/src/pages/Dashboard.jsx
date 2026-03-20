import React, { useEffect, useState } from "react";
import InventoryTable from "../components/Inventory/InventoryTable";
import AlertsPanel from "../components/Alerts/AlertsPanel";

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [mode, setMode] = useState("MANUAL");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("invq_token");

  const fetchData = async () => {
    try {
      const invRes = await fetch("http://localhost:4000/inventory", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const invData = await invRes.json();
      if (Array.isArray(invData)) setInventory(invData);

      const storeRes = await fetch("http://localhost:4000/store", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const storeData = await storeRes.json();
      if (storeData?.updateMode) setMode(storeData.updateMode);

    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between MANUAL and EOD
  const toggleMode = async () => {
    const newMode = mode === "MANUAL" ? "EOD" : "MANUAL";
    try {
      const res = await fetch("http://localhost:4000/store/update-mode", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ updateMode: newMode })
      });

      if (res.ok) {
        setMode(newMode);
        // Refresh data because switching modes changes how the table should look
        fetchData(); 
      }
    } catch (err) {
      console.error("Failed to switch modes:", err);
    }
  };

  const applyEOD = async () => {
    if (!window.confirm("Sync all pending changes to live inventory?")) return;
    try {
      const res = await fetch("http://localhost:4000/inventory/apply-eod", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Inventory Synced!");
        fetchData();
      }
    } catch (err) {
      console.error("EOD Apply Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="dashboard">Initializing InvQ...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ marginBottom: '20px', gridColumn: '1 / span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Store Dashboard</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Manage your workspace items</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* TOGGLE BUTTON */}
          <button 
            onClick={toggleMode}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: mode === "MANUAL" ? "#10b981" : "#f59e0b" }}>●</span>
            {mode === "MANUAL" ? "Switch to EOD Mode" : "Switch to Live Mode"}
          </button>

          {mode === "EOD" && (
            <button 
              onClick={applyEOD}
              style={{ background: '#1e293b', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
            >
              Sync All Changes
            </button>
          )}
        </div>
      </div>

      <div className="inventory-section">
        <InventoryTable inventory={inventory} setInventory={setInventory} />
      </div>

      <div className="alerts-section">
        <AlertsPanel inventory={inventory} />
      </div>
    </div>
  );
}