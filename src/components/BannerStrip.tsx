import Image from "next/image";
import type { Banner } from "@/lib/types";

export function BannerStrip({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-6 sm:px-6">
      {banners.map((banner) => {
        const content = (
          <div className="flex items-center gap-4 overflow-hidden rounded-2xl border border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-zinc-900">
            {banner.imagen_storage_path && (
              <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                <Image
                  src={banner.imagen_storage_path}
                  alt={banner.titulo}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="py-2 pr-4">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">{banner.titulo}</p>
              {banner.texto && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{banner.texto}</p>
              )}
            </div>
          </div>
        );

        return banner.link ? (
          <a key={banner.id} href={banner.link} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        ) : (
          <div key={banner.id}>{content}</div>
        );
      })}
    </div>
  );
}
