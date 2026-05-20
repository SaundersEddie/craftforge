import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  const db = env.DB;

  const result = await db
    .prepare(
      `SELECT id, name, product_type, status, created_at
       FROM products
       ORDER BY created_at DESC`
    )
    .all();

  return json({ products: result.results });
};

export const POST: APIRoute = async ({ request }) => {
  const db = env.DB;
  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const productType = String(body.product_type ?? "").trim();

  if (!name || !productType) {
    return json(
      { error: "Product name and product_type are required" },
      400
    );
  }

  const result = await db
    .prepare(
      `INSERT INTO products (
        name,
        product_type,
        material,
        dimensions,
        production_time_minutes,
        estimated_cost_cents,
        target_price_cents,
        color_options,
        finish_options,
        customization_rules,
        shipping_notes,
        care_notes,
        photo_notes,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id`
    )
    .bind(
      name,
      productType,
      body.material ?? null,
      body.dimensions ?? null,
      body.production_time_minutes ?? null,
      body.estimated_cost_cents ?? null,
      body.target_price_cents ?? null,
      body.color_options ?? null,
      body.finish_options ?? null,
      body.customization_rules ?? null,
      body.shipping_notes ?? null,
      body.care_notes ?? null,
      body.photo_notes ?? null,
      body.status ?? "draft"
    )
    .first<{ id: number }>();

  return json({ id: result?.id, message: "Product created" }, 201);
};
