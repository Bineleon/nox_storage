function resolveApiBaseUrl(): string {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  if (typeof window !== "undefined") {
    return publicUrl;
  }
  return process.env.API_URL ?? publicUrl;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBaseUrl = resolveApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const detail = (await response.text()).trim().slice(0, 500);
    throw new Error(
      detail.length > 0
        ? `Request failed with status ${response.status}: ${detail}`
        : `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
