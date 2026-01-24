import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase/requireAdmin";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin();

    const { id } = await ctx.params;
    const body = await req.json();

    await adminDb.collection("orders").doc(id).set(
      { ...body, updatedAt: new Date() },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error" },
      { status: e?.message?.includes("No autorizado") ? 401 : 500 }
    );
  }
}
