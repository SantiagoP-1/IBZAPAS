import { getActiveBanners, getAllProducts, filterProducts, getFilterOptions } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { SearchBox } from "@/components/SearchBox";
import { BannerStrip } from "@/components/BannerStrip";

// ISR: la lista se re-genera cada 5 minutos en vez de pegarle a Supabase
// en cada visita.
export const revalidate = 300;

type SearchParams = Promise<{
  q?: string;
  marca?: string;
  talle?: string;
  precioMin?: string;
  precioMax?: string;
}>;

export default async function CatalogoPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [products, banners] = await Promise.all([getAllProducts(), getActiveBanners()]);

  const { marcas, talles } = getFilterOptions(products);

  const productosFiltrados = filterProducts(products, {
    q: params.q,
    marcas: params.marca?.split(",").filter(Boolean),
    talles: params.talle?.split(",").filter(Boolean),
    precioMin: params.precioMin ? Number(params.precioMin) : undefined,
    precioMax: params.precioMax ? Number(params.precioMax) : undefined,
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-blue opacity-40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-brand-blue-light opacity-20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl">
            No solo vendemos calzado; seleccionamos rendimiento y estilo para tu día a día.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-blue-light sm:text-base">
            Nos enfocamos en ofrecerte zapatillas deportivas y urbanas que resisten tu ritmo,
            combinando la mejor tecnología de materiales con diseños actuales.
          </p>
        </div>
      </section>

      <BannerStrip banners={banners} />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="shrink-0 lg:w-56">
          <div className="lg:sticky lg:top-20">
            <CatalogFilters marcasDisponibles={marcas} tallesDisponibles={talles} />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4">
            <SearchBox />
          </div>

          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""}
          </p>

          {productosFiltrados.length === 0 ? (
            <p className="py-16 text-center text-zinc-500 dark:text-zinc-400">
              No encontramos productos con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {productosFiltrados.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
