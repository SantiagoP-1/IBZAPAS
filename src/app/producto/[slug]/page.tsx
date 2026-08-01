import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";

export const revalidate = 300;

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery
          images={product.product_images}
          alt={`${product.marca} ${product.nombre}`}
        />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}
