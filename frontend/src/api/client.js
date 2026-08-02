const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(path, { method = "GET", body, isForm = false, skipAuth = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token && !skipAuth) headers["Authorization"] = `Bearer ${token}`;
  if (!isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

export const auth = {
  signup: (data) => apiRequest("/auth/signup/", { method: "POST", body: data, skipAuth: true }),
  login: (data) => apiRequest("/auth/login/", { method: "POST", body: data, skipAuth: true }),
  me: () => apiRequest("/auth/me/"),
};

export const org = {
  me: () => apiRequest("/orgs/me/"),
  credits: () => apiRequest("/orgs/credits/"),
};

export const documents = {
  list: () => apiRequest("/documents/"),
  upload: (formData) => apiRequest("/documents/upload/", { method: "POST", body: formData, isForm: true }),
  remove: (id) => apiRequest(`/documents/${id}/`, { method: "DELETE" }),
};

export const voice = {
  openSession: () => apiRequest("/ai/voice/session/", { method: "POST" }),
};

export const admin = {
  organizations: () => apiRequest("/admin/organizations/"),
  organizationDetail: (id) => apiRequest(`/admin/organizations/${id}/`),
  suspend: (id, status) => apiRequest(`/admin/organizations/${id}/suspend/`, { method: "POST", body: { status } }),
};
