"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function submit() {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex w-full items-center gap-2">
      <input
        type="search"
        placeholder="Buscar por marca o modelo…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="w-full rounded-full border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="button"
        onClick={submit}
        className="shrink-0 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
      >
        Buscar
      </button>
    </div>
  );
}
