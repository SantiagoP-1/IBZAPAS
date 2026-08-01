"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const sorted = [...images].sort((a, b) => a.orden - b.orden);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
        Sin foto
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={active.storage_path}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                index === activeIndex ? "border-zinc-900 dark:border-zinc-50" : "border-transparent"
              }`}
            >
              <Image src={image.storage_path} alt={alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
