export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-2 border-brand-blue/30 bg-brand-blue-soft dark:border-brand-blue/20 dark:bg-zinc-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-3 sm:px-6">
        <div>
          <h4 className="mb-2 font-semibold text-brand-navy dark:text-zinc-50">Showroom</h4>
          <p>16 entre 23 y 25 nro 822</p>
          <p>Balcarce, Buenos Aires (7620)</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-brand-navy dark:text-zinc-50">Horario</h4>
          <p>Lunes a sábados</p>
          <p>10 a 12:30 hs y 16:30 a 20:30 hs</p>
          <p>Feriados: 16:30 a 20:30 hs</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-brand-navy dark:text-zinc-50">Medios de pago</h4>
          <p>Débito / crédito (3 cuotas sin interés)</p>
          <p>Transferencia · Efectivo</p>
          <p>Envíos a todo el país</p>
        </div>
      </div>
    </footer>
  );
}
