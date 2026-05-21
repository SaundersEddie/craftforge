export const PRODUCT_STATUSES = [
  "draft",
  "needs_photos",
  "needs_pricing",
  "ready_to_list",
  "listed",
  "archived",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  draft: "Draft",
  needs_photos: "Needs Photos",
  needs_pricing: "Needs Pricing",
  ready_to_list: "Ready to List",
  listed: "Listed",
  archived: "Archived",
};

export function getProductStatusLabel(status: string | null | undefined) {
  if (!status) return "Draft";

  return (
    PRODUCT_STATUS_LABELS[status as ProductStatus] ??
    status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}
