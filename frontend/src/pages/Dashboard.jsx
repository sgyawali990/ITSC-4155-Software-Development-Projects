import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertsPanel from "../components/Alerts/AlertsPanel";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUp,
  Search,
  Download,
  Bell
} from "lucide-react";

const TEXT_DARK = "#0C1D26";
const BRAND_ICON = "#34C759";

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const username = localStorage.getItem("invq_user_name") || "User";
  const token = localStorage.getItem("invq_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/inventory", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setInventory(data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const lowStockItems = inventory.filter(
    item => Number(item.quantity || 0) <= Number(item.reorderThreshold || 0)
  );

  if (loading) return <div style={{ padding: "40px" }}>Loading Dashboard...</div>;

  return (
    <div
      style={{
        backgroundColor: "#F8FAFC",
        backgroundImage:
          "radial-gradient(at 0% 0%, hsla(187, 92%, 92%, 1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(199, 89%, 88%, 1) 0px, transparent 50%)",
        minHeight: "100vh",
        fontFamily: '"Inter", sans-serif'
      }}
    >
      {/* TOP NAV */}
      <div style={topNavStyle}>
        <h2 style={navTitleStyle}>InvQ Management Console</h2>
        <button
          onClick={() => navigate("/inventory")}
          style={manageButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Manage Inventory
        </button>
      </div>

      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Welcome, {username}.</h1>
            <p style={subtitleStyle}>Reports & Analytics Overview</p>
          </div>
          <button style={refButtonStyle}>
            Export Data <Download size={16} />
          </button>
        </div>

        {/* SUMMARY CUBES */}
        <div style={cubeGrid}>
          {/* TOTAL ITEMS */}
          <div style={cubeStyle}>
            <div style={{ ...iconContainerStyle, background: "#ECFBF0" }}>
              <Package size={22} color={BRAND_ICON} />
            </div>
            <div>
              <p style={cubeLabelStyle}>Total Items</p>
              <h2 style={cubeValueStyle}>{inventory.length}</h2>
            </div>
            <ArrowUp size={20} color={BRAND_ICON} style={{ marginLeft: "auto" }} />
          </div>

          {/* LOW STOCK */}
          <div style={{ ...cubeStyle, cursor: "pointer" }} onClick={() => navigate("/inventory")}>
            <div style={{ ...iconContainerStyle, background: "#FFF0F0" }}>
              <AlertTriangle size={22} color="#EF4444" />
            </div>
            <div>
              <p style={cubeLabelStyle}>Low Stock</p>
              <h2 style={{ ...cubeValueStyle, color: "#EF4444" }}>
                {lowStockItems.length}
              </h2>
            </div>
          </div>

          {/* INVENTORY HEALTH */}
          <div style={cubeStyle}>
            <div style={{ ...iconContainerStyle, background: "#E8FAFC" }}>
              <TrendingUp size={22} color="#22D3EE" />
            </div>
            <div>
              <p style={cubeLabelStyle}>Inventory Health</p>
              <h2 style={cubeValueStyle}>
                {inventory.length === 0
                  ? "—"
                  : `${Math.round(
                    ((inventory.length - lowStockItems.length) / inventory.length) * 100
                  )}%`}
              </h2>
            </div>
          </div>
        </div>

        {/* 🚀 INVENTORY PULSE BARS */}
        <div style={graphContainerStyle}>
          <h3 style={sectionTitle}>Inventory Overview</h3>

          {inventory.length === 0 ? (
            <p style={{ color: "#64748b" }}>No data to display.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {inventory.map((item, i) => {
                const qty = Number(item.quantity || 0);
                const threshold = Number(item.reorderThreshold || 0);
                const maxQty = Math.max(...inventory.map(i => Number(i.quantity || 1)));

                const percent = (qty / maxQty) * 100;

                let color = "#22C55E";
                let glow = "rgba(34,197,94,0.4)";
                let label = "Healthy";

                if (qty === 0) {
                  color = "#EF4444";
                  glow = "rgba(239,68,68,0.5)";
                  label = "Out of stock";
                } else if (qty <= threshold) {
                  color = "#F97316";
                  glow = "rgba(249,115,22,0.5)";
                  label = "Low stock";
                }

                return (
                  <div key={i}>
                    {/* HEADER */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: "800", color: TEXT_DARK }}>
                          {item.itemName}
                        </span>
                        <span
                          style={{
                            marginLeft: "10px",
                            fontSize: "12px",
                            color
                          }}
                        >
                          {label}
                        </span>
                      </div>

                      <span
                        style={{
                          fontWeight: "900",
                          color,
                          fontSize: "16px"
                        }}
                      >
                        {qty}
                      </span>
                    </div>

                    {/* BAR BACKGROUND */}
                    <div
                      style={{
                        width: "100%",
                        height: "16px",
                        background: "#E5E7EB",
                        borderRadius: "999px",
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                      {/* MAIN BAR */}
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: color,
                          borderRadius: "999px",
                          transition: "width 0.8s ease",
                          boxShadow: `0 0 12px ${glow}`
                        }}
                      />

                      {/* PULSE OVERLAY */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${percent}%`,
                          background: `linear-gradient(90deg, transparent, ${glow}, transparent)`,
                          opacity: 0.4,
                          filter: "blur(6px)"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ALERTS */}
        <div style={alertsContainer}>
          <div style={alertsHeader}>
            <h3 style={alertsTitle}>Critical Alerts</h3>
            <span style={alertBadge}>Action Required</span>
          </div>
          <AlertsPanel inventory={inventory} />
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const topNavStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 40px",
  backgroundColor: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(0,0,0,0.05)"
};

const navTitleStyle = {
  margin: 0,
  fontSize: "14px",
  fontWeight: "700",
  color: TEXT_DARK
};

const searchBoxStyle = {
  border: "1px solid #DEDEDE",
  padding: "6px 12px",
  borderRadius: "8px",
  background: "white"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "30px",
  alignItems: "flex-end"
};

const titleStyle = {
  margin: 0,
  color: TEXT_DARK,
  fontSize: "32px",
  fontWeight: "900"
};

const subtitleStyle = {
  margin: "5px 0 0 0",
  color: "#64748b"
};

const cubeGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "24px",
  marginBottom: "30px"
};

const cubeStyle = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.03)"
};

const iconContainerStyle = {
  padding: "12px",
  borderRadius: "14px"
};

const cubeLabelStyle = {
  margin: 0,
  fontSize: "12px",
  color: "#64748b",
  fontWeight: "700"
};

const cubeValueStyle = {
  margin: "2px 0 0 0",
  fontSize: "26px",
  fontWeight: "900",
  color: TEXT_DARK
};

const graphContainerStyle = {
  backgroundColor: "white",
  padding: "35px",
  borderRadius: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  marginBottom: "30px"
};

const sectionTitle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "800",
  marginBottom: "20px",
  color: TEXT_DARK
};

const alertsContainer = {
  backgroundColor: "white",
  padding: "35px",
  borderRadius: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
};

const alertsHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px"
};

const alertsTitle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "800",
  color: TEXT_DARK
};

const alertBadge = {
  background: "#FEE2E2",
  color: "#EF4444",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700"
};

const refButtonStyle = {
  background: "white",
  border: "1px solid #E2E8F0",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const manageButtonStyle = {
  background: "linear-gradient(135deg, #0ea5e9, #22c55e)",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "999px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
  transition: "all 0.2s ease"
};