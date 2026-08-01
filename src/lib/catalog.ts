import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Banner, Product } from "@/lib/types";

const PRODUCT_SELECT = "*, product_variants(*), product_images(*)";

// Revalidación cada 5 minutos. Envuelto en unstable_cache (en vez de confiar
// en el cache automático de fetch de Next) porque la home lee `searchParams`
// para los filtros: eso vuelve la página dinámica, y sin este wrapper cada
// visita pegaría directo a Supabase en lugar de reusar los datos cacheados.
const REVALIDATE_SECONDS = 300;

export const getAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("marca", { ascending: true })
      .order("nombre", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Product[];
  },
  ["all-products"],
  { revalidate: REVALIDATE_SECONDS, tags: ["products"] }
);

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data as Product | null;
  },
  ["product-by-slug"],
  { revalidate: REVALIDATE_SECONDS, tags: ["products"] }
);

export const getActiveBanners = unstable_cache(
  async (): Promise<Banner[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Banner[];
  },
  ["active-banners"],
  { revalidate: REVALIDATE_SECONDS, tags: ["banners"] }
);

export type CatalogFilters = {
  q?: string;
  marcas?: string[];
  talles?: string[];
  precioMin?: number;
  precioMax?: number;
};

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  return products.filter((product) => {
    if (filters.q) {
      const haystack = `${product.marca} ${product.nombre}`.toLowerCase();
      if (!haystack.includes(filters.q.toLowerCase())) return false;
    }

    if (filters.marcas?.length && !filters.marcas.includes(product.marca)) {
      return false;
    }

    if (filters.talles?.length) {
      const talleDisponible = product.product_variants.some(
        (variant) => variant.disponible && filters.talles!.includes(variant.talle)
      );
      if (!talleDisponible) return false;
    }

    if (filters.precioMin != null && (product.precio_ars ?? 0) < filters.precioMin) {
      return false;
    }

    if (filters.precioMax != null && (product.precio_ars ?? Infinity) > filters.precioMax) {
      return false;
    }

    return true;
  });
}

export function getFilterOptions(products: Product[]) {
  const marcas = new Set<string>();
  const talles = new Set<string>();

  for (const product of products) {
    marcas.add(product.marca);
    for (const variant of product.product_variants) {
      if (variant.disponible) talles.add(variant.talle);
    }
  }

  return {
    marcas: [...marcas].sort(),
    talles: [...talles].sort((a, b) => a.localeCompare(b, "es", { numeric: true })),
  };
}
