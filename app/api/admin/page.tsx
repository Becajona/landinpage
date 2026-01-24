export const runtime = "nodejs";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Panel de pedidos</h1>
        <p className="mt-2 text-zinc-600">
          Aquí vamos a listar pedidos, filtrar por status y hacer acciones (en proceso, entregado, cancelar, etc.).
        </p>

        <div className="mt-6 rounded-3xl border bg-white p-6">
          <p className="text-sm text-zinc-500">
            Siguiente paso: crear API /api/admin/orders (GET) y mostrar tabla.
          </p>
        </div>
      </div>
    </main>
  );
}
