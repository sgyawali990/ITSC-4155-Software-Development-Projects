import React, { useState } from "react";

export default function InventoryTable({ 
  inventory, 
  setInventory, 
  mode, 
  pendingChanges, 
  setPendingChanges 
}) {
  const [editingCell, setEditingCell] = useState(null); // { id, field }
  const [editValue, setEditValue] = useState("");
  const token = localStorage.getItem("invq_token");

  const startEditing = (itemId, field, currentValue) => {
    setEditingCell({ id: itemId, field });
    setEditValue(currentValue);
  };

  const saveEdit = async (itemId) => {
    if (!editingCell) return;

    const field = editingCell.field;
    const currentItem = inventory.find(i => i._id === itemId);

    // Use draft value for math if in EOD mode, otherwise DB value
    const baseValue = pendingChanges[itemId]?.[field] ?? currentItem[field];

    let newValue;
    const input = editValue.toString().trim();

    // MATH LOGIC
    if (field !== "itemName" && /^[+*/-]/.test(input)) {
      const operator = input.charAt(0);
      const operand = Number(input.substring(1));

      if (isNaN(operand)) {
        newValue = baseValue;
      } else {
        switch (operator) {
          case '+': newValue = baseValue + operand; break;
          case '-': newValue = baseValue - operand; break;
          case '*': newValue = baseValue * operand; break;
          case '/': newValue = operand !== 0 ? baseValue / operand : baseValue; break;
          default: newValue = baseValue;
        }
      }
    } else {
      newValue = field === "itemName" ? editValue : Number(editValue || 0);
    }

    if (field !== "itemName") {
      newValue = Math.max(0, Math.round(newValue * 100) / 100);
    }

    // --- EOD MODE LOGIC ---
    if (mode === "EOD") {
      const originalValue = currentItem[field];

      setPendingChanges(prev => {
        const updated = { ...prev };

        if (newValue === originalValue) {
          if (updated[itemId]) {
            delete updated[itemId][field];
            if (Object.keys(updated[itemId]).length === 0) {
              delete updated[itemId];
            }
          }
          return updated;
        }

        updated[itemId] = { ...updated[itemId], [field]: newValue };
        return updated;
      });

      setEditingCell(null);
      return;
    }

    // --- LIVE MODE LOGIC ---
    try {
      const updatedData = { ...currentItem, [field]: newValue };

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
            const hasPending = pendingChanges[item._id] && Object.keys(pendingChanges[item._id]).length > 0;

            return (
              <tr 
                key={item._id} 
                style={{ backgroundColor: hasPending ? '#fef9c3' : isLow ? '#fff1f1' : 'transparent' }}
              >
                <td style={cellStyle} onClick={() => startEditing(item._id, "itemName", item.itemName)}>
                  {editingCell?.id === item._id && editingCell?.field === "itemName" ? (
                    <input 
                      style={inputStyle} value={editValue} autoFocus 
                      onBlur={() => saveEdit(item._id)}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item._id)}
                    />
                  ) : item.itemName}
                </td>

                <td style={cellStyle} onClick={() => startEditing(item._id, "quantity", pendingChanges[item._id]?.quantity ?? item.quantity)}>
                  {editingCell?.id === item._id && editingCell?.field === "quantity" ? (
                    <input 
                      type="text" style={inputStyle} value={editValue} autoFocus 
                      onBlur={() => saveEdit(item._id)}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item._id)}
                    />
                  ) : (
                    mode === "EOD" && pendingChanges[item._id]?.quantity !== undefined ? (
                      <span style={{ color: "#f59e0b", fontWeight: "600" }}>
                        {item.quantity} → {pendingChanges[item._id].quantity}
                      </span>
                    ) : item.quantity
                  )}
                </td>

                <td style={cellStyle} onClick={() => startEditing(item._id, "reorderThreshold", pendingChanges[item._id]?.reorderThreshold ?? item.reorderThreshold)}>
                  {editingCell?.id === item._id && editingCell?.field === "reorderThreshold" ? (
                    <input 
                      type="text" style={inputStyle} value={editValue} autoFocus 
                      onBlur={() => saveEdit(item._id)}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item._id)}
                    />
                  ) : (
                    mode === "EOD" && pendingChanges[item._id]?.reorderThreshold !== undefined ? (
                      <span style={{ color: "#f59e0b", fontWeight: "600" }}>
                        {item.reorderThreshold} → {pendingChanges[item._id].reorderThreshold}
                      </span>
                    ) : item.reorderThreshold
                  )}
                </td>

                <td style={cellStyle}>
                  {isLow ? <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ LOW STOCK</span> : <span style={{ color: 'green' }}>✅ OK</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}