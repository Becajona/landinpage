import ProductList from "@/components/menu/ProductList";
import { menu } from "@/data/menu";
import CartButton from "@/components/cart/CartButton";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl bg-black p-8 text-white">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pide en línea 🔥🇰🇷
          </h1>
          <p className="mt-2 text-white/80">
            Arma tu pedido, confirma y te llega al instante.
          </p>


          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              Ver menú
            </a>
            <a
              href="/checkout"
              className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Ir a pagar
            </a>
          </div>
        </div>
      </header>

      <section id="menu" className="mx-auto max-w-5xl px-4 pb-14">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Menú</h2>
          <span className="text-sm text-zinc-600">{menu.length} productos</span>
        </div>

        <ProductList items={menu} />
      </section>
      <CartButton />
      <CartDrawer />

    </main>
  );
}
