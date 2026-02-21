import React, { useState } from 'react';
import api from '../services/api';

export default function CreateProduct() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // TODO: implement real API call when backend POST route exists
      alert('Product creation logic pending.');
    } catch {
      alert('Could not create product.');
    }
  };

  return (
    <div className="page-container">
      <h1>Create Product</h1>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}