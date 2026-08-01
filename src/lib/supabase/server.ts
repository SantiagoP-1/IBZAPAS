import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copiá .env.local.example a .env.local y completá las credenciales del proyecto Supabase.`
    );
  }
  return value;
}

// Cliente para Server Components / Route Handlers / Server Actions.
// Usa la anon key: la lectura del catalogo es publica via RLS, y la
// escritura (panel admin) requiere sesion autenticada de la dueña.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // se llama desde un Server Component sin permiso de escritura;
            // el middleware de sesion se encarga de refrescar las cookies.
          }
        },
      },
    }
  );
}
