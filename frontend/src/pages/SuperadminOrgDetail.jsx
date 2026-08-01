import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { admin } from "../api/client";

export default function SuperadminOrgDetail() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);

  useEffect(() => {
    admin.organizationDetail(id).then(setOrg).catch(() => {});
  }, [id]);

  if (!org) return <Layout><p>Loading…</p></Layout>;

  return (
    <Layout>
      <h1>{org.name}</h1>
      <div className="grid">
        <div className="card"><h3>Users</h3><p style={{ fontSize: 28 }}>{org.users.length}</p></div>
        <div className="card"><h3>Documents</h3><p style={{ fontSize: 28 }}>{org.documents.length}</p></div>
        <div className="card"><h3>Credits</h3><p style={{ fontSize: 28 }}>{org.credits_used} / {org.credits_total}</p></div>
      </div>
      <div className="card">
        <h3>Call history</h3>
        {org.call_history.map((c) => (
          <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            {new Date(c.started_at).toLocaleString()} — {c.credits_consumed} credits
          </div>
        ))}
        {org.call_history.length === 0 && <p>No calls yet.</p>}
      </div>
    </Layout>
  );
}
