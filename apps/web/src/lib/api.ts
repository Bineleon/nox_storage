function resolveApiBaseUrl(): string {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  if (typeof window !== "undefined") {
    return publicUrl;
  }
  return process.env.API_URL ?? publicUrl;
}

/** Base URL for server-side calls to the Fastify API (Route Handlers, RSC). */
export function getServerApiBaseUrl(): string {
  return (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
}

function parseApiErrorMessage(detail: string, status: number): string {
  try {
    const parsed = JSON.parse(detail) as { message?: string };
    if (typeof parsed.message === "string" && parsed.message.length > 0) {
      return parsed.message;
    }
  } catch {
    // not JSON
  }
  return detail.length > 0
    ? `Request failed with status ${status}: ${detail}`
    : `Request failed with status ${status}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBaseUrl = resolveApiBaseUrl();
  const { headers: initHeaders, body, ...rest } = init ?? {};
  const hasBody = body != null && body !== "";
  const headers = new Headers(initHeaders);
  if (hasBody && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
    ...rest,
    headers,
    ...(hasBody ? { body } : {})
  });

  if (!response.ok) {
    const detail = (await response.text()).trim().slice(0, 500);
    throw new Error(parseApiErrorMessage(detail, response.status));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
