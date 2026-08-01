import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DocumentUpload from "./pages/DocumentUpload.jsx";
import DocumentLibrary from "./pages/DocumentLibrary.jsx";
import VoiceAgent from "./pages/VoiceAgent.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import SuperadminDashboard from "./pages/SuperadminDashboard.jsx";
import SuperadminOrgDetail from "./pages/SuperadminOrgDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentLibrary /></ProtectedRoute>} />
      <Route path="/documents/upload" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />
      <Route path="/voice" element={<ProtectedRoute><VoiceAgent /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute><SuperadminDashboard /></ProtectedRoute>} />
      <Route path="/admin/organizations/:id" element={<ProtectedRoute><SuperadminOrgDetail /></ProtectedRoute>} />
    </Routes>
  );
}
