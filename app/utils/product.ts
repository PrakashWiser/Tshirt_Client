import type { Product, ProductVariant } from "@/app/store/slice/productSlice";

export const getAvailableVariant = (
  product: Product,
): ProductVariant | undefined =>
  product.variants?.find((variant) => variant.isActive && variant.stock > 0);

export const getEffectivePrice = (
  variant?: ProductVariant,
): number => {
  if (!variant) return 0;
  return variant.salePrice > 0 ? variant.salePrice : variant.price;
};

export const getProductImage = (
  product: Product,
  variant?: ProductVariant,
): string =>
  variant?.images?.[0] ?? product.images?.[0] ?? "";
