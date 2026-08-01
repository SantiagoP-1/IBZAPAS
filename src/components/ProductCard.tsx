import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const portada = [...product.product_images].sort((a, b) => a.orden - b.orden)[0];
  const agotado = product.estado === "agotado";

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {portada ? (
          <Image
            src={portada.storage_path}
            alt={`${product.marca} ${product.nombre}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Sin foto
          </div>
        )}

        {product.en_oferta && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            Oferta
          </span>
        )}
        {agotado && (
          <span className="absolute right-2 top-2 rounded-full bg-zinc-900/80 px-2 py-1 text-xs font-semibold text-white">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {product.marca}
        </p>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{product.nombre}</h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {formatPrice(product.precio_ars)}
          </span>
          {product.en_oferta && product.precio_anterior_ars && (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(product.precio_anterior_ars)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
