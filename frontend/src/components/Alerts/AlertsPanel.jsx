import React, { useEffect, useState } from "react";
import axios from "axios";
import AlertsPanel from "../components/AlertsPanel";

export default function Alerts() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/api/inventory");

        setInventory(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load alerts data");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Alerts Page</h1>

      {loading && <p>Loading alerts...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <AlertsPanel inventory={inventory} />
      )}
    </div>
  );
}