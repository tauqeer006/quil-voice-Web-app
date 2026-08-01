import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { documents } from "../api/client";

const STATUS_CLASS = {
  ready: "status-ready",
  queued: "status-processing",
  chunking: "status-processing",
  embedding: "status-processing",
  failed: "status-failed",
};

export default function DocumentLibrary() {
  const [docs, setDocs] = useState([]);

  function load() {
    documents.list().then(setDocs).catch(() => {});
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000); // poll for status updates
    return () => clearInterval(interval);
  }, []);

  async function remove(id) {
    await documents.remove(id);
    load();
  }

  return (
    <Layout>
      <h1>Document Library</h1>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Filename</th><th>Type</th><th>Status</th><th>Chunks</th><th></th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="table-row">
                <td>{d.filename}</td>
                <td>{d.source_type}</td>
                <td><span className={`status-badge ${STATUS_CLASS[d.status] || ""}`}>{d.status}</span></td>
                <td>{d.num_chunks}</td>
                <td><a onClick={() => remove(d.id)} className="danger-link">Delete</a></td>
              </tr>
            ))}
          </tbody>
        </table>
        {docs.length === 0 && <p>No documents yet.</p>}
      </div>
    </Layout>
  );
}
