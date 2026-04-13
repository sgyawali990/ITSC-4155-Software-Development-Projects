import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', width: '100vw', overflowX: 'hidden' }}>
      
      {/* 1. SIDEBAR */}
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(false)} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* 2. TOP BAR */}
        <header style={{ 
          padding: '15px 25px', 
          backgroundColor: 'white', 
          display: 'flex', 
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          zIndex: 10 // Stays above content
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
                color: '#0a3d34' 
              }}
            >
              ☰
            </button>
          )}
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#334155', fontWeight: '800' }}>
            InvQ Management
          </h2>
        </header>

        {/* 3. THE CONTENT: Removed padding and bg color here */}
        <main style={{ flex: 1, position: 'relative' }}>
          {children}
        </main>

      </div>

      {/* 4. OVERLAY */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 999 
          }}
        />
      )}
    </div>
  );
};

export default Layout;