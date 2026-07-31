import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client using the service_role key, which bypasses Row Level
// Security. Only ever imported from src/lib/store/*.ts — never from a
// "use client" file (RLS has no policies for anon/authenticated roles, so
// a client using the anon key couldn't read/write anything anyway).
let cachedClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Copy .env.local.example to .env.local and fill them in."
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}
