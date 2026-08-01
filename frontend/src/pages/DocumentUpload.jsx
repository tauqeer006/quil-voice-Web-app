import React, { useState } from "react";
import Layout from "../components/Layout.jsx";
import { documents } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  async function handleFileUpload(e) {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setStatus("Uploading…");
    try {
      await documents.upload(formData);
      setStatus("Queued for processing.");
      setTimeout(() => navigate("/documents"), 800);
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function handleUrlSubmit(e) {
    e.preventDefault();
    if (!url) return;
    const formData = new FormData();
    formData.append("source_url", url);
    setStatus("Scraping URL…");
    try {
      await documents.upload(formData);
      setStatus("Queued for processing.");
      setTimeout(() => navigate("/documents"), 800);
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <Layout>
      <h1>Upload a document</h1>
      <div className="grid">
        <form className="card" onSubmit={handleFileUpload}>
          <h3>Drag & drop / choose file</h3>
          <input type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0])} />
          <button className="btn" type="submit">Upload</button>
        </form>
        <form className="card" onSubmit={handleUrlSubmit}>
          <h3>Add from URL</h3>
          <input placeholder="https://example.com/article" value={url}
            onChange={(e) => setUrl(e.target.value)} />
          <button className="btn" type="submit">Scrape & ingest</button>
        </form>
      </div>
      {status && <p className="card">{status}</p>}
    </Layout>
  );
}
