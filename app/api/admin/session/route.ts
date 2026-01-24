// app/api/admin/session/route.ts
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/adminAuth";

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Falta idToken" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const email = (decoded.email || "").toLowerCase();

    const admins = getAdminEmails();
    if (!email || !admins.includes(email)) {
      return NextResponse.json({ ok: false, error: "No autorizado (no admin)" }, { status: 401 });
    }

    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 días
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin_token", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error creando sesión" },
      { status: 500 }
    );
  }
}
