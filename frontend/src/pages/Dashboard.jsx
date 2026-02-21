import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get('/inventory')
      .then((res) => setItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="page-container">
      <h1>Inventory Dashboard</h1>
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        items.map((item) => (
          <div key={item._id} className="inventory-item">
            <strong>{item.name}</strong>: {item.quantity}
          </div>
        ))
      )}
    </div>
  );
}