export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">✅ Pedido enviado</h1>
        <p className="mt-2 text-zinc-600">Tu pedido se envió a Telegram.</p>

        <div className="mx-auto mt-6 max-w-md rounded-3xl border bg-white p-6">
          <p className="text-sm text-zinc-600">ID de pedido</p>
          <p className="mt-1 text-lg font-semibold">{id ?? "—"}</p>
        </div>

        <a href="/" className="mt-8 inline-flex rounded-2xl bg-black px-4 py-3 text-white">
          Volver al inicio
        </a>
      </div>
    </main>
  );
}
