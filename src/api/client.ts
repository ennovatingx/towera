const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ACCESS_KEY = 'towera_auth:access';
const REFRESH_KEY = 'towera_auth:refresh';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function hasStoredToken(): boolean {
  return getAccessToken() !== null;
}

interface Envelope<T> {
  responseCode: number;
  responseMessage: string;
  data: T;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    const access: string | undefined = body?.data?.access;
    const newRefresh: string | undefined = body?.data?.refresh;
    if (!access) return null;
    localStorage.setItem(ACCESS_KEY, access);
    if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);
    return access;
  } catch {
    return null;
  }
}

export async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { skipAuth, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const access = getAccessToken();
  if (!skipAuth && access) {
    finalHeaders.Authorization = `Bearer ${access}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  if (res.status === 401 && !skipAuth && !isRetry) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      return request<T>(path, options, true);
    }
    clearTokens();
  }

  let body: Envelope<T> | null = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    throw new Error(body?.responseMessage || res.statusText || 'Request failed');
  }

  return body?.data as T;
}

export async function fetchAllPages<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T[]> {
  const query = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') query.set(key, String(value));
    }
  }
  query.set('page_size', '100');

  const results: T[] = [];
  let nextPath: string | null = `${path}?${query.toString()}`;

  while (nextPath) {
    const page: Paginated<T> = await request<Paginated<T>>(nextPath);
    results.push(...page.results);
    nextPath = page.next ? new URL(page.next).pathname + new URL(page.next).search : null;
  }

  return results;
}

export async function uploadToPresignedUrl(url: string, blob: Blob, contentType: string): Promise<void> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });
  if (!res.ok) {
    throw new Error(`Failed to upload audio (${res.status})`);
  }
}
