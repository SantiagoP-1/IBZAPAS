import type { Product } from "@/lib/types";

// Numero de WhatsApp del negocio, formato internacional sin "+" ni espacios
// (ej: 5492291234567). Definir en .env.local — ver .env.local.example.
export function getWhatsappNumber(): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) {
    throw new Error(
      "Falta NEXT_PUBLIC_WHATSAPP_NUMBER. Definila en .env.local con el número de WhatsApp de IB ZAPAS."
    );
  }
  return number;
}

export function buildWhatsappMessage(product: Product, talle?: string): string {
  const nombreCompleto = `${product.marca} ${product.nombre}`.trim();
  const detalleTalle = talle ? ` talle ${talle}` : "";
  return `Hola, quería consultar por las ${nombreCompleto}${detalleTalle}.`;
}

export function buildWhatsappUrl(product: Product, talle?: string): string {
  const number = getWhatsappNumber();
  const text = encodeURIComponent(buildWhatsappMessage(product, talle));
  return `https://wa.me/${number}?text=${text}`;
}
