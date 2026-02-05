import { ENV } from "../config/env";

const REQUEST_TIMEOUT_MS = 10000;

async function request(path, { method = "GET", body, token } = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${ENV.API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error("Koneksi timeout. Periksa API dan jaringan.");
    }
    throw new Error("Koneksi gagal. Periksa API dan jaringan.");
  } finally {
    clearTimeout(timeoutId);
  }

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore parse error
  }

  if (!res.ok) {
    const message = data?.message || `Request gagal (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export function login({ username, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { username, password }
  });
}

export function createShipment(payload, token) {
  return request("/shipments", {
    method: "POST",
    body: payload,
    token
  });
}

export function listShipments(params, token) {
  const entries = params ? Object.entries(params) : [];
  const query =
    entries.length > 0
      ? `?${entries
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&")}`
      : "";
  return request(`/shipments${query}`, { token });
}

export function deleteAllShipments(token) {
  return request("/shipments", { method: "DELETE", token });
}

export function getShipmentById(id, token) {
  return request(`/shipments/${id}`, { token });
}

export function updateShipmentStatus(id, status, token) {
  return request(`/shipments/${id}/status`, {
    method: "PATCH",
    body: { status },
    token
  });
}
