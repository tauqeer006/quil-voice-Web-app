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
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th><th>Status</th><th>Documents</th><th>Credits used</th><th></th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.id} className="table-row">
                <td>{o.name}</td>
                <td>{o.status}</td>
                <td>{o.document_count}</td>
                <td>{o.credits_used} / {o.credits_total}</td>
                <td>
                  <a onClick={() => toggleStatus(o)} className="action-link">
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
