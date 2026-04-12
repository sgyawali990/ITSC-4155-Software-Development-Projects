import React, { useState } from 'react';
import Sidebar from './sidebar';

const Layout = ({ children }) => {
  // This "state" controls if the sidebar is visible
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      
      {/* 1. THE SIDEBAR: It only shows up when isOpen is true */}
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(false)} />
      
      <div style={{ flex: 1, backgroundColor: '#f8fafc', minWidth: 0 }}>
        
        {/* 2. THE TOP BAR: This holds your "Menu" toggle button */}
        <header style={{ 
          padding: '15px 25px', 
          backgroundColor: 'white', 
          display: 'flex', 
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
        }}>
          {!isOpen && (
            <button 
              onClick={() => setIsOpen(true)}
              style={{ 
                fontSize: '24px', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                marginRight: '20px',
                color: '#0a3d34' // Matching your dark green theme
              }}
            >
              ☰
            </button>
          )}
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#334155' }}>
            InvQuery Management
          </h2>
        </header>

        {/* 3. THE CONTENT: This is where Dashboard, Alerts, etc. will render */}
        <main style={{ padding: '30px' }}>
          {children}
        </main>

      </div>

      {/* 4. THE OVERLAY: Dims the background when the menu is open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 999 // Sits just below the Sidebar
          }}
        />
      )}
    </div>
  );
};

export default Layout;