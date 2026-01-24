// lib/firebase/requireAdmin.ts
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/adminAuth";

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const cookieStore = await cookies(); // 👈 OJO: await
  const token = cookieStore.get("admin_token")?.value;

  if (!token) throw new Error("No autenticado");

  const decoded = await adminAuth.verifySessionCookie(token, true);
  const email = (decoded.email || "").toLowerCase();

  const admins = getAdminEmails();
  if (!email || !admins.includes(email)) throw new Error("No autorizado");

  return { email, uid: decoded.uid };
}
