import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/documents", label: "Document Library" },
  { to: "/documents/upload", label: "Upload Document" },
  { to: "/voice", label: "Voice Agent" },
  { to: "/analytics", label: "Analytics" },
  { to: "/settings", label: "Settings" },
];

export default function Layout({ children, creditBalance }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Voice RAG</h2>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {item.label}
            </NavLink>
          ))}
          <a onClick={logout} className="logout-link">
            Log out
          </a>
        </nav>
      </aside>
      <div className="main">
        <div className="topbar">
          {creditBalance != null && (
            <span className="credit-badge">{creditBalance} credits</span>
          )}
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
