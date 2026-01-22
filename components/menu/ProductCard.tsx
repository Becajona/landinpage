"use client";

import Image from "next/image";
import type { MenuItem } from "@/data/menu";

type Props = {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
};

export default function ProductCard({ item, onAdd }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-zinc-100">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : null}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold">{item.name}</h3>
            <span className="text-sm font-semibold">${item.price}</span>
          </div>

          <p className="mt-1 text-sm text-zinc-600">{item.description}</p>

          <button
            type="button"
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            onClick={() => onAdd?.(item)}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
