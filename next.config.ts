import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/supabase/image-loader.ts",
  },
  // Permite abrir el dev server desde el celular/otra PC en la misma red
  // (útil para probar el catálogo en mobile). Solo afecta `next dev`.
  allowedDevOrigins: ["192.168.0.223"],
};

export default nextConfig;
