import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { auth, org } from "../api/client";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
    org.me().then(setOrganization).catch(() => {});
  }, []);

  return (
    <Layout>
      <h1>Settings</h1>
      <div className="card">
        <h3>Organization profile</h3>
        <p><strong>Name:</strong> {organization?.name}</p>
        <p><strong>Status:</strong> {organization?.status}</p>
      </div>
      <div className="card">
        <h3>Your account</h3>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
      <div className="card">
        <h3>Model configuration (read-only)</h3>
        <p>Model config is managed by your organization's deployment and set via environment variables on the AI service.</p>
      </div>
    </Layout>
  );
}
