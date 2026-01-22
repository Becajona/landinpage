export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // ruta en /public (opcional)
  category: "Tacos" | "Hamburguesas" | "Bebidas" | "Postres";
};

export const menu: MenuItem[] = [
  {
    id: "taco-pastor",
    name: "Taco al pastor",
    description: "Con piña, cebolla y cilantro (puedes pedirlo sin).",
    price: 18,
    image: "/taco.jpg",
    category: "Tacos",
  },
  {
    id: "taco-asada",
    name: "Taco de asada",
    description: "Carne asada jugosa, tortillas recién hechas.",
    price: 20,
    image: "/taco.jpg",
    category: "Tacos",
  },
  {
    id: "burger-clasica",
    name: "Hamburguesa clásica",
    description: "Carne, queso, lechuga, jitomate y aderezo.",
    price: 85,
    image: "/burger.jpg",
    category: "Hamburguesas",
  },
  {
    id: "agua-horchata",
    name: "Agua de horchata",
    description: "1 litro, bien fría.",
    price: 35,
    image: "/drink.jpg",
    category: "Bebidas",
  },
];
