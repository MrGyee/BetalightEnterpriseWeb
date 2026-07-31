import "server-only";
import { cookies } from "next/headers";
import { decrypt, SESSION_COOKIE } from "@/lib/auth/session";

// Every admin Server Action calls this first. proxy.ts already blocks
// unauthenticated page loads, but Server Actions are invoked as their own
// POST requests and must independently verify the session.
export async function requireAdmin() {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
