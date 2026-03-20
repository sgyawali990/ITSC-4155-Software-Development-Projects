import React, { useState } from "react";

export default function InventoryTable({ inventory, setInventory }) {
  const [editingCell, setEditingCell] = useState(null); // { id, field }
  const [editValue, setEditValue] = useState("");
  const token = localStorage.getItem("invq_token");

  const startEditing = (itemId, field, currentValue) => {
    setEditingCell({ id: itemId, field });
    setEditValue(currentValue);
  };

  const saveEdit = async (itemId) => {
    if (!editingCell) return;

    try {
      const currentItem = inventory.find(i => i._id === itemId);
      
      const updatedData = {
        itemName: currentItem.itemName,
        quantity: currentItem.quantity,
        reorderThreshold: currentItem.reorderThreshold,
        [editingCell.field]: editingCell.field === "itemName" 
          ? editValue 
          : Number(editValue || 0)
      };

      const res = await fetch(`http://localhost:4000/inventory/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      setInventory(prev => prev.map(item => (item._id === itemId ? data : item)));
      setEditingCell(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (!inventory || inventory.length === 0) {
    return <p>No items found. Try applying a template or adding an item!</p>;
  }

  const cellStyle = { padding: '10px', cursor: 'pointer', border: '1px solid #eee' };
  const inputStyle = { width: '100%', border: '1px solid #007bff', outline: 'none', padding: '5px' };

  return (
    <div className="table-container">
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ textAlign: 'left', background: '#f8f9fa', borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px' }}>Item Name</th>
            <th style={{ padding: '10px' }}>Quantity</th>
            <th style={{ padding: '10px' }}>Threshold</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const isLow = item.quantity <= item.reorderThreshold;
            return (
              <tr key={item._id} style={{ backgroundColor: isLow ? '#fff1f1' : 'transparent' }}>
                
                {/* ITEM NAME CELL */}
                <td style={cellStyle} onClick={() => startEditing(item._id, "itemName", item.itemName)}>
                  {editingCell?.id === item._id && editingCell?.field === "itemName" ? (
                    <input 
                      style={inputStyle}
                      value={editValue} 
                      autoFocus 
                      onBlur={() => saveEdit(item._id)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditValue(val === "" ? "" : val);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item._id)}
                    />
                  ) : item.itemName}
                </td>

                {/* QUANTITY CELL */}
                <td style={cellStyle} onClick={() => startEditing(item._id, "quantity", item.quantity)}>
                  {editingCell?.id === item._id && editingCell?.field === "quantity" ? (
                    <input 
                      type="number"
                      style={inputStyle}
                      value={editValue} 
                      autoFocus 
                      onBlur={() => saveEdit(item._id)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditValue(val === "" ? "" : val);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item._id)}
                    />
                  ) : item.quantity}
                </td>

                {/* THRESHOLD CELL */}
                <td style={cellStyle} onClick={() => startEditing(item._id, "reorderThreshold", item.reorderThreshold)}>
                  {editingCell?.id === item._id && editingCell?.field === "reorderThreshold" ? (
                    <input 
                      type="number"
                      style={inputStyle}
                      value={editValue} 
                      autoFocus 
                      onBlur={() => saveEdit(item._id)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditValue(val === "" ? "" : val);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item._id)}
                    />
                  ) : item.reorderThreshold}
                </td>

                {/* STATUS CELL */}
                <td style={cellStyle}>
                  {isLow ? (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ LOW STOCK</span>
                  ) : (
                    <span style={{ color: 'green' }}>✅ OK</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}