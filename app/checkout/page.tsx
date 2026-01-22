"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    console.log("🟡 SUBMIT INICIADO");

    if (items.length === 0) {
      console.log("❌ Carrito vacío");
      return setError("Tu carrito está vacío.");
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      console.log("❌ Faltan datos");
      return setError("Completa nombre, teléfono y dirección.");
    }

    setLoading(true);

    try {
      const orderId = `web-${Date.now()}`;

      const payload = {
        orderId,
        customer: { name: name.trim(), phone: phone.trim(), address: address.trim() },
        items,
        total,
        notes: notes.trim() || "",
      };

      console.log("🟡 Enviando a /api/orders");
      console.log("Payload:", payload);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("🟡 HTTP status:", res.status);

      const text = await res.text();
      console.log("🟡 RAW:", text);

      let data: any = {};
      try { data = JSON.parse(text); } catch {}

      console.log("🟡 JSON:", data);

      if (!res.ok || !data.ok) {
        throw new Error(data?.error || text || "No se pudo procesar el pedido.");
      }

      console.log("🟢 Pedido OK -> limpiar + redirect");
      clear();
      router.push(`/success?id=${orderId}`);
    } catch (err: any) {
      console.error("🔴 ERROR CHECKOUT:", err);
      setError(err?.message ?? "Error al crear el pedido.");
    } finally {
      console.log("🟡 FIN SUBMIT");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <form onSubmit={onSubmit} className="rounded-3xl border bg-white p-6">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="mt-4 block text-sm font-medium">Teléfono</label>
            <input
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label className="mt-4 block text-sm font-medium">Dirección</label>
            <input
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label className="mt-4 block text-sm font-medium">Notas (opcional)</label>
            <textarea
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {error ? (
              <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Confirmar pedido"}
            </button>
          </form>

          <div className="rounded-3xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Resumen</h2>
            <div className="mt-4 space-y-2">
              {items.map((x) => (
                <div key={x.id} className="flex justify-between text-sm">
                  <span>{x.qty}x {x.name}</span>
                  <span className="font-semibold">${x.qty * x.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4 flex justify-between">
              <span>Total</span>
              <span className="text-lg font-bold">${total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
