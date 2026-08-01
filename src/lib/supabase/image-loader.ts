// Loader custom de next/image que delega el resize/compresión a la
// transformación de imágenes de Supabase Storage, en vez de procesar las
// imágenes en el servidor de Next.
//
// El `src` de las fotos de productos/banners es el path completo dentro de
// Storage: "<bucket>/<carpeta>/<archivo>.jpg". Los assets estáticos del sitio
// (ej. /logo.jpg en public/) usan paths locales y se sirven tal cual, sin
// pasar por la transformación de Supabase.

export default function supabaseImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("/")) {
    return src;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) {
    throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL para armar la URL de las imágenes.");
  }
  const params = new URLSearchParams({
    width: String(width),
    quality: String(quality ?? 75),
  });
  return `${baseUrl}/storage/v1/render/image/public/${src}?${params.toString()}`;
}
