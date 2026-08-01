"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export function CatalogFilters({
  marcasDisponibles,
  tallesDisponibles,
}: {
  marcasDisponibles: string[];
  tallesDisponibles: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const marcasSeleccionadas = searchParams.get("marca")?.split(",").filter(Boolean) ?? [];
  const tallesSeleccionados = searchParams.get("talle")?.split(",").filter(Boolean) ?? [];
  const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") ?? "");
  const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") ?? "");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  function toggleValue(current: string[], value: string) {
    return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  }

  const hayFiltrosActivos =
    marcasSeleccionadas.length > 0 ||
    tallesSeleccionados.length > 0 ||
    precioMin !== "" ||
    precioMax !== "";

  return (
    <div className="flex flex-col gap-6 text-sm">
      <div>
        <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Marca</h3>
        <div className="flex flex-col gap-1.5">
          {marcasDisponibles.map((marca) => (
            <label key={marca} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={marcasSeleccionadas.includes(marca)}
                onChange={() =>
                  updateParams({
                    marca: toggleValue(marcasSeleccionadas, marca).join(",") || null,
                  })
                }
                className="h-4 w-4 rounded border-zinc-300"
              />
              {marca}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Talle</h3>
        <div className="flex flex-wrap gap-1.5">
          {tallesDisponibles.map((talle) => {
            const activo = tallesSeleccionados.includes(talle);
            return (
              <button
                key={talle}
                type="button"
                onClick={() =>
                  updateParams({
                    talle: toggleValue(tallesSeleccionados, talle).join(",") || null,
                  })
                }
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activo
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {talle}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Precio</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Mín"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            onBlur={() => updateParams({ precioMin: precioMin || null })}
            className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <span className="text-zinc-400">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Máx"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            onBlur={() => updateParams({ precioMax: precioMax || null })}
            className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>

      {hayFiltrosActivos && (
        <button
          type="button"
          onClick={() => {
            setPrecioMin("");
            setPrecioMax("");
            router.push(pathname, { scroll: false });
          }}
          className="text-left text-xs font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
