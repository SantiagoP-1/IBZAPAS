-- IBZAPAS catalogo digital - schema inicial
-- Negocio unico (sin multi-tenant). RLS basica: lectura publica del catalogo,
-- escritura solo para la duena autenticada.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  nombre text not null,
  categoria text not null check (categoria in ('zapatillas', 'indumentaria', 'accesorios')),
  descripcion text,
  precio_ars integer check (precio_ars is null or precio_ars >= 0),
  precio_tarjeta_ars integer check (precio_tarjeta_ars is null or precio_tarjeta_ars >= 0),
  en_oferta boolean not null default false,
  precio_anterior_ars integer check (precio_anterior_ars is null or precio_anterior_ars >= 0),
  estado text not null default 'disponible' check (estado in ('disponible', 'agotado')),
  nota text,
  destacado boolean not null default false,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_marca_idx on products (marca);
create index products_categoria_idx on products (categoria);
create index products_estado_idx on products (estado);
create index products_destacado_idx on products (destacado) where destacado = true;

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on products
for each row
execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- product_variants (stock por talle individual)
-- ---------------------------------------------------------------------------
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  talle text not null,
  disponible boolean not null default true,
  unique (product_id, talle)
);

create index product_variants_product_id_idx on product_variants (product_id);

-- ---------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  storage_path text not null,
  orden integer not null default 0
);

create index product_images_product_id_idx on product_images (product_id);

-- ---------------------------------------------------------------------------
-- banners (promociones / novedades)
-- ---------------------------------------------------------------------------
create table banners (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  texto text,
  imagen_storage_path text,
  link text,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- whatsapp_clicks (analitica minima: clic por producto)
-- Se guarda una copia de marca/nombre para que el reporte mensual sobreviva
-- si el producto se edita o se borra mas adelante.
-- ---------------------------------------------------------------------------
create table whatsapp_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products (id) on delete set null,
  producto_marca text not null,
  producto_nombre text not null,
  talle text,
  created_at timestamptz not null default now()
);

create index whatsapp_clicks_product_id_idx on whatsapp_clicks (product_id);
create index whatsapp_clicks_created_at_idx on whatsapp_clicks (created_at);

-- ---------------------------------------------------------------------------
-- RLS: catalogo de lectura publica, escritura solo autenticado (la duena)
-- ---------------------------------------------------------------------------
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table banners enable row level security;
alter table whatsapp_clicks enable row level security;

create policy "products publicos para lectura"
  on products for select
  to anon, authenticated
  using (true);

create policy "products editables por duena autenticada"
  on products for all
  to authenticated
  using (true)
  with check (true);

create policy "variants publicas para lectura"
  on product_variants for select
  to anon, authenticated
  using (true);

create policy "variants editables por duena autenticada"
  on product_variants for all
  to authenticated
  using (true)
  with check (true);

create policy "images publicas para lectura"
  on product_images for select
  to anon, authenticated
  using (true);

create policy "images editables por duena autenticada"
  on product_images for all
  to authenticated
  using (true)
  with check (true);

create policy "banners activos publicos para lectura"
  on banners for select
  to anon, authenticated
  using (true);

create policy "banners editables por duena autenticada"
  on banners for all
  to authenticated
  using (true)
  with check (true);

-- cualquiera puede registrar un clic (es el evento de tracking publico)
create policy "cualquiera puede registrar un clic de whatsapp"
  on whatsapp_clicks for insert
  to anon, authenticated
  with check (true);

-- solo la duena autenticada puede ver el reporte de clics
create policy "duena autenticada puede leer los clics"
  on whatsapp_clicks for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage: buckets publicos para fotos de productos y banners
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('banner-images', 'banner-images', true)
on conflict (id) do nothing;

create policy "lectura publica de fotos de productos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "duena autenticada sube fotos de productos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "duena autenticada actualiza fotos de productos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "duena autenticada borra fotos de productos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

create policy "lectura publica de fotos de banners"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'banner-images');

create policy "duena autenticada sube fotos de banners"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'banner-images');

create policy "duena autenticada actualiza fotos de banners"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'banner-images');

create policy "duena autenticada borra fotos de banners"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'banner-images');
