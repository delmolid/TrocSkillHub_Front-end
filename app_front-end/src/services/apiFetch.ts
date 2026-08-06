import { API_CSRF_URL } from "../constantes";

type CsrfBootstrapResponse = {
  token: string;
  headerName?: string;
  parameterName?: string;
};

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS", "TRACE"]);

/** In-flight CSRF bootstrap (avoids parallel duplicate GETs). */
let csrfBootstrapPromise: Promise<string> | null = null;

/** Clears any in-flight CSRF bootstrap (useful in tests). */
export function clearCsrfTokenCache(): void {
  csrfBootstrapPromise = null;
}

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(API_CSRF_URL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`CSRF bootstrap failed: HTTP ${response.status}`);
  }

  const data = (await response.json()) as CsrfBootstrapResponse;
  if (!data.token) {
    throw new Error("CSRF bootstrap failed: missing token");
  }

  return data.token;
}

/**
 * Always fetch a fresh CSRF token before mutating requests.
 * Spring rotates/clears the XSRF-TOKEN cookie on authenticated requests,
 * so a long-lived in-memory token becomes stale and yields HTTP 403.
 */
async function ensureCsrfToken(): Promise<string> {
  if (!csrfBootstrapPromise) {
    csrfBootstrapPromise = fetchCsrfToken().finally(() => {
      csrfBootstrapPromise = null;
    });
  }

  return csrfBootstrapPromise;
}

type ApiFetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string | null;
  signal?: AbortSignal | null;
};

/**
 * Fetch wrapper for the TrocSkillHub API.
 * Always sends credentials (JWT cookie) and attaches X-XSRF-TOKEN on mutating requests.
 */
export async function apiFetch(
  url: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);

  if (!SAFE_METHODS.has(method)) {
    headers.set("X-XSRF-TOKEN", await ensureCsrfToken());
  }

  return fetch(url, {
    method: options.method,
    headers,
    body: options.body,
    signal: options.signal ?? undefined,
    credentials: "include",
  });
}
