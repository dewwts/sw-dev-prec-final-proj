// On the server we call the backend directly; in the browser we go through the /backend rewrite (next.config.ts)
function apiBase() {
  if (typeof window !== "undefined") return "/backend";
  return `${(process.env.BACKEND_URL ?? "http://localhost:5050").replace(/\/$/, "")}/api/v1`;
}

// Calls the backend and throws the backend's own error message when the request fails
export default async function apiFetch<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...rest } = init;
  const response = await fetch(`${apiBase()}${path}`, {
    cache: "no-store",
    ...rest,
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  let json: { success?: boolean; error?: string } | null = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok || !json || json.success === false) {
    throw new Error(json?.error ?? `Request failed (${response.status})`);
  }
  return json as T;
}
