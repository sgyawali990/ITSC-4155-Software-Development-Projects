import React, { useState } from "react";

export default function InventoryTable({
  inventory,
  setInventory,
  mode,
  pendingChanges,
  setPendingChanges
}) {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  const token = localStorage.getItem("invq_token");

  const startEditing = (id, field, value) => {
    setEditingCell({ id, field });
    setEditValue(value);
  };

  const saveEdit = async (id) => {
    if (!editingCell) return;

    const field = editingCell.field;
    const item = inventory.find(i => i._id === id);
    if (!item) return;

    const input = editValue.toString().trim();
    let newValue;

    // math parsing
    if (field !== "itemName" && /^[+*/-]/.test(input)) {
      const op = input[0];
      const num = Number(input.slice(1));

      if (isNaN(num)) newValue = item[field];
      else {
        if (op === "+") newValue = item[field] + num;
        if (op === "-") newValue = item[field] - num;
        if (op === "*") newValue = item[field] * num;
        if (op === "/") newValue = num !== 0 ? item[field] / num : item[field];
      }
    } else {
      // Prevent empty input bug causing silent NaN breaks
      if (field === "itemName") {
        newValue = input || item.itemName;
      } else {
        const parsed = Number(input);
        newValue = isNaN(parsed) ? item[field] : parsed;
      }
    }

    if (field !== "itemName") {
      newValue = Math.max(0, Math.floor(newValue));
    }

    try {
      const res = await fetch(
        `http://localhost:4000/inventory/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ [field]: newValue })
        }
      );

      if (res.ok) {
        const updated = await res.json();

        setInventory(prev =>
          prev.map(i => (i._id === id ? updated : i))
        );
        // Clear edit value to prevent ghosts
        setEditValue(""); 
      }
    } catch (err) {
      console.error(err);
    }

    setEditingCell(null);
  };

  const updateQty = async (id, qty, change) => {
    const newQty = Math.max(0, qty + change);

    try {
      const res = await fetch(
        `http://localhost:4000/inventory/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: newQty })
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setInventory(prev =>
          prev.map(i => (i._id === id ? updated : i))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Proper Reorder Function
  const handleReorderSearch = (itemName) => {
    if (!itemName) return;
    const query = encodeURIComponent(itemName + " bulk discount");
    window.open(`https://www.google.com/search?tbm=shop&q=${query}`, "_blank");
  };

  // Shared Visual Feedback Style
  const inputStyle = {
    border: "2px solid #22D3EE",
    background: "#f0fdfa",
    padding: "2px 4px",
    borderRadius: "4px",
    outline: "none"
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Alert</th>
          <th>Reorder</th>
        </tr>
      </thead>

      <tbody>
        {inventory.map(item => {
          const isLow = item.quantity <= item.reorderThreshold;

          return (
            <tr key={item._id}>
              {/* NAME */}
              {/* Wrap click ONLY on span, remove td onClick */}
              <td>
                {editingCell?.id === item._id &&
                editingCell?.field === "itemName" ? (
                  <input
                    autoFocus
                    value={editValue}
                    style={inputStyle}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={(e) => {
                      e.preventDefault(); // Force save before blur loss
                      saveEdit(item._id);
                    }}
                    onKeyDown={e =>
                      e.key === "Enter" && saveEdit(item._id)
                    }
                  />
                ) : (
                  <span 
                    onClick={() => startEditing(item._id, "itemName", item.itemName)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.itemName}
                  </span>
                )}
              </td>

              {/* QTY */}
              <td>
                <button onClick={() => updateQty(item._id, item.quantity, -1)}>
                  -
                </button>

                {editingCell?.id === item._id &&
                editingCell?.field === "quantity" ? (
                  <input
                    autoFocus
                    value={editValue}
                    style={{ ...inputStyle, width: "50px", textAlign: "center", margin: "0 8px" }}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={(e) => {
                      e.preventDefault(); 
                      saveEdit(item._id);
                    }}
                    onKeyDown={e =>
                      e.key === "Enter" && saveEdit(item._id)
                    }
                  />
                ) : (
                  <span
                    onClick={() =>
                      startEditing(item._id, "quantity", item.quantity)
                    }
                    style={{ 
                      color: isLow ? "red" : "black", 
                      cursor: "pointer", 
                      margin: "0 10px",
                      display: "inline-block",
                      minWidth: "20px",
                      textAlign: "center"
                    }}
                  >
                    {item.quantity}
                  </span>
                )}

                <button onClick={() => updateQty(item._id, item.quantity, 1)}>
                  +
                </button>
              </td>

              {/* THRESHOLD */}
              {/* Wrap click ONLY on span, remove td onClick */}
              <td>
                {editingCell?.id === item._id &&
                editingCell?.field === "reorderThreshold" ? (
                  <input
                    autoFocus
                    value={editValue}
                    style={{ ...inputStyle, width: "50px", textAlign: "center" }}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={(e) => {
                      e.preventDefault(); 
                      saveEdit(item._id);
                    }}
                    onKeyDown={e =>
                      e.key === "Enter" && saveEdit(item._id)
                    }
                  />
                ) : (
                  <span 
                    onClick={() => startEditing(item._id, "reorderThreshold", item.reorderThreshold)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.reorderThreshold}
                  </span>
                )}
              </td>

              {/* REORDER */}
              <td>
                {isLow && (
                  <button onClick={() => handleReorderSearch(item.itemName)}>
                    🔍
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}