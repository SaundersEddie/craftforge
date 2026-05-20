import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

type ProductInput = {
  name?: unknown;
  product_type?: unknown;
  material?: unknown;
  dimensions?: unknown;
  production_time_minutes?: unknown;
  estimated_cost_cents?: unknown;
  target_price_cents?: unknown;
  color_options?: unknown;
  finish_options?: unknown;
  customization_rules?: unknown;
  shipping_notes?: unknown;
  care_notes?: unknown;
  photo_notes?: unknown;
  status?: unknown;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function asStringOrNull(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asNumberOrNull(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
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
  const body = (await request.json()) as ProductInput;

  const name = asStringOrNull(body.name);
  const productType = asStringOrNull(body.product_type);

  if (!name || !productType) {
    return json({ error: "Product name and product_type are required" }, 400);
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
      asStringOrNull(body.material),
      asStringOrNull(body.dimensions),
      asNumberOrNull(body.production_time_minutes),
      asNumberOrNull(body.estimated_cost_cents),
      asNumberOrNull(body.target_price_cents),
      asStringOrNull(body.color_options),
      asStringOrNull(body.finish_options),
      asStringOrNull(body.customization_rules),
      asStringOrNull(body.shipping_notes),
      asStringOrNull(body.care_notes),
      asStringOrNull(body.photo_notes),
      asStringOrNull(body.status) ?? "draft"
    )
    .first<{ id: number }>();

  return json({ id: result?.id, message: "Product created" }, 201);
};
