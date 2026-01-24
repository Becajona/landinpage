// app/api/admin/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase/requireAdmin";
import { adminDb } from "@/lib/firebase/admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();

    const { status } = await req.json();

    const allowed = ["pending", "in_process", "delivered", "canceled"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Status inválido" },
        { status: 400 }
      );
    }

    await adminDb.collection("orders").doc(params.id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error actualizando" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();

    await adminDb.collection("orders").doc(params.id).delete();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error borrando" },
      { status: 500 }
    );
  }
}
