"use client";

import { useMemo, useState } from "react";
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

  // Nombre: solo letras + espacios (incluye acentos/ñ)
  const NAME_REGEX = useMemo(() => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/, []);
  // Tel: exactamente 10 dígitos
  const PHONE_REGEX = useMemo(() => /^\d{10}$/, []);

  function handleNameChange(v: string) {
    // Bloquea números y caracteres especiales; deja letras/espacios
    const cleaned = v.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "");
    setName(cleaned);
  }

  function handlePhoneChange(v: string) {
    // Solo dígitos y máximo 10
    const cleaned = v.replace(/\D/g, "").slice(0, 10);
    setPhone(cleaned);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (items.length === 0) return setError("Tu carrito está vacío.");

    const nameTrim = name.trim();
    const phoneTrim = phone.trim();
    const addressTrim = address.trim();

    if (!nameTrim || !phoneTrim || !addressTrim) {
      return setError("Completa nombre, teléfono y dirección.");
    }

    // Validaciones
    if (!NAME_REGEX.test(nameTrim)) {
      return setError("El nombre solo debe contener letras y espacios (sin números ni caracteres especiales).");
    }

    if (!PHONE_REGEX.test(phoneTrim)) {
      return setError("El teléfono debe tener exactamente 10 números (sin letras ni símbolos).");
    }

    setLoading(true);

    try {
      const orderId = `web-${Date.now()}`;

      const payload = {
        orderId,
        customer: {
          name: nameTrim,
          phone: phoneTrim,
          address: addressTrim,
        },
        items,
        total,
        notes: notes.trim() || "",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok || !data.ok) {
        throw new Error(data?.error || text || "No se pudo procesar el pedido.");
      }

      clear();
      router.push(`/success?id=${orderId}`);
    } catch (err: any) {
      console.error("🔴 ERROR CHECKOUT:", err);
      setError(err?.message ?? "Error al crear el pedido.");
    } finally {
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
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej. Juan Pérez"
              inputMode="text"
              autoComplete="name"
            />

            <label className="mt-4 block text-sm font-medium">Teléfono</label>
            <input
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="10 dígitos"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
            />
            <p className="mt-1 text-xs text-zinc-500">Debe contener 10 números (sin espacios).</p>

            <label className="mt-4 block text-sm font-medium">Dirección</label>
            <input
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle, número, colonia, referencias..."
              autoComplete="street-address"
            />

            <label className="mt-4 block text-sm font-medium">Notas (opcional)</label>
            <textarea
              className="mt-1 w-full rounded-2xl border px-4 py-3"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Sin cebolla, tocar timbre..."
            />

            {/* Leyenda de pago */}
            <p className="mt-3 rounded-2xl bg-zinc-50 p-3 text-sm text-zinc-700">
              💵 <span className="font-medium">Pagos en efectivo</span> al momento de la entrega de los productos.
            </p>

            {error ? (
              <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
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
                  <span>
                    {x.qty}x {x.name}
                  </span>
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
