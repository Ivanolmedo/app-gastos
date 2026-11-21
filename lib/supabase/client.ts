import { createBrowserClient } from "@supabase/ssr";

// Guarda la sesión en cookies: sobrevive a recargas y reinicios del navegador
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
