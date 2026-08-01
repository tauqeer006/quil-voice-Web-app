import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <h1>Talk to your documents.</h1>
      <p style={{ maxWidth: 480, margin: "16px auto", color: "#555" }}>
        Upload PDFs, Word docs, or scrape a URL — then call an AI voice agent
        that answers questions using your organization's own knowledge base.
      </p>
      <div style={{ marginTop: 24 }}>
        <Link to="/signup" className="btn" style={{ marginRight: 12 }}>Sign Up</Link>
        <Link to="/login" className="btn secondary">Login</Link>
      </div>
    </div>
  );
}
