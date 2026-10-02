import {
  clearAdminAuthSnapshot,
  getAdminAuthSnapshot,
  updateAdminTokens,
} from "@/utils/admin-auth-tokens";
import type {
  AdminLoginInput,
  AdminLoginResponse,
  AdminRegisterInput,
  AdminRefreshResponse,
  AdminUser,
} from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function parseError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string | string[] };
    const message = Array.isArray(data.message)
      ? data.message.join(" ")
      : data.message;

    return message || `Request failed with ${response.status}`;
  } catch {
    return `Request failed with ${response.status}`;
  }
}

async function requestJson<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new AdminApiError(await parseError(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function loginAdmin(input: AdminLoginInput) {
  return requestJson<AdminLoginResponse>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function registerAdmin(input: AdminRegisterInput) {
  return requestJson<AdminLoginResponse>("/admin/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function refreshAdminAuth(refreshToken: string) {
  return requestJson<AdminRefreshResponse>("/admin/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function logoutAdmin(accessToken: string, refreshToken: string | null) {
  return requestJson<{ success: boolean }>("/admin/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });
}

export function getCurrentAdmin(accessToken: string) {
  return requestJson<AdminUser>("/admin/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function adminApiRequest<T>(
  path: string,
  options: RequestInit = {},
  retryOnUnauthorized = true,
): Promise<T> {
  const { accessToken, refreshToken } = getAdminAuthSnapshot();

  if (!accessToken) {
    throw new AdminApiError("Admin session is missing.", 401);
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  try {
    return await requestJson<T>(path, { ...options, headers });
  } catch (error) {
    if (
      retryOnUnauthorized &&
      error instanceof AdminApiError &&
      error.status === 401 &&
      refreshToken
    ) {
      try {
        const tokens = await refreshAdminAuth(refreshToken);
        updateAdminTokens(tokens);
        const retryHeaders = new Headers(options.headers);
        retryHeaders.set("Authorization", `Bearer ${tokens.accessToken}`);
        return requestJson<T>(path, { ...options, headers: retryHeaders });
      } catch (refreshError) {
        clearAdminAuthSnapshot();
        throw refreshError;
      }
    }

    throw error;
  }
}
