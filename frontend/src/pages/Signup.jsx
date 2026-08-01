import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../api/client";

export default function Signup() {
  const [form, setForm] = useState({ organization_name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await auth.signup(form);
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create your organization</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input placeholder="Organization name" value={form.organization_name}
            onChange={(e) => setForm({ ...form, organization_name: e.target.value })} required />
          <input placeholder="Admin email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="error-message">{error}</p>}
          <button className="btn btn-block" type="submit">Sign up</button>
        </form>
        <div className="form-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
