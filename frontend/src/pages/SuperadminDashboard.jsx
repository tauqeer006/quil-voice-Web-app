import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import { admin } from "../api/client";

export default function SuperadminDashboard() {
  const [orgs, setOrgs] = useState([]);

  function load() {
    admin.organizations().then(setOrgs).catch(() => {});
  }
  useEffect(load, []);

  async function toggleStatus(o) {
    await admin.suspend(o.id, o.status === "active" ? "suspended" : "active");
    load();
  }

  return (
    <Layout>
      <h1>All Organizations</h1>
      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Name</th><th>Status</th><th>Documents</th><th>Credits used</th><th></th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "8px 0" }}><Link to={`/admin/organizations/${o.id}`}>{o.name}</Link></td>
                <td>{o.status}</td>
                <td>{o.document_count}</td>
                <td>{o.credits_used} / {o.credits_total}</td>
                <td>
                  <a onClick={() => toggleStatus(o)} style={{ cursor: "pointer", color: "#4338ca" }}>
                    {o.status === "active" ? "Suspend" : "Activate"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
