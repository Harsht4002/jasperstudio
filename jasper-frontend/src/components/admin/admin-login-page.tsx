"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminApiError } from "@/api/admin-auth";
import { useAdminAuth } from "@/store/admin-auth-store";

export function AdminLoginPage() {
  const router = useRouter();
  const { login, register } = useAdminAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (mode === "register" && name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      if (mode === "register") {
        await register({ email: cleanEmail, name, password, remember });
      } else {
        await login({ email: cleanEmail, password, remember });
      }

      router.replace("/admin/dashboard");
    } catch (loginError) {
      setError(
        loginError instanceof AdminApiError
          ? loginError.message
          : `Unable to ${mode}. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-cream px-4 py-10 text-wine md:grid-cols-[0.85fr_1.15fr] md:px-[3vw]">
      <section className="flex min-h-[280px] flex-col justify-between border-b border-wine pb-8 md:min-h-full md:border-b-0 md:border-r md:pr-10">
        <a className="flex items-center gap-3 font-display text-xl font-bold" href="/home">
          <img
            alt="Jasper Studio Logo"
            className="size-12 rounded-full"
            height="48"
            src="/images/brand/logo-placeholder.svg"
            width="48"
          />
          <span>Jasper Studio</span>
        </a>
        <div>
          <p className="mb-3 text-xs font-bold uppercase">Admin</p>
          <h1 className="font-display text-6xl font-bold uppercase leading-[0.82] md:text-8xl">
            Studio Access
          </h1>
        </div>
      </section>

      <section className="grid place-items-center py-10 md:py-0 md:pl-10">
        <div className="w-full max-w-md">
          <form className="w-full" onSubmit={handleSubmit} autoComplete="off">
            <div className="grid gap-5">
              <div className="grid grid-cols-2 border border-wine text-xs font-bold uppercase">
                <button
                  className={`min-h-11 ${mode === "login" ? "bg-wine text-cream" : "bg-transparent"}`}
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`min-h-11 border-l border-wine ${mode === "register" ? "bg-wine text-cream" : "bg-transparent"}`}
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  type="button"
                >
                  Register
                </button>
              </div>

              {mode === "register" ? (
                <label className="grid gap-2 text-xs font-bold uppercase">
                  Name
                  <input
                    autoComplete="off"
                    className="min-h-12 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                    onChange={(event) => setName(event.target.value)}
                    type="text"
                    value={name}
                  />
                </label>
              ) : null}

              <label className="grid gap-2 text-xs font-bold uppercase">
                Email
                <input
                  autoComplete="off"
                  className="min-h-12 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                />
              </label>

              <label className="grid gap-2 text-xs font-bold uppercase">
                Password
                <input
                  autoComplete="new-password"
                  className="min-h-12 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  value={password}
                />
              </label>

              <label className="flex items-center gap-3 text-xs font-bold uppercase">
                <input
                  checked={remember}
                  className="size-4 accent-forest"
                  onChange={(event) => setRemember(event.target.checked)}
                  type="checkbox"
                />
                Remember Me
              </label>

              {error ? (
                <p className="border border-wine bg-wine/10 p-3 text-sm text-wine">
                  {error}
                </p>
              ) : null}

              <button
                className="btn-primary min-h-12 px-5 text-xs font-bold uppercase"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting
                  ? mode === "register"
                    ? "Creating Admin"
                    : "Signing In"
                  : mode === "register"
                    ? "Create Admin"
                    : "Login"}
              </button>
            </div>
          </form>
        </div>
      </section>

    </main>
  );
}
