"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);

  const items = useCartStore((s) => s.items);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const total = useCartStore((s) => s.totalPrice());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        type="button"
        onClick={close}
        className="absolute inset-0 bg-black/40"
        aria-label="Cerrar carrito"
      />

      {/* panel */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tu carrito</h2>
          <button
            type="button"
            onClick={close}
            className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-zinc-600">Aún no agregas productos.</p>
          ) : (
            items.map((x) => (
              <div key={x.id} className="rounded-2xl border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{x.name}</p>
                    <p className="text-sm text-zinc-600">
                      ${x.price} c/u
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(x.id)}
                    className="rounded-xl px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                  >
                    Quitar
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrease(x.id)}
                      className="h-9 w-9 rounded-xl border hover:bg-zinc-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{x.qty}</span>
                    <button
                      type="button"
                      onClick={() => increase(x.id)}
                      className="h-9 w-9 rounded-xl border hover:bg-zinc-50"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold">${x.qty * x.price}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600">Total</span>
            <span className="text-lg font-bold">${total}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-2xl border px-4 py-3 text-sm font-semibold hover:bg-zinc-50"
              disabled={items.length === 0}
            >
              Vaciar
            </button>

            <Link
              href="/checkout"
              onClick={close}
              className={`rounded-2xl bg-black px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90 ${
                items.length === 0 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Ir a pagar
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
