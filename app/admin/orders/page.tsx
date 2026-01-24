"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  orderId?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "pending" | "in_process" | "delivered" | "canceled";
  total?: number;
  notes?: string;
  customer?: { name?: string; phone?: string; address?: string };
  items?: Array<{ id: string; name: string; price: number; qty: number }>;
};

function statusLabel(s?: Order["status"]) {
  if (s === "in_process") return "En proceso";
  if (s === "delivered") return "Entregado";
  if (s === "canceled") return "Cancelado";
  return "Pendiente";
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState<string>("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data?.error || "No autorizado");
      setOrders(data.orders || []);
    } catch (e: any) {
      setErr(e?.message ?? "Error cargando pedidos");
      // si no está autorizado, lo mandamos al login
      if ((e?.message || "").toLowerCase().includes("no")) {
        // opcional
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: NonNullable<Order["status"]>) {
    setBusyId(id);
    setErr("");
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data?.error || "No se pudo actualizar");

      // update local
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (e: any) {
      setErr(e?.message ?? "Error actualizando");
    } finally {
      setBusyId("");
    }
  }

  async function removeOrder(id: string) {
    if (!confirm("¿Seguro que quieres borrar este pedido?")) return;

    setBusyId(id);
    setErr("");
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data?.error || "No se pudo borrar");

      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e: any) {
      setErr(e?.message ?? "Error borrando");
    } finally {
      setBusyId("");
    }
  }

  const count = useMemo(() => orders.length, [orders]);

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Pedidos (Admin)</h1>
            <p className="text-sm text-zinc-600">
              Total: <span className="font-semibold">{count}</span>
            </p>
          </div>

          <button
            onClick={load}
            className="rounded-2xl border bg-white px-4 py-2 text-sm"
          >
            Recargar
          </button>
        </div>

        {err ? (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
            {err}
          </p>
        ) : null}

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-zinc-600">Cargando...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-zinc-600">No hay pedidos aún.</p>
          ) : (
            <div className="grid gap-4">
              {orders.map((o) => (
                <div key={o.id} className="rounded-3xl border bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-zinc-500">ID</p>
                      <p className="font-mono text-sm">{o.orderId || o.id}</p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">Estado</p>
                      <p className="font-semibold">{statusLabel(o.status)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">Total</p>
                      <p className="font-bold">${o.total ?? 0}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold">Cliente</p>
                      <p className="text-sm">
                        {o.customer?.name || "-"} · {o.customer?.phone || "-"}
                      </p>
                      <p className="text-sm text-zinc-600">
                        {o.customer?.address || "-"}
                      </p>

                      {o.notes ? (
                        <p className="mt-2 text-sm text-zinc-700">
                          <span className="font-semibold">Notas:</span> {o.notes}
                        </p>
                      ) : null}

                      <div className="mt-3 space-y-1">
                        {(o.items || []).map((it, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {it.qty}x {it.name}
                            </span>
                            <span className="font-semibold">
                              ${it.qty * it.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        disabled={busyId === o.id}
                        onClick={() => setStatus(o.id, "in_process")}
                        className="rounded-2xl bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                      >
                        Marcar en proceso
                      </button>
                      <button
                        disabled={busyId === o.id}
                        onClick={() => setStatus(o.id, "delivered")}
                        className="rounded-2xl border bg-white px-4 py-2 text-sm disabled:opacity-50"
                      >
                        Marcar entregado
                      </button>
                      <button
                        disabled={busyId === o.id}
                        onClick={() => setStatus(o.id, "canceled")}
                        className="rounded-2xl border bg-white px-4 py-2 text-sm disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        disabled={busyId === o.id}
                        onClick={() => removeOrder(o.id)}
                        className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
