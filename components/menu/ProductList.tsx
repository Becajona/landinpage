"use client";

import type { MenuItem } from "@/data/menu";
import ProductCard from "./ProductCard";
import { useCartStore } from "@/store/cartStore";

type Props = {
  items: MenuItem[];
};

export default function ProductList({ items }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} onAdd={addItem} />
      ))}
    </div>
  );
}
