// src/lib/api.js
const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, ''); // trim trailing slash

function join(base, path) {
  return base + (path.startsWith('/') ? path : `/${path}`);
}

export async function api(path, opts = {}) {
  const res = await fetch(join(BASE, path), {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    // add credentials: 'include' here if you use cookies
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

// Convenience helpers
export const get  = (p) => api(p);
export const post = (p, body) => api(p, { method: 'POST', body: JSON.stringify(body) });
export const put  = (p, body) => api(p, { method: 'PUT',  body: JSON.stringify(body) });
export const del  = (p)      => api(p, { method: 'DELETE' });
