-- Grants explicitos para anon/authenticated sobre las tablas del catalogo.
--
-- RLS (habilitado en 0001_init.sql) solo restringe FILAS dentro de lo que el
-- rol ya tiene permitido a nivel de tabla. Sin el GRANT de base, Postgres
-- deniega el acceso antes de evaluar las policies ("permission denied for
-- table products"). En proyectos Supabase esto normalmente ya viene
-- configurado por default privileges al crear el proyecto; en este no quedo
-- aplicado, asi que se hace explicito.

grant usage on schema public to anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

grant select on public.product_variants to anon, authenticated;
grant insert, update, delete on public.product_variants to authenticated;

grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.product_images to authenticated;

grant select on public.banners to anon, authenticated;
grant insert, update, delete on public.banners to authenticated;

grant insert on public.whatsapp_clicks to anon, authenticated;
grant select on public.whatsapp_clicks to authenticated;
