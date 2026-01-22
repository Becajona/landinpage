import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log("🟡 sendTelegram()");
  console.log("TOKEN existe?", !!token);
  console.log("CHAT_ID existe?", !!chatId);

  if (!token || !chatId) {
    throw new Error("Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en .env.local");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  console.log("🟡 Telegram status:", res.status);

  if (!res.ok) {
    const t = await res.text();
    console.error("🔴 Error Telegram RAW:", t);
    throw new Error(`Error Telegram: ${t}`);
  }

  console.log("🟢 Telegram enviado OK");
}

export async function POST(req: Request) {
  try {
    console.log("🟡 POST /api/orders recibido");

    const body = await req.json();
    console.log("🟡 BODY:", body);

    const { orderId, customer, items, total, notes } = body;

    if (!orderId || !customer || !Array.isArray(items) || total == null) {
      return NextResponse.json(
        { ok: false, error: "Body incompleto" },
        { status: 400 }
      );
    }

    // 1) Guardar en Firestore con Admin SDK
    console.log("🟡 Guardando en Firestore (Admin)...");
    await adminDb.collection("orders").doc(orderId).set({
      status: "new",
      createdAt: new Date(),
      customer,
      items,
      total,
      notes: notes || null,
      channel: "web",
    });
    console.log("🟢 Guardado en Firestore OK:", orderId);

    // 2) Armar mensaje para Telegram
    const lines = items
      .map((x: any) => `• ${x.qty}x ${x.name} — $${x.qty * x.price}`)
      .join("\n");

    const msg =
      `📦 <b>Nuevo pedido</b>\n` +
      `🆔 <b>${orderId}</b>\n\n` +
      `👤 <b>${customer.name}</b>\n` +
      `📞 ${customer.phone}\n` +
      `📍 ${customer.address}\n\n` +
      `🧾 <b>Items</b>\n${lines}\n\n` +
      `💰 <b>Total:</b> $${total}\n` +
      (notes ? `📝 <b>Notas:</b> ${notes}\n` : "");

    console.log("🟡 Mensaje Telegram:", msg);

    // 3) Enviar Telegram
    await sendTelegram(msg);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("🔴 ERROR /api/orders:", e?.message);
    console.error(e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error desconocido" },
      { status: 500 }
    );
  }
}
