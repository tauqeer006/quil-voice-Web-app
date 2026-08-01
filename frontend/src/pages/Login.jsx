import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../api/client";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await auth.login(form);
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Log in</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input placeholder="Email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="error-message">{error}</p>}
          <button className="btn btn-block" type="submit">Log in</button>
        </form>
        <div className="form-footer">
          No account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
