# IB ZAPAS — Catálogo digital

Catálogo administrable para IB ZAPAS (zapatillas importadas, Balcarce). Next.js
(App Router) + Supabase. Ver el prompt de especificación original para el
contexto completo de alcance y decisiones de producto.

## Estado actual

Hecho:

- Schema de Supabase con RLS (`supabase/migrations/0001_init.sql`): `products`,
  `product_variants` (stock por talle individual), `product_images`, `banners`,
  `whatsapp_clicks`.
- Catálogo migrado desde el JSON de WhatsApp: 61 productos reales (el documento
  de especificación decía "59", pero el array original tiene 61 entradas —
  coincide con las 61 fotos únicas encontradas en `catalog-source-photos/`
  tras deduplicar por hash).
- Catálogo público: listado con filtros (marca, talle, precio) + búsqueda,
  ficha de producto con galería y selector de talle, botón "Consultar por
  WhatsApp" con mensaje prellenado y tracking de clic.
- Renderizado con ISR real (`unstable_cache`, 5 min) para no pegarle a
  Supabase en cada visita.

Pendiente (ver sección 13 de la especificación):

- Conectar un proyecto Supabase real y correr la migración + el seed (ver
  abajo) — **sin esto el sitio no tiene datos para mostrar**.
- Validar diseño/UX con la clienta.
- Panel administrativo (alta/edición de productos, subida de fotos con
  compresión, banners, destacados).
- Reporte de clics de WhatsApp para la dueña.
- Definir el número de WhatsApp real del negocio (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
- Confirmar con la clienta las preguntas abiertas de la sección 12 de la
  especificación (días de horario, alcance del precio con tarjeta, etc.).

## Cómo levantar el proyecto

```bash
npm install
cp .env.local.example .env.local   # completar con las credenciales reales
npm run dev
```

## Conectar Supabase (paso pendiente)

1. Crear un proyecto en [supabase.com](https://supabase.com) (plan gratuito
   sirve para arrancar).
2. Correr `supabase/migrations/0001_init.sql` contra ese proyecto (SQL Editor
   del dashboard, o `supabase db push` con el CLI).
3. Completar `.env.local` con la URL del proyecto, la anon key y la service
   role key (Project Settings → API).
4. Generar el seed y subir fotos + datos:
   ```bash
   npm run seed:build    # valida catalog-source-photos/ y arma supabase/seed-data.json
   npm run seed:upload   # sube las fotos a Storage e inserta productos/variantes/imágenes
   ```
5. Mientras el proyecto esté en el plan gratuito de Supabase, agregar un ping
   periódico (cron / GitHub Actions) para evitar que se pause por inactividad
   a los 7 días — todavía no configurado.

## Estructura relevante

- `src/lib/catalog.ts` — acceso a datos del catálogo (cacheado con ISR).
- `src/lib/supabase/public.ts` — cliente Supabase sin cookies, para lecturas
  públicas (no fuerza renderizado dinámico).
- `src/lib/supabase/server.ts` — cliente con cookies, para cuando exista
  sesión de la dueña (panel admin, todavía no construido).
- `src/lib/supabase/image-loader.ts` — loader custom de `next/image` que
  delega el resize a la transformación de imágenes de Supabase Storage.
- `scripts/catalog-source.mjs` — catálogo migrado a mano desde el JSON de
  WhatsApp (fuente de verdad del seed).
- `scripts/build-seed-data.mjs` / `scripts/seed-supabase.mjs` — generan y
  suben el seed.
- `catalog-source-photos/` — fotos originales (no versionadas en git).
