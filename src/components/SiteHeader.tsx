import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-brand-blue/30 bg-white/90 backdrop-blur dark:border-brand-blue/20 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="IB Zapas"
            width={44}
            height={44}
            unoptimized
            className="rounded-full"
          />
          <span className="text-lg font-bold tracking-tight text-brand-navy dark:text-zinc-50">
            IB ZAPAS
          </span>
        </Link>
        <a
          href="https://instagram.com/ibzapas"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-blue hover:text-brand-navy dark:text-brand-blue-light dark:hover:text-white"
        >
          @ibzapas
        </a>
      </div>
    </header>
  );
}
