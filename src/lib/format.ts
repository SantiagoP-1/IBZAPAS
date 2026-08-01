const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPrice(precioArs: number | null): string {
  if (precioArs == null) return "Consultar precio";
  return arsFormatter.format(precioArs);
}
