import { create } from "zustand";
import type { MenuItem } from "@/data/menu";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;

  open: () => void;
  close: () => void;
  toggle: () => void;

  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  clear: () => void;

  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((x) => x.id === item.id);
      if (exists) {
        return {
          items: state.items.map((x) =>
            x.id === item.id ? { ...x, qty: x.qty + 1 } : x
          ),
          isOpen: true,
        };
      }
      return {
        items: [...state.items, { id: item.id, name: item.name, price: item.price, qty: 1 }],
        isOpen: true,
      };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((x) => x.id !== id) })),

  increase: (id) =>
    set((state) => ({
      items: state.items.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)),
    })),

  decrease: (id) =>
    set((state) => ({
      items: state.items
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0),
    })),

  clear: () => set({ items: [] }),

  totalItems: () => get().items.reduce((acc, x) => acc + x.qty, 0),
  totalPrice: () => get().items.reduce((acc, x) => acc + x.qty * x.price, 0),
}));
