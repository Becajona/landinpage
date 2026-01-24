// lib/firebase/adminAuth.ts
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) throw new Error("Falta FIREBASE_PRIVATE_KEY en .env.local");

  // si viene con \n, los convertimos a saltos reales
  return key.replace(/\\n/g, "\n");
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId) throw new Error("Falta FIREBASE_PROJECT_ID en .env.local");
  if (!clientEmail) throw new Error("Falta FIREBASE_CLIENT_EMAIL en .env.local");

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: getPrivateKey(),
    }),
  });
}

export const adminAuth = getAuth(getAdminApp());
