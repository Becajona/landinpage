import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import "server-only";
import admin from "firebase-admin";


function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) throw new Error("Falta FIREBASE_PRIVATE_KEY en .env.local");

  // Si accidentalmente quedó con comillas "....", las quitamos
  const trimmed = key.trim();
  const noQuotes =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  // Convierte \n a saltos reales
  return noQuotes.replace(/\\n/g, "\n");
}

function getAdminCredential() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId) throw new Error("Falta FIREBASE_PROJECT_ID en .env.local");
  if (!clientEmail) throw new Error("Falta FIREBASE_CLIENT_EMAIL en .env.local");

  return cert({
    projectId,
    clientEmail,
    privateKey: getPrivateKey(),
  });
}

const app =
  getApps().length === 0
    ? initializeApp({ credential: getAdminCredential() })
    : getApps()[0];

export const adminDb = getFirestore(app);
