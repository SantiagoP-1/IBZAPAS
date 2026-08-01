"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { WhatsappButton } from "@/components/WhatsappButton";

export function ProductInfo({ product }: { product: Product }) {
  const tieneTalles = product.product_variants.length > 0;
  const [talleSeleccionado, setTalleSeleccionado] = useState<string | undefined>(undefined);
  const agotado = product.estado === "agotado";

  const url = buildWhatsappUrl(product, talleSeleccionado);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {product.marca}
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{product.nombre}</h1>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {formatPrice(product.precio_ars)}
        </span>
        {product.en_oferta && product.precio_anterior_ars && (
          <span className="text-lg text-zinc-400 line-through">
            {formatPrice(product.precio_anterior_ars)}
          </span>
        )}
      </div>

      {product.precio_tarjeta_ars && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Con tarjeta: {formatPrice(product.precio_tarjeta_ars)}
        </p>
      )}

      {agotado && (
        <span className="w-fit rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900">
          Agotado
        </span>
      )}

      {tieneTalles && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Talles</h3>
          <div className="flex flex-wrap gap-2">
            {product.product_variants.map((variant) => {
              const seleccionado = talleSeleccionado === variant.talle;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!variant.disponible}
                  onClick={() => setTalleSeleccionado(variant.talle)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    !variant.disponible
                      ? "cursor-not-allowed border-zinc-200 text-zinc-300 line-through dark:border-zinc-800 dark:text-zinc-700"
                      : seleccionado
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                        : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {variant.talle}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {product.descripcion && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{product.descripcion}</p>
      )}

      {product.nota && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          {product.nota}
        </p>
      )}

      <WhatsappButton product={product} talle={talleSeleccionado} url={url} />
    </div>
  );
}
