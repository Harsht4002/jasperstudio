"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/store/admin-auth-store";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream text-wine">
      <header className="sticky top-0 z-20 grid min-h-14 grid-cols-[1fr_auto] items-center border-b border-wine bg-cream/95 px-4 py-2 md:px-[3vw]">
        <a className="flex items-center gap-2 font-display text-base font-bold" href="/admin/dashboard">
          <img
            alt=""
            aria-hidden="true"
            className="size-8 rounded-full"
            height="32"
            src="/images/brand/logo-placeholder.svg"
            width="32"
          />
          <span>Jasper&apos;s Studio Admin</span>
        </a>
        <div className="flex items-center gap-4 text-xs font-bold uppercase">
          <span className="hidden text-wine/70 sm:inline">{admin?.name ?? admin?.email}</span>
          <button className="border border-wine px-3 py-2" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
