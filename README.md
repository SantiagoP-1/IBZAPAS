# IB ZAPAS — Catálogo digital

Catálogo administrable para IB ZAPAS (zapatillas importadas, Balcarce). Next.js
(App Router) + Supabase. Ver el prompt de especificación original para el
contexto completo de alcance y decisiones de producto.

## Estado actual

Hecho:

- Schema de Supabase con RLS (`supabase/migrations/`): `products`,
  `product_variants` (stock por talle individual), `product_images`, `banners`,
  `whatsapp_clicks`. Incluye grants explícitos para `anon`/`authenticated`/
  `service_role` (este proyecto no traía los default privileges de Supabase
  aplicados — ver `0002_grants.sql` / `0003_service_role_grants.sql`).
- Catálogo migrado desde el JSON de WhatsApp: 61 productos reales (el documento
  de especificación decía "59", pero el array original tiene 61 entradas —
  coincide con las 61 fotos únicas encontradas en `catalog-source-photos/`
  tras deduplicar por hash).
- Catálogo público: listado con filtros (marca, talle, precio) + búsqueda,
  ficha de producto con galería y selector de talle, botón "Consultar por
  WhatsApp" con mensaje prellenado y tracking de clic (vía `sendBeacon`).
- Renderizado con ISR real (`unstable_cache`, 5 min) para no pegarle a
  Supabase en cada visita.
- **Proyecto Supabase real conectado y sembrado**: 61 productos / 145
  variantes / 61 imágenes subidas a Storage. Verificado end-to-end (Playwright):
  home y ficha de producto renderizan con datos reales, selector de talle
  actualiza el mensaje de WhatsApp, y el clic queda registrado en
  `whatsapp_clicks`.

Pendiente (ver sección 13 de la especificación):

- Validar diseño/UX con la clienta.
- Panel administrativo (alta/edición de productos, subida de fotos con
  compresión, banners, destacados).
- Reporte de clics de WhatsApp para la dueña.
- Ping periódico para que el proyecto no se pause por inactividad (plan
  gratuito de Supabase, 7 días) — todavía no configurado.
- Confirmar con la clienta las preguntas abiertas de la sección 12 de la
  especificación (alcance del precio con tarjeta, quién carga ajustes futuros
  del catálogo, acuerdo comercial). El horario y el WhatsApp ya se
  confirmaron y están cargados.

## Cómo levantar el proyecto

```bash
npm install
cp .env.local.example .env.local   # completar con las credenciales reales
npm run dev
```

## Conectar Supabase (ya hecho para el proyecto actual)

Pasos, por si hay que rearmar esto en otro proyecto Supabase:

1. Crear un proyecto en [supabase.com](https://supabase.com) (plan gratuito
   sirve para arrancar).
2. Correr, en orden, cada archivo de `supabase/migrations/` en el SQL Editor
   del dashboard (New query → pegar → Run). El service role key no alcanza
   para DDL/grants sin la contraseña de la base — por eso se corre a mano ahí.
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
