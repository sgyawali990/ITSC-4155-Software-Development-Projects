import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Lock, Bell, LayoutDashboard, 
  Save, ShieldCheck, Mail, CheckCircle,
  AlertTriangle, Smartphone, ShieldAlert,
  RefreshCw 
} from "lucide-react";

const BRAND_DARK = "#083344"; 
const BRAND_ACTION = "#22D3EE";
const BRAND_MIST = "#CFFAFE";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [userData, setUserData] = useState({
    name: "Kaitlyn Carrera",
    email: "kaitlyncarrera12@gmail.com",
  });

  const cardStyle = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flex: 1
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    marginTop: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f8fafc"
  };

  return (
    <div style={{
      backgroundColor: "#F8FAFC",
      backgroundImage: `radial-gradient(at 0% 0%, hsla(187, 92%, 92%, 1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(199, 89%, 88%, 1) 0px, transparent 50%)`,
      minHeight: "100vh",
      padding: "40px",
      fontFamily: '"Inter", sans-serif',
    }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: "30px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ background: 'none', border: 'none', color: "#64748b", cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <h1 style={{ margin: "10px 0 0 0", color: BRAND_DARK, fontSize: '32px', fontWeight: '800' }}>System Settings</h1>
        </div>
      </div>

      {/* CUBES */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
        <div style={cardStyle}>
          <div style={{ backgroundColor: BRAND_MIST, padding: '15px', borderRadius: '14px' }}>
            <ShieldCheck size={22} color={BRAND_ACTION} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>Security</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "800", color: BRAND_DARK }}>Active</p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ backgroundColor: BRAND_MIST, padding: '15px', borderRadius: '14px' }}>
            <Mail size={22} color={BRAND_ACTION} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>User</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "15px", fontWeight: "800", color: BRAND_DARK }}>{userData.email}</p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ backgroundColor: "#DCFCE7", padding: '15px', borderRadius: '14px' }}>
            <CheckCircle size={22} color="#16A34A" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>Status</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "800", color: BRAND_DARK }}>Healthy</p>
          </div>
        </div>
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
                backgroundColor: activeTab === tab.id ? BRAND_DARK : 'white',
                color: activeTab === tab.id ? 'white' : '#64748B',
                boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}>
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div>
              <h2 style={{ color: BRAND_DARK, marginBottom: '10px' }}>Profile Details</h2>
              <p style={{ color: '#64748B', marginBottom: '30px' }}>Manage your personal identification details.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: BRAND_DARK }}>FULL NAME</label>
                  <input style={inputStyle} value={userData.name} readOnly />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: BRAND_DARK }}>WORK EMAIL</label>
                  <input style={inputStyle} value={userData.email} readOnly />
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
                  <input type="password" style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: BRAND_DARK }}>NEW PASSWORD</label>
                  <input type="password" style={inputStyle} />
                </div>
                <button style={{ backgroundColor: BRAND_DARK, color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
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
                  { title: "Low Stock Alerts", desc: "Get notified when items hit reorder threshold", icon: <AlertTriangle size={20}/> },
                  { title: "Push Notifications", desc: "Receive alerts on your mobile device", icon: <Smartphone size={20}/> },
                  { title: "System Updates", desc: "News about new features and maintenance", icon: <RefreshCw size={20}/> }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid #F1F5F9', borderRadius: '16px' }}>
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
