type SuccessPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { id } = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 text-center">
        <div className="text-4xl mb-2">✅</div>

        <h1 className="text-xl font-bold">Pedido enviado</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Tu pedido se envió correctamente.
        </p>

        <div className="mt-4 rounded-2xl bg-zinc-50 p-4 text-sm">
          <p className="font-medium">ID de pedido</p>
          <p className="mt-1 text-zinc-600">{id}</p>
        </div>

        <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
          <p className="font-semibold">🍳 Productos en preparación</p>
          <p className="mt-1">
            Tu pedido ya está siendo preparado.  
            Nos pondremos en contacto contigo cuando esté listo para la entrega.
          </p>
        </div>

        <a
          href="/"
          className="mt-6 inline-block w-full rounded-2xl bg-black px-4 py-3 text-white"
        >
          Volver al inicio
        </a>
      </div>
    </main>
  );
}
