import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, Plus, Minus, AlertCircle, RefreshCw, LayoutDashboard,
  Search, Download, Printer, ExternalLink, Trash2
} from "lucide-react";
import AlertsPanel from "../components/Alerts/AlertsPanel";

const BRAND_DARK = "#083344";
const BRAND_ACTION = "#22D3EE";
const BRAND_MIST = "#CFFAFE";

export default function CreateProduct() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("invq_token");

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setInventory(data);
    } catch (err) { console.error("Fetch Error:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveEdit = async (itemId, field, currentVal) => {
    const input = editValue.toString().trim();
    let newValue;

    // Support temp items (Add Row logic)
    if (itemId.toString().startsWith("temp-")) {
      if (field === "itemName" && input === "") return;

      const res = await fetch("http://localhost:4000/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          itemName: field === "itemName" ? input : "",
          quantity: field === "quantity" ? Number(input) : 0,
          reorderThreshold: field === "reorderThreshold" ? Number(input) : 0
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setInventory(prev =>
          prev.map(item => (item._id === itemId ? created : item))
        );
      }
      setEditingCell(null);
      return;
    }

    if (field !== "itemName" && /^[+*/-]/.test(input)) {
      const operator = input.charAt(0);
      const operand = Number(input.substring(1));
      if (!isNaN(operand)) {
        switch (operator) {
          case "+": newValue = currentVal + operand; break;
          case "-": newValue = currentVal - operand; break;
          case "*": newValue = currentVal * operand; break;
          case "/": newValue = operand !== 0 ? currentVal / operand : currentVal; break;
          default: newValue = currentVal;
        }
      } else newValue = currentVal;
    } else {
      newValue = field === "itemName" ? input : Number(input || 0);
    }

    if (field !== "itemName") {
      newValue = Math.max(0, Math.floor(newValue));
    }

    try {
      const res = await fetch(`http://localhost:4000/inventory/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [field]: newValue })
      });
      if (res.ok) {
        const updated = await res.json();
        setInventory(prev => prev.map(item => (item._id === itemId ? { ...updated } : item)));
      }
    } catch (err) { console.error(err); }
    setEditingCell(null);
  };

  const handleUpdateQty = async (id, currentQty, change) => {
    const newQty = Math.max(0, currentQty + change);
    try {
      const res = await fetch(`http://localhost:4000/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInventory(prev => prev.map(item => (item._id === id ? { ...updated } : item)));
      }
    } catch (err) { console.error("Update Error:", err); }
  };

  const handleDelete = async (id) => {
    if (id.toString().startsWith("temp-")) {
      setInventory(prev => prev.filter(i => i._id !== id));
      return;
    }
    try {
      await fetch(`http://localhost:4000/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(prev => prev.filter(i => i._id !== id));
    } catch (err) { console.error(err); }
  };

  const exportCSV = () => {
    const headers = "Item Name,Quantity,Threshold\n";
    const rows = inventory.map(item => `${item.itemName},${item.quantity},${item.reorderThreshold}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "inventory_report.csv"; a.click();
  };

  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const filteredInventory = safeInventory.filter(item =>
    (item.itemName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = safeInventory.filter(item =>
    item.itemName &&
    Number(item.quantity || 0) <= Number(item.reorderThreshold || 0)
  ).length;

  const totalQuantity = safeInventory.reduce((sum, item) =>
    sum + (Number(item.quantity) || 0), 0
  );

  const lowStockItems = safeInventory.filter(item =>
    item.itemName &&
    Number(item.quantity || 0) <= Number(item.reorderThreshold || 0)
  );

  const inputStyle = {
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "inherit",
    color: BRAND_DARK,
    textAlign: "center",
    border: `1px solid ${BRAND_ACTION}`,
    borderRadius: "6px",
    padding: "4px",
    outline: "none",
    width: "80%"
  };

  const primaryButtonStyle = {
    background: "linear-gradient(135deg, #0ea5e9, #22c55e)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    transition: "all 0.2s ease"
  };

  if (loading) return <div style={{ padding: '40px' }}>Syncing Inventory...</div>;

  return (
    <div className="printable-area" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", padding: "40px" }}>

      <div style={{ marginBottom: "30px", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            style={primaryButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)";
            }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <h1 style={{ margin: 0, color: BRAND_DARK, fontSize: '32px', fontWeight: '800' }}>Inventory</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }} className="no-print">
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontWeight: '600', cursor: 'pointer' }}>
            <Printer size={18} /> Print
          </button>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: 'none', backgroundColor: BRAND_ACTION, color: BRAND_DARK, fontWeight: '700', cursor: 'pointer' }}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
        {[
          { label: "Unique Items", value: safeInventory.length, icon: <Package size={22} color={BRAND_ACTION} /> },
          { label: "Low Stock", value: lowStockCount, icon: <AlertCircle size={22} color="#EF4444" /> },
          { label: "Total Stock", value: totalQuantity, icon: <RefreshCw size={22} color={BRAND_ACTION} /> }
        ].map((card, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: "white", padding: "24px", borderRadius: "20px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: card.label === "Low Stock" ? "#FEE2E2" : BRAND_MIST, padding: '15px', borderRadius: '14px' }}>{card.icon}</div>
            <div>
              <h3 style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>{card.label}</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "28px", fontWeight: "800", color: BRAND_DARK }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "30px" }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <button
              onClick={() => {
                setInventory(prev => [
                  {
                    _id: "temp-" + Date.now(),
                    itemName: "",
                    quantity: "",
                    reorderThreshold: ""
                  },
                  ...prev
                ]);
              }}
              style={{ padding: "10px 16px", borderRadius: "10px", border: "none", backgroundColor: BRAND_DARK, color: "white", fontWeight: "600", cursor: "pointer" }}
            >
              + Add Item
            </button>
            <div className="no-print" style={{ display: 'flex', gap: '12px', background: 'white', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', width: '300px' }}>
              <Search color="#94A3B8" size={20} />
              <input placeholder="Search inventory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F8FAFC', color: '#64748B', fontSize: '11px' }}>
                <tr>
                  <th style={{ padding: '18px 24px', textAlign: 'left' }}>ITEM</th>
                  <th style={{ textAlign: 'center' }}>STOCK</th>
                  <th style={{ textAlign: 'center' }}>ALERT</th>
                  <th style={{ textAlign: 'center' }}>REORDER</th>
                  <th style={{ textAlign: 'center' }}>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  const isEmpty = !item.itemName;
                  const isLow = !isEmpty && Number(item.quantity) <= Number(item.reorderThreshold);
                  return (
                    <tr key={item._id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '18px 24px', fontWeight: '600', color: BRAND_DARK }}>
                        {editingCell?.id === item._id && editingCell?.field === "itemName" ? (
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSaveEdit(item._id, "itemName", item.itemName)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(item._id, "itemName", item.itemName)}
                            style={{ ...inputStyle, textAlign: 'left', width: '100%' }}
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setEditingCell({ id: item._id, field: "itemName" });
                              setEditValue(item.itemName || "");
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {item.itemName || "Click to name item..."}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <button onClick={() => handleUpdateQty(item._id, item.quantity, -1)} style={{ padding: '2px', borderRadius: '4px', border: '1px solid #CBD5E1', cursor: 'pointer' }}><Minus size={12} /></button>
                          {editingCell?.id === item._id && editingCell?.field === "quantity" ? (
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => handleSaveEdit(item._id, "quantity", item.quantity)}
                              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(item._id, "quantity", item.quantity)}
                              style={inputStyle}
                            />
                          ) : (
                            <span
                              onClick={() => { setEditingCell({ id: item._id, field: "quantity" }); setEditValue(item.quantity || ""); }}
                              style={{ minWidth: '30px', fontWeight: '800', color: isLow ? '#EF4444' : BRAND_DARK, cursor: 'pointer' }}
                            >
                              {item.quantity === "" ? "" : item.quantity}
                            </span>
                          )}
                          <button onClick={() => handleUpdateQty(item._id, item.quantity, 1)} style={{ padding: '2px', borderRadius: '4px', border: '1px solid #CBD5E1', cursor: 'pointer' }}><Plus size={12} /></button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {editingCell?.id === item._id && editingCell?.field === "reorderThreshold" ? (
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSaveEdit(item._id, "reorderThreshold", item.reorderThreshold)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(item._id, "reorderThreshold", item.reorderThreshold)}
                            style={inputStyle}
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setEditingCell({ id: item._id, field: "reorderThreshold" });
                              setEditValue(item.reorderThreshold || "");
                            }}
                            style={{ color: '#64748B', fontWeight: '600', cursor: 'pointer' }}
                          >
                            {item.reorderThreshold === "" ? "" : item.reorderThreshold}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {!isEmpty && (
                          <button
                            style={{ background: 'none', border: 'none', color: BRAND_ACTION, cursor: 'pointer' }}
                            onClick={() => window.open(`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.itemName + " bulk discount")}`, "_blank")}
                          >
                            <ExternalLink size={18} />
                          </button>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => handleDelete(item._id)} style={{ color: "#EF4444", border: "none", background: "none", cursor: "pointer" }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="no-print" style={{ backgroundColor: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", height: 'fit-content' }}>
          <h3 style={{ marginBottom: "20px", color: BRAND_DARK, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={22} color="#EF4444" /> Live Alerts
          </h3>
          <AlertsPanel inventory={lowStockItems} />
        </div>
      </div>

      <style>{`
        @media print { .no-print { display: none !important; } .printable-area { padding: 0 !important; background: white !important; } table { width: 100% !important; border: 1px solid #eee !important; } }
      `}</style>
    </div>
  );
}