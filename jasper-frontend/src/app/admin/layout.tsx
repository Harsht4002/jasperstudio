import { AdminAuthProvider } from "@/store/admin-auth-store";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
