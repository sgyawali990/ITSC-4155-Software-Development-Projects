import React from "react";

export default function AlertsPanel({ inventory }) {
  // Filter using itemName and reorderThreshold
  const lowStock = inventory.filter((item) => item.quantity <= item.reorderThreshold);

  return (
    <div className="alerts-panel" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Critical Alerts</h2>

      {lowStock.length > 0 ? (
        <div className="alert-list">
          {lowStock.map((item) => (
            <div 
              key={item._id} // Uses MongoDB _id
              className="alert-item" 
              style={{ 
                backgroundColor: '#fff1f1', 
                borderLeft: '4px solid red', 
                padding: '10px', 
                marginBottom: '10px' 
              }}
            >
              <strong>{item.itemName}</strong> {/* Uses itemName */}
              <p style={{ margin: '5px 0 0', fontSize: '0.9rem' }}>
                Only <b>{item.quantity}</b> remaining (Threshold: {item.reorderThreshold})
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'green' }}>All stock levels are healthy.</p>
      )}
    </div>
  );
}