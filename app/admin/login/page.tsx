// app/admin/login/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client"; // asegúrate que exportas auth ahí

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !pass.trim()) {
      return setErr("Completa correo y contraseña.");
    }

    setLoading(true);
    try {
      // 1) Login Firebase (cliente)
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const idToken = await cred.user.getIdToken();

      // 2) Crear sesión en servidor (cookie httpOnly)
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "No se pudo iniciar sesión.");
      }

      router.push("/admin/orders");
    } catch (e: any) {
      setErr(e?.message ?? "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Acceso solo para administradoress.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Correo</label>
            <input
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </div>

          {err ? (
            <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
              {err}
            </p>
          ) : null}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
