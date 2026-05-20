import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { calculateListingHealth, type ProductForHealth } from "../../../lib/listingHealth";

export const prerender = false;

type GenerateLaunchPackInput = {
  product_id?: unknown;
};

type Product = ProductForHealth & {
  id: number;
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

function fallback(value: string | null, fallbackText: string) {
  return value && value.trim().length > 0 ? value.trim() : fallbackText;
}

function buildTags(product: Product) {
  const rawTags = [
    product.product_type,
    product.material,
    "handmade gift",
    "maker made",
    "small batch",
    "custom gift",
    "practical gift",
    "craft product",
    "workshop made",
    "unique gift",
    "home accessory",
    "gift idea",
    product.name,
  ];

  return rawTags
    .map((tag) => String(tag ?? "").trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 13);
}

function buildPhotoChecklist(product: Product) {
  return [
    "Main product photo on a clean background",
    "Photo showing size/scale",
    "Close-up of material and surface finish",
    "Photo showing color or finish options",
    "Photo showing the product in use",
    "Packaging or shipping-ready photo",
    product.photo_notes
      ? `Product-specific photo note: ${product.photo_notes}`
      : "Optional detail photo showing anything buyers may ask about",
  ];
}

function buildImprovementNotes(product: Product) {
  const notes: string[] = [];

  if (!product.dimensions) {
    notes.push("Add dimensions before using this for a real listing.");
  }

  if (!product.shipping_notes) {
    notes.push("Add shipping notes so buyers know what to expect.");
  }

  if (!product.care_notes) {
    notes.push("Add care notes, especially if material, heat, water, or outdoor use matters.");
  }

  if (!product.customization_rules) {
    notes.push("Add customization rules if buyers can request colors, text, size, or wording.");
  }

  if (notes.length === 0) {
    notes.push("Product notes look usable for a first listing draft.");
  }

  return notes;
}

export const POST: APIRoute = async ({ request }) => {
  const db = env.DB;
  const body = (await request.json()) as GenerateLaunchPackInput;
  const productId = asNumberOrNull(body.product_id);

  if (!productId) {
    return json({ error: "product_id is required" }, 400);
  }

  const product = await db
    .prepare(
      `SELECT
        id,
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
        photo_notes
      FROM products
      WHERE id = ?`
    )
    .bind(productId)
    .first<Product>();

  if (!product) {
    return json({ error: "Product not found" }, 404);
  }

  const material = fallback(product.material, "quality material");
  const dimensions = fallback(product.dimensions, "size details to be confirmed");
  const productType = fallback(product.product_type, "handmade product");

  const etsyTitle = `${product.name} - ${material} ${productType}`;
  const shortDescription = `${product.name} is a ${productType} made from ${material}. Approximate dimensions: ${dimensions}.`;

  const longDescription = [
    `${product.name} is a practical ${productType} designed for buyers who want something useful, personal, and maker-made.`,
    "",
    `Material: ${material}`,
    `Dimensions: ${dimensions}`,
    product.color_options ? `Color options: ${product.color_options}` : null,
    product.finish_options ? `Finish options: ${product.finish_options}` : null,
    product.customization_rules ? `Customization: ${product.customization_rules}` : null,
    product.shipping_notes ? `Shipping: ${product.shipping_notes}` : null,
    product.care_notes ? `Care: ${product.care_notes}` : null,
    "",
    "Because this is a maker-produced item, small variations may occur between pieces.",
  ]
    .filter(Boolean)
    .join("\n");

  const etsyTags = buildTags(product);

  const facebookPost = `New from the workshop: ${product.name}.\n\n${shortDescription}\n\nMade in small batches and ready for listing soon.`;

  const websiteBlurb = `${product.name} is a ${productType} made from ${material}, created as part of the Brindle Besties maker workflow.`;

  const photoChecklist = buildPhotoChecklist(product);
  const improvementNotes = buildImprovementNotes(product);
  const health = calculateListingHealth(product);

  const result = await db
    .prepare(
      `INSERT INTO launch_packs (
        product_id,
        etsy_title,
        short_description,
        long_description,
        etsy_tags_json,
        facebook_post,
        website_blurb,
        photo_checklist_json,
        improvement_notes_json,
        health_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id`
    )
    .bind(
      product.id,
      etsyTitle,
      shortDescription,
      longDescription,
      JSON.stringify(etsyTags),
      facebookPost,
      websiteBlurb,
      JSON.stringify(photoChecklist),
      JSON.stringify(improvementNotes),
      health.percentage
    )
    .first<{ id: number }>();

  return json(
    {
      id: result?.id,
      message: "Launch pack generated",
    },
    201
  );
};
