import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Lock, Bell, LayoutDashboard,
  Save, ShieldCheck, Mail, CheckCircle,
  AlertTriangle, Smartphone, ShieldAlert,
  RefreshCw, Moon, Sun
} from "lucide-react";

const BRAND_DARK = "#083344";
const BRAND_ACTION = "#22D3EE";
const BRAND_MIST = "#CFFAFE";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // 🔥 8. OPTIONAL: LIGHT/DARK MODE (PERSISTS WITHOUT BACKEND)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("invq_dark_mode") === "true"
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("invq_dark_mode", newMode);
  };

  const username = localStorage.getItem("invq_user_name") || "User";
  const emailRaw = localStorage.getItem("invq_user_email") || "example@gmail.com";

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;

    const visible = name.slice(-3);
    const masked = "*".repeat(Math.max(0, name.length - 3));

    return masked + visible + "@" + domain;
  };

  const [userData, setUserData] = useState({
    username: username,
    email: maskEmail(emailRaw),
  });

  // 🔥 2. TOP “CUBES” STYLE
  const cardStyle = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flex: 1,
    transition: "all 0.25s ease",
    cursor: "default"
  };

  // 🔥 5. INPUT FIELDS STYLE
  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    marginTop: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease"
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "40px",
      fontFamily: '"Inter", sans-serif',
      // 🔥 1. GLOBAL PAGE FEEL
      background: `
        radial-gradient(circle at top left, #dbeafe, transparent 40%),
        radial-gradient(circle at bottom right, #cffafe, transparent 40%),
        #f8fafc
      `,
    }}>

      {/* HEADER */}
      <div style={{ marginBottom: "30px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              background: "linear-gradient(135deg, #22c55e, #14b8a6)",
              color: "white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "all 0.25s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
            }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          <h1
            style={{
              margin: "12px 0 0 0",
              color: BRAND_DARK,
              fontSize: "32px",
              fontWeight: "800"
            }}
          >
            System Settings
          </h1>
        </div>
      </div>

      {/* CUBES */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
        {[
          { icon: <ShieldCheck size={22} color={BRAND_ACTION} />, label: "Security", val: "Active", bg: BRAND_MIST },
          { icon: <Mail size={22} color={BRAND_ACTION} />, label: "User", val: userData.email, bg: BRAND_MIST },
          { icon: <CheckCircle size={22} color="#16A34A" />, label: "Status", val: "Healthy", bg: "#DCFCE7" }
        ].map((cube, i) => (
          <div
            key={i}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 20px 30px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ backgroundColor: cube.bg, padding: '15px', borderRadius: '14px' }}>
              {cube.icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>{cube.label}</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: i === 1 ? "15px" : "18px", fontWeight: "800", color: BRAND_DARK }}>{cube.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px" }}>

        {/* SIDEBAR NAVIGATION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: "profile", label: "Account Profile", icon: <User size={20} /> },
            { id: "security", label: "Security", icon: <Lock size={20} /> },
            { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px',
                borderRadius: '14px', border: 'none', cursor: 'pointer', fontWeight: '700',
                transition: 'all 0.25s ease',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #083344, #065f46)' : 'white',
                color: activeTab === tab.id ? 'white' : '#64748B',
                boxShadow: activeTab === tab.id ? '0 10px 20px rgba(8,51,68,0.2)' : '0 4px 6px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.transform = "translateX(6px)";
                  e.currentTarget.style.background = "#f1f5f9";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.background = "white";
                }
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
          transition: "all 0.3s ease"
        }}>

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div>
              <h2 style={{ color: BRAND_DARK, marginBottom: '10px' }}>Profile Details</h2>
              <p style={{ color: '#64748B', marginBottom: '30px' }}>Manage your personal identification details.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: BRAND_DARK }}>USERNAME</label>
                  <input
                    style={inputStyle}
                    value={userData.username}
                    readOnly
                    onFocus={(e) => {
                      e.target.style.border = "1px solid #22c55e";
                      e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid #E2E8F0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: BRAND_DARK }}>EMAIL</label>
                  <input
                    style={inputStyle}
                    value={userData.email}
                    readOnly
                    onFocus={(e) => {
                      e.target.style.border = "1px solid #22c55e";
                      e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid #E2E8F0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div>
              <h2 style={{ color: BRAND_DARK, marginBottom: '10px' }}>Security Settings</h2>
              <p style={{ color: '#64748B', marginBottom: '30px' }}>Ensure your account is protected with a strong password.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: BRAND_DARK }}>CURRENT PASSWORD</label>
                  <input
                    type="password"
                    style={inputStyle}
                    placeholder="••••••••"
                    onFocus={(e) => {
                      e.target.style.border = "1px solid #22c55e";
                      e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid #E2E8F0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: BRAND_DARK }}>NEW PASSWORD</label>
                  <input
                    type="password"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid #22c55e";
                      e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid #E2E8F0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <button
                  style={{
                    background: "linear-gradient(135deg, #083344, #065f46)",
                    color: 'white', padding: '14px', borderRadius: '12px',
                    border: 'none', fontWeight: '700', cursor: 'pointer',
                    transition: 'all 0.25s ease', boxShadow: "0 6px 14px rgba(8,51,68,0.25)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(8,51,68,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(8,51,68,0.25)";
                  }}
                >
                  Update Password
                </button>

                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#FFF7ED', borderRadius: '12px', border: '1px solid #FFEDD5', display: 'flex', gap: '12px' }}>
                  <ShieldAlert color="#EA580C" />
                  <p style={{ margin: 0, fontSize: '13px', color: '#9A3412' }}>
                    <strong>Two-Factor Authentication:</strong> 2FA is currently managed by your organization's security policy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ color: BRAND_DARK, marginBottom: '10px' }}>Notification Preferences</h2>
              <p style={{ color: '#64748B', marginBottom: '30px' }}>Choose how you want to be alerted about stock levels.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: "Low Stock Alerts", desc: "Get notified when items hit reorder threshold", icon: <AlertTriangle size={20} /> },
                  { title: "Push Notifications", desc: "Receive alerts on your mobile device", icon: <Smartphone size={20} /> },
                  { title: "System Updates", desc: "News about new features and maintenance", icon: <RefreshCw size={20} /> }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '20px', border: '1px solid #F1F5F9', borderRadius: '16px',
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ color: BRAND_ACTION }}>{item.icon}</div>
                      <div>
                        <p style={{ margin: 0, fontWeight: '700', color: BRAND_DARK }}>{item.title}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>{item.desc}</p>
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: BRAND_DARK }} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}