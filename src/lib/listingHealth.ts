export type ProductForHealth = {
  name: string;
  product_type: string;
  material: string | null;
  dimensions: string | null;
  production_time_minutes: number | null;
  estimated_cost_cents: number | null;
  target_price_cents: number | null;
  color_options: string | null;
  finish_options: string | null;
  customization_rules: string | null;
  shipping_notes: string | null;
  care_notes: string | null;
  photo_notes: string | null;
  status?: string | null;
};

export type ListingHealthResult = {
  score: number;
  maxScore: number;
  percentage: number;
  checks: {
    label: string;
    passed: boolean;
    message: string;
  }[];
  warnings: string[];
};

function hasText(value: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

export function calculateListingHealth(
  product: ProductForHealth
): ListingHealthResult {
  const checks = [
    {
      label: "Product name",
      passed: hasText(product.name),
      message: hasText(product.name)
        ? "Product has a name."
        : "Product needs a clear name.",
    },
    {
      label: "Product type",
      passed: hasText(product.product_type),
      message: hasText(product.product_type)
        ? "Product type is set."
        : "Product needs a type/category.",
    },
    {
      label: "Material",
      passed: hasText(product.material),
      message: hasText(product.material)
        ? "Material is listed."
        : "Add the material so buyers know what they are getting.",
    },
    {
      label: "Dimensions",
      passed: hasText(product.dimensions),
      message: hasText(product.dimensions)
        ? "Dimensions are listed."
        : "Add dimensions. Buyers should not have to guess size.",
    },
    {
      label: "Production time",
      passed:
        typeof product.production_time_minutes === "number" &&
        product.production_time_minutes > 0,
      message:
        typeof product.production_time_minutes === "number" &&
        product.production_time_minutes > 0
          ? "Production time is set."
          : "Add production time so pricing can be judged properly.",
    },
    {
      label: "Estimated cost",
      passed:
        typeof product.estimated_cost_cents === "number" &&
        product.estimated_cost_cents >= 0,
      message:
        typeof product.estimated_cost_cents === "number" &&
        product.estimated_cost_cents >= 0
          ? "Estimated cost is set."
          : "Add an estimated material/production cost.",
    },
    {
      label: "Target price",
      passed:
        typeof product.target_price_cents === "number" &&
        product.target_price_cents > 0,
      message:
        typeof product.target_price_cents === "number" &&
        product.target_price_cents > 0
          ? "Target price is set."
          : "Add a target selling price.",
    },
    {
      label: "Shipping notes",
      passed: hasText(product.shipping_notes),
      message: hasText(product.shipping_notes)
        ? "Shipping notes are included."
        : "Add shipping notes so the listing is not vague.",
    },
    {
      label: "Care notes",
      passed: hasText(product.care_notes),
      message: hasText(product.care_notes)
        ? "Care notes are included."
        : "Add care notes, especially for 3D prints, wood, finishes, or outdoor use.",
    },
    {
      label: "Photo notes",
      passed: hasText(product.photo_notes),
      message: hasText(product.photo_notes)
        ? "Photo notes are included."
        : "Add photo notes so you know what images the listing needs.",
    },
  ];

  const warnings: string[] = [];

  const isReadyToList = product.status === "ready_to_list";

  if (isReadyToList) {
    const missingReadyFields: string[] = [];

    if (!hasText(product.material)) {
      missingReadyFields.push("material");
    }

    if (!hasText(product.dimensions)) {
      missingReadyFields.push("dimensions");
    }

    if (
      typeof product.target_price_cents !== "number" ||
      product.target_price_cents <= 0
    ) {
      missingReadyFields.push("target price");
    }

    if (!hasText(product.shipping_notes)) {
      missingReadyFields.push("shipping notes");
    }

    if (!hasText(product.care_notes)) {
      missingReadyFields.push("care notes");
    }

    if (!hasText(product.photo_notes)) {
      missingReadyFields.push("photo notes");
    }

    if (missingReadyFields.length > 0) {
      warnings.push(
        `This product is marked Ready to List, but it is missing: ${missingReadyFields.join(
          ", "
        )}. That is not ready. That is wishful thinking with a price tag.`
      );
    }
  }
  
  if (
    typeof product.production_time_minutes === "number" &&
    typeof product.target_price_cents === "number" &&
    product.production_time_minutes >= 120 &&
    product.target_price_cents < 1500
  ) {
    warnings.push(
      "This takes 2+ hours to make and is priced under $15. That is probably not a product. That is a cry for help."
    );
  }

  if (
    typeof product.estimated_cost_cents === "number" &&
    typeof product.target_price_cents === "number" &&
    product.target_price_cents > 0 &&
    product.estimated_cost_cents > product.target_price_cents * 0.4
  ) {
    warnings.push(
      "Estimated cost is more than 40% of the target price. Check the margin before listing this."
    );
  }

  if (
    product.product_type.toLowerCase().includes("3d") &&
    ![product.care_notes, product.shipping_notes, product.customization_rules]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes("variation")
  ) {
    warnings.push(
      "For 3D printed products, mention print lines, small surface variation, or color variation where relevant."
    );
  }

  const score = checks.filter((check) => check.passed).length;
  const maxScore = checks.length;
  const percentage = Math.round((score / maxScore) * 100);

  return {
    score,
    maxScore,
    percentage,
    checks,
    warnings,
  };
}
