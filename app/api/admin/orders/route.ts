// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase/requireAdmin";
import { adminDb } from "@/lib/firebase/admin"; // <-- ajusta al nombre real que exportes

export async function GET() {
  try {
    await requireAdmin();

    const snap = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ ok: true, orders });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "No autorizado" },
      { status: 401 }
    );
  }
}
