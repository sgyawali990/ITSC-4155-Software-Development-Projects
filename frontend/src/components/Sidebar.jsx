import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("invq_token");
    localStorage.removeItem("invq_user_name");
    window.location.href = "/";
  };

  const sidebarStyle = {
    width: isOpen ? '260px' : '0px', 
    height: '100vh',
    backgroundColor: '#083344',
    color: 'white',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowX: 'hidden',
    transition: '0.3s', 
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: isOpen ? '20px' : '0px'
  };

  const linkStyle = {
    padding: '15px 25px',
    textDecoration: 'none',
    color: 'white',
    display: 'block',
    fontSize: '18px',
    transition: '0.2s'
  };

  return (
    <div style={sidebarStyle}>
     
      <button 
        onClick={toggleSidebar}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'white', 
          fontSize: '24px', 
          cursor: 'pointer',
          alignSelf: 'flex-end',
          marginRight: '20px'
        }}
      >
        ×
      </button>

      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>InvQ</h2>

      <Link to="/dashboard" style={linkStyle} onClick={toggleSidebar}>Dashboard</Link>
      <Link to="/inventory" style={linkStyle} onClick={toggleSidebar}>Inventory</Link>
      <Link to="/alerts" style={linkStyle} onClick={toggleSidebar}>Alerts</Link>
      <Link to="/settings" style={linkStyle} onClick={toggleSidebar}>Settings</Link>

    {/* LOGOUT BUTTON SECTION */}
    <div style={{ 
      marginTop: "auto", 
      padding: "20px", 
      paddingBottom: "50px" // This lifts it up from the bottom edge
    }}>
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#EF4444",
          color: "white",
          fontWeight: "700",
          cursor: "pointer",
          transition: "0.2s"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#EF4444"}
      >
        Logout
      </button>
    </div>

    </div>
  );
};

export default Sidebar;