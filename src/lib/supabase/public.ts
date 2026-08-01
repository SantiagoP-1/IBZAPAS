import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copiá .env.local.example a .env.local y completá las credenciales del proyecto Supabase.`
    );
  }
  return value;
}

// Cliente sin cookies para lecturas publicas del catalogo (RLS permite
// select anonimo). A diferencia del cliente de src/lib/supabase/server.ts,
// este NO llama a cookies(), asi que no fuerza renderizado dinamico: las
// paginas que lo usan pueden servirse con ISR (export const revalidate).
export function createSupabasePublicClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}
