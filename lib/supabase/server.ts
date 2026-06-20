import { createClient } from "@supabase/supabase-js";

/**
 * Sanitizes the Supabase URL, removing any trailing slashes or '/rest/v1' suffix.
 */
function sanitizeSupabaseUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return "";
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

/**
 * Creates a public read-only Client.
 * Suitable for calling anywhere on the server to read published projects.
 */
export function createPublicClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  const url = sanitizeSupabaseUrl(rawUrl);

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Creates an admin write-enabled Client using the service role key.
 * This client BYPASSES Row Level Security (RLS) entirely.
 * ALWAYS use this client only inside authenticated server-only areas
 * (like Server Actions, protected route API endpoints).
 */
export function createAdminClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !serviceKey) {
    throw new Error(
      "Missing Admin Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  const url = sanitizeSupabaseUrl(rawUrl);

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
}
