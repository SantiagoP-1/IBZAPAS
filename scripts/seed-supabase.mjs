// Sube las fotos del catalogo a Supabase Storage e inserta productos,
// variantes (talles) e imagenes a partir de supabase/seed-data.json.
//
// Requiere que ya se haya corrido la migracion (supabase/migrations/0001_init.sql)
// contra el proyecto real, y las credenciales en .env.local.
//
// Uso:
//   node scripts/build-seed-data.mjs   (si no se corrió antes)
//   node --env-file=.env.local scripts/seed-supabase.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Corré este script con --env-file=.env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const seedPath = path.join(root, "supabase", "seed-data.json");
if (!fs.existsSync(seedPath)) {
  console.error("No existe supabase/seed-data.json. Corré primero: node scripts/build-seed-data.mjs");
  process.exit(1);
}

const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
const photosDir = path.join(root, "catalog-source-photos");

async function uploadProductPhoto(slug, filename) {
  const filePath = path.join(photosDir, filename);
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase() || ".jpg";
  const storagePath = `product-images/${slug}/1${ext}`;
  // storage_path guardado en DB incluye el bucket, para que el image-loader
  // de next/image arme la URL de transformación directamente.
  const objectPath = storagePath.replace(/^product-images\//, "");

  const { error } = await supabase.storage
    .from("product-images")
    .upload(objectPath, fileBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(`Error subiendo ${filename}: ${error.message}`);
  return storagePath;
}

async function main() {
  console.log(`Sembrando ${seed.length} productos...`);

  for (const item of seed) {
    const storagePath = await uploadProductPhoto(item.slug, item.foto);

    const { data: product, error: productError } = await supabase
      .from("products")
      .upsert(
        {
          slug: item.slug,
          marca: item.marca,
          nombre: item.nombre,
          categoria: item.categoria,
          descripcion: item.descripcion,
          precio_ars: item.precio_ars,
          precio_tarjeta_ars: item.precio_tarjeta_ars,
          en_oferta: item.en_oferta,
          precio_anterior_ars: item.precio_anterior_ars,
          estado: item.estado,
          nota: item.nota,
          destacado: item.destacado,
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (productError) throw new Error(`Error en producto ${item.slug}: ${productError.message}`);

    await supabase.from("product_variants").delete().eq("product_id", product.id);
    if (item.talles.length > 0) {
      const { error: variantsError } = await supabase.from("product_variants").insert(
        item.talles.map((talle) => ({ product_id: product.id, talle, disponible: true }))
      );
      if (variantsError) throw new Error(`Error en variantes de ${item.slug}: ${variantsError.message}`);
    }

    await supabase.from("product_images").delete().eq("product_id", product.id);
    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: product.id,
      storage_path: storagePath,
      orden: 0,
    });
    if (imageError) throw new Error(`Error en imagen de ${item.slug}: ${imageError.message}`);

    console.log(`OK: ${item.marca} ${item.nombre} (${item.slug})`);
  }

  console.log("Listo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
