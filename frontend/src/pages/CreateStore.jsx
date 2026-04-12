import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const BRAND_DARK = "#083344";
const BRAND_ACTION = "#22D3EE";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("invq_token");

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Full Inventory Data:", data); 
      if (Array.isArray(data)) setInventory(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

 
  const filteredInventory = inventory.filter((item) => {
    const nameToSearch = item.name || item.itemName || item.productName || "";
    return nameToSearch.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <div style={{ padding: '40px', color: BRAND_DARK }}>Loading...</div>;

  return (
    <div style={{
      backgroundColor: "#F8FAFC",
      backgroundImage: `radial-gradient(at 0% 0%, hsla(187, 92%, 92%, 1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(199, 89%, 88%, 1) 0px, transparent 50%)`,
      minHeight: "100vh", padding: "40px", fontFamily: '"Inter", sans-serif',
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0, color: BRAND_DARK, fontSize: '32px', fontWeight: '800' }}>Products</h1>
        <button 
          onClick={() => navigate("/create-product")}
          style={{ backgroundColor: BRAND_DARK, color: "white", padding: "12px 24px", borderRadius: "12px", border: "none", fontWeight: "bold", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #FFFFFF' }}>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '24px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 10px 10px 42px', width: '100%', outline: 'none' }} 
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ color: '#94A3B8', fontWeight: '500', height: '60px' }}>
              <th style={{ paddingLeft: '24px' }}>ITEM NAME</th>
              <th>CURRENT QTY</th>
              <th>ALERT ME AT</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => {
              
              const displayName = item.name || item.itemName || item.productName || "No Name Found";
              const quantity = item.qty || item.quantity || 0;
              const threshold = item.threshold || item.reorderThreshold || 0;
              const isLow = Number(quantity) <= Number(threshold);
              
              return (
                <tr key={item._id || index} style={{ borderTop: '1px solid #F1F5F9', height: '72px' }}>
                  <td style={{ paddingLeft: '24px', fontWeight: '600', color: BRAND_DARK }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={16} color={BRAND_ACTION} /> 
                      {displayName} 
                    </div>
                  </td>
                  <td style={{ fontWeight: '700', color: BRAND_DARK }}>{quantity}</td>
                  <td>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: '8px', fontWeight: '700' }}>
                      {threshold}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '8px',
                      color: isLow ? "#B91C1C" : "#0F172A",
                      backgroundColor: isLow ? "#FEE2E2" : "#F1F5F9"
                    }}>
                      {isLow ? "LOW STOCK" : "OK"}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <MoreHorizontal size={20} color="#94A3B8" style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
