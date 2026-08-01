"use client";

import type { Product } from "@/lib/types";

export function WhatsappButton({
  product,
  talle,
  url,
  className,
}: {
  product: Product;
  talle?: string;
  url: string;
  className?: string;
}) {
  function handleClick() {
    // Se registra el clic sin bloquear la navegación a WhatsApp.
    // sendBeacon está pensado exactamente para esto (mandar un request que
    // sobreviva a la navegación); fetch con keepalive:true llegaba con el
    // body vacío en algunos casos.
    const payload = JSON.stringify({
      productId: product.id,
      marca: product.marca,
      nombre: product.nombre,
      talle: talle ?? null,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/whatsapp-click", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/whatsapp-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch(() => {
        // el tracking no debe impedir que la consulta llegue a WhatsApp
      });
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={
        className ??
        "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1ebe57]"
      }
    >
      Consultar por WhatsApp
    </a>
  );
}
