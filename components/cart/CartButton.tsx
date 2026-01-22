"use client";

import { useCartStore } from "@/store/cartStore";

export default function CartButton() {
  const toggle = useCartStore((s) => s.toggle);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-5 right-5 z-50 rounded-2xl bg-black px-4 py-3 text-white shadow-lg hover:opacity-90"
    >
      🛒 Carrito
      {totalItems > 0 ? (
        <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-black">
          {totalItems}
        </span>
      ) : null}
    </button>
  );
}
