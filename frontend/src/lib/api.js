const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

async function request(path, options = {}) {
  const token = localStorage.getItem("access_token");
  const headers = { ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body && !(options.body instanceof URLSearchParams)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  register: (email, password, full_name) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    }),

  login: (email, password) => {
    const body = new URLSearchParams();
    body.set("username", email);
    body.set("password", password);
    return request("/auth/login", { method: "POST", body });
  },

  me: () => request("/users/me"),

  mySubscription: () => request("/billing/me"),
};

export default api;
