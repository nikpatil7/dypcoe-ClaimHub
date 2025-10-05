// Centralized API configuration for frontend
// Reads base URL from Vite env at build-time.

// Prefer env var, fallback to window.location.origin when running with same-origin dev proxy
const ENV_BASE = import.meta.env?.VITE_API_URL;

export const API_BASE_URL = ENV_BASE && ENV_BASE.trim() !== ''
	? ENV_BASE.replace(/\/$/, '')
	: window.location.origin;

// Convenience helpers
export const apiPath = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
