export type Categoria = "zapatillas" | "indumentaria" | "accesorios";
export type Estado = "disponible" | "agotado";

export type ProductVariant = {
  id: string;
  talle: string;
  disponible: boolean;
};

export type ProductImage = {
  id: string;
  storage_path: string;
  orden: number;
};

export type Product = {
  id: string;
  slug: string;
  marca: string;
  nombre: string;
  categoria: Categoria;
  descripcion: string | null;
  precio_ars: number | null;
  precio_tarjeta_ars: number | null;
  en_oferta: boolean;
  precio_anterior_ars: number | null;
  estado: Estado;
  nota: string | null;
  destacado: boolean;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
};

export type Banner = {
  id: string;
  titulo: string;
  texto: string | null;
  imagen_storage_path: string | null;
  link: string | null;
  activo: boolean;
  orden: number;
};
