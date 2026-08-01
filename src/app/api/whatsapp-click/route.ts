import { NextRequest, NextResponse } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, marca, nombre, talle } = body as {
    productId: string;
    marca: string;
    nombre: string;
    talle?: string;
  };

  if (!productId || !marca || !nombre) {
    return NextResponse.json({ error: "Faltan datos del producto" }, { status: 400 });
  }

  const supabase = createSupabasePublicClient();
  const { error } = await supabase.from("whatsapp_clicks").insert({
    product_id: productId,
    producto_marca: marca,
    producto_nombre: nombre,
    talle: talle ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
