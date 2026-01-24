// data/menu.ts

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // ruta en /public (opcional)
  category: "Banderillas" | "Mini baits" | "Papas";
};

export const menu: MenuItem[] = [
  {
    id: "banderilla-natural",
    name: "Banderilla coreana (Natural)",
    description: "La clásica banderilla coreana.",
    price: 40,
    image: "/menu/banderillas.jpeg",
    category: "Banderillas",
  },
  {
    id: "banderilla-sabores",
    name: "Banderilla coreana (Sabores)",
    description: "Sabores disponibles según existencias.",
    price: 45,
    image: "/menu/menu.jpeg", // si prefieres otra, cámbiala por menu2/menu3
    category: "Banderillas",
  },
  {
    id: "banderilla-extra-queso",
    name: "Banderilla coreana (Extra queso)",
    description: "Con extra queso (más cheesy 🤤).",
    price: 60,
    image: "/menu/ches.jpg",
    category: "Banderillas",
  },
  {
    id: "mini-baits-orden",
    name: "Mini baits (Orden)",
    description: "Orden de mini baits.",
    price: 60,
    image: "/menu/minibaits.jpeg",
    category: "Mini baits",
  },
  {
    id: "papas-francesa",
    name: "Papas a la francesa",
    description: "Orden de papas a la francesa.",
    price: 45,
    image: "/menu/menu2.jpeg", // si luego pones foto real, solo cambias aquí
    category: "Papas",
  },
];
