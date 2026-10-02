"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AdminApiError,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  refreshAdminAuth,
} from "@/api/admin-auth";
import type { AdminLoginInput, AdminRegisterInput, AdminUser } from "@/types/auth";
import {
  clearAdminAuthSnapshot,
  getAdminAuthSnapshot,
  persistAdminAuthSnapshot,
  updateAdminTokens,
  updateStoredAdmin,
} from "@/utils/admin-auth-tokens";

type AuthStatus = "booting" | "authenticated" | "unauthenticated";

type AdminAuthContextValue = {
  admin: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (input: AdminLoginInput & { remember: boolean }) => Promise<void>;
  register: (input: AdminRegisterInput & { remember: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  fetchCurrentAdmin: () => Promise<AdminUser | null>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("booting");

  const setSession = useCallback(
    (input: {
      accessToken: string;
      refreshToken: string;
      admin: AdminUser | null;
      remember: boolean;
    }) => {
      setAccessToken(input.accessToken);
      setRefreshToken(input.refreshToken);
      setAdmin(input.admin);
      setStatus("authenticated");
      persistAdminAuthSnapshot(input, input.remember);
    },
    [],
  );

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setAdmin(null);
    setStatus("unauthenticated");
    clearAdminAuthSnapshot();
  }, []);

  const refresh = useCallback(async () => {
    const snapshot = getAdminAuthSnapshot();

    if (!snapshot.refreshToken) {
      clearSession();
      throw new AdminApiError("Admin session has expired.", 401);
    }

    const tokens = await refreshAdminAuth(snapshot.refreshToken);
    updateAdminTokens(tokens);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setStatus("authenticated");
  }, [clearSession]);

  const fetchCurrentAdmin = useCallback(async () => {
    const snapshot = getAdminAuthSnapshot();

    if (!snapshot.accessToken) {
      clearSession();
      return null;
    }

    try {
      const currentAdmin = await getCurrentAdmin(snapshot.accessToken);
      setAdmin(currentAdmin);
      setAccessToken(snapshot.accessToken);
      setRefreshToken(snapshot.refreshToken);
      setStatus("authenticated");
      updateStoredAdmin(currentAdmin);
      return currentAdmin;
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 401) {
        await refresh();
        const nextSnapshot = getAdminAuthSnapshot();

        if (nextSnapshot.accessToken) {
          const currentAdmin = await getCurrentAdmin(nextSnapshot.accessToken);
          setAdmin(currentAdmin);
          updateStoredAdmin(currentAdmin);
          return currentAdmin;
        }
      }

      clearSession();
      return null;
    }
  }, [clearSession, refresh]);

  const login = useCallback(
    async (input: AdminLoginInput & { remember: boolean }) => {
      const response = await loginAdmin({
        email: input.email,
        password: input.password,
      });

      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        admin: response.admin,
        remember: input.remember,
      });

      const currentAdmin = await getCurrentAdmin(response.accessToken);
      setAdmin(currentAdmin);
      updateStoredAdmin(currentAdmin);
    },
    [setSession],
  );

  const register = useCallback(
    async (input: AdminRegisterInput & { remember: boolean }) => {
      const response = await registerAdmin({
        email: input.email,
        name: input.name,
        password: input.password,
      });

      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        admin: response.admin,
        remember: input.remember,
      });

      const currentAdmin = await getCurrentAdmin(response.accessToken);
      setAdmin(currentAdmin);
      updateStoredAdmin(currentAdmin);
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    const snapshot = getAdminAuthSnapshot();

    try {
      if (snapshot.accessToken) {
        await logoutAdmin(snapshot.accessToken, snapshot.refreshToken);
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    const snapshot = getAdminAuthSnapshot();
    setAdmin(snapshot.admin);
    setAccessToken(snapshot.accessToken);
    setRefreshToken(snapshot.refreshToken);

    if (!snapshot.accessToken) {
      setStatus("unauthenticated");
      return;
    }

    fetchCurrentAdmin();
  }, [fetchCurrentAdmin]);

  const value = useMemo(
    () => ({
      admin,
      accessToken,
      refreshToken,
      status,
      isAuthenticated: status === "authenticated" && Boolean(accessToken),
      login,
      register,
      logout,
      refresh,
      fetchCurrentAdmin,
    }),
    [
      accessToken,
      admin,
      fetchCurrentAdmin,
      login,
      logout,
      register,
      refresh,
      refreshToken,
      status,
    ],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }

  return context;
}
