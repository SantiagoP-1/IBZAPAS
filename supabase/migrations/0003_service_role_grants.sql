-- Grants explicitos para service_role.
--
-- En un proyecto Supabase normal, service_role ya tiene BYPASSRLS y ALL
-- PRIVILEGES sobre el schema public por default privileges. En este proyecto
-- esos defaults tampoco quedaron aplicados (mismo problema que con
-- anon/authenticated en 0002_grants.sql), asi que se hace explicito.
-- Sin esto, scripts/seed-supabase.mjs (que usa la service role key) no puede
-- insertar productos/variantes/imagenes.

grant usage on schema public to service_role;

grant all privileges on public.products to service_role;
grant all privileges on public.product_variants to service_role;
grant all privileges on public.product_images to service_role;
grant all privileges on public.banners to service_role;
grant all privileges on public.whatsapp_clicks to service_role;
