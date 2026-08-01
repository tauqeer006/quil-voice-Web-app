import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { org } from "../api/client";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    org.me().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <Layout><p style={{ color: "#dc2626" }}>{error}</p></Layout>;
  if (!data) return <Layout><p>Loading…</p></Layout>;

  return (
    <Layout creditBalance={data.credits_total - data.credits_used}>
      <h1>{data.name}</h1>
      <div className="grid">
        <div className="card"><h3>Documents</h3><p style={{ fontSize: 28 }}>{data.document_count}</p></div>
        <div className="card"><h3>Credits used</h3><p style={{ fontSize: 28 }}>{data.credits_used} / {data.credits_total}</p></div>
        <div className="card"><h3>Status</h3><p style={{ fontSize: 28 }}>{data.status}</p></div>
      </div>
      <div className="card">
        <h3>Recent calls</h3>
        {data.recent_calls.length === 0 && <p>No calls yet.</p>}
        {data.recent_calls.map((c) => (
          <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <strong>{new Date(c.started_at).toLocaleString()}</strong> — {c.credits_consumed} credits
          </div>
        ))}
      </div>
    </Layout>
  );
}
