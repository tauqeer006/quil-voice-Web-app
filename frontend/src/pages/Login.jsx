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
    <div style={{ maxWidth: 360, margin: "80px auto" }} className="card">
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        <button className="btn" type="submit" style={{ width: "100%" }}>Log in</button>
      </form>
      <p style={{ marginTop: 12, fontSize: 14 }}>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
