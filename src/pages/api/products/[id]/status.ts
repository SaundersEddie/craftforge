import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { PRODUCT_STATUSES, type ProductStatus } from "../../../../lib/productStatus";

export const prerender = false;

type StatusInput = {
  status?: unknown;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
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

function isProductStatus(value: unknown): value is ProductStatus {
  return typeof value === "string" && PRODUCT_STATUSES.includes(value as ProductStatus);
}

export const PATCH: APIRoute = async ({ params, request }) => {
  const db = env.DB;
  const id = asNumberOrNull(params.id);

  if (!id) {
    return json({ error: "Valid product id is required" }, 400);
  }

  const body = (await request.json()) as StatusInput;

  if (!isProductStatus(body.status)) {
    return json({ error: "Valid product status is required" }, 400);
  }

  const result = await db
    .prepare(
      `UPDATE products
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .bind(body.status, id)
    .run();

  if (result.meta.changes === 0) {
    return json({ error: "Product not found" }, 404);
  }

  return json({
    id,
    status: body.status,
    message: "Product status updated",
  });
};
