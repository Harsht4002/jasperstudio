import type { AdminUser } from "@/types/auth";

const ACCESS_TOKEN_KEY = "jasper.adminAccessToken";
const REFRESH_TOKEN_KEY = "jasper.adminRefreshToken";
const ADMIN_KEY = "jasper.adminUser";
const REMEMBER_KEY = "jasper.adminRemember";

export type AdminAuthSnapshot = {
  accessToken: string | null;
  refreshToken: string | null;
  admin: AdminUser | null;
};

function getBrowserStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(REMEMBER_KEY) === "true"
    ? window.localStorage
    : window.sessionStorage;
}

export function getAdminAuthSnapshot(): AdminAuthSnapshot {
  const storage = getBrowserStorage();

  if (!storage) {
    return { accessToken: null, refreshToken: null, admin: null };
  }

  const adminValue = storage.getItem(ADMIN_KEY);

  return {
    accessToken: storage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: storage.getItem(REFRESH_TOKEN_KEY),
    admin: adminValue ? (JSON.parse(adminValue) as AdminUser) : null,
  };
}

export function persistAdminAuthSnapshot(
  snapshot: AdminAuthSnapshot,
  remember: boolean,
) {
  if (typeof window === "undefined") {
    return;
  }

  clearAdminAuthSnapshot();
  window.localStorage.setItem(REMEMBER_KEY, String(remember));

  const storage = remember ? window.localStorage : window.sessionStorage;

  if (snapshot.accessToken) {
    storage.setItem(ACCESS_TOKEN_KEY, snapshot.accessToken);
  }

  if (snapshot.refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, snapshot.refreshToken);
  }

  if (snapshot.admin) {
    storage.setItem(ADMIN_KEY, JSON.stringify(snapshot.admin));
  }
}

export function updateAdminTokens(input: {
  accessToken: string;
  refreshToken: string;
}) {
  const current = getAdminAuthSnapshot();
  const remember =
    typeof window !== "undefined" &&
    window.localStorage.getItem(REMEMBER_KEY) === "true";

  persistAdminAuthSnapshot(
    {
      ...current,
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
    },
    remember,
  );
}

export function updateStoredAdmin(admin: AdminUser) {
  const current = getAdminAuthSnapshot();
  const remember =
    typeof window !== "undefined" &&
    window.localStorage.getItem(REMEMBER_KEY) === "true";

  persistAdminAuthSnapshot({ ...current, admin }, remember);
}

export function clearAdminAuthSnapshot() {
  if (typeof window === "undefined") {
    return;
  }

  [window.localStorage, window.sessionStorage].forEach((storage) => {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(ADMIN_KEY);
  });
}
