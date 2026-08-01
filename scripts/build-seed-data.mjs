// Valida el catalogo migrado contra las fotos disponibles y genera
// supabase/seed-data.json, listo para ser insertado por scripts/seed-supabase.mjs.
//
// Uso: node scripts/build-seed-data.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalogSource } from "./catalog-source.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const photosDir = path.join(root, "catalog-source-photos");

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const usedSlugs = new Map();
function uniqueSlug(marca, nombre) {
  const base = slugify(`${marca} ${nombre}`);
  const count = usedSlugs.get(base) ?? 0;
  usedSlugs.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

const photosOnDisk = fs.existsSync(photosDir)
  ? new Set(fs.readdirSync(photosDir))
  : new Set();

const errors = [];
const usedPhotos = new Set();

const seed = catalogSource.map((item, index) => {
  if (!photosOnDisk.has(item.foto)) {
    errors.push(`Item ${index + 1} (${item.marca} ${item.nombre}): no se encontró la foto "${item.foto}" en catalog-source-photos/`);
  }
  usedPhotos.add(item.foto);

  return {
    slug: uniqueSlug(item.marca, item.nombre),
    marca: item.marca,
    nombre: item.nombre,
    categoria: item.categoria,
    descripcion: item.descripcion ?? null,
    precio_ars: item.precio_ars ?? null,
    precio_tarjeta_ars: item.precio_tarjeta_ars ?? null,
    en_oferta: item.en_oferta ?? false,
    precio_anterior_ars: item.precio_anterior_ars ?? null,
    estado: item.estado,
    nota: item.nota ?? null,
    destacado: false,
    talles: item.talles ?? [],
    foto: item.foto,
  };
});

if (photosOnDisk.size > 0) {
  const unused = [...photosOnDisk].filter((f) => !usedPhotos.has(f));
  if (unused.length) {
    console.warn(`Aviso: ${unused.length} foto(s) en catalog-source-photos/ no quedaron asignadas a ningún producto:`);
    for (const f of unused) console.warn(`  - ${f}`);
  }
}

if (errors.length) {
  console.error(`\n${errors.length} error(es) de validación:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const outPath = path.join(root, "supabase", "seed-data.json");
fs.writeFileSync(outPath, JSON.stringify(seed, null, 2));
console.log(`OK: ${seed.length} productos validados. Seed escrito en ${path.relative(root, outPath)}`);
