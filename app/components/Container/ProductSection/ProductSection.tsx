"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingCart, Eye, Star, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "@/app/store/slice/authModalSlice";
import {
  fetchProductBySlug,
  clearCurrentProduct,
} from "@/app/store/slice/productSlice";
import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";
import { useCart } from "@/app/utils/useCart";

interface ProductSectionProps {
  slug: string;
}

function ProductSection({ slug }: ProductSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const {
    currentProduct: product,
    isCurrentLoading: isLoading,
    currentError: error,
  } = useSelector((state: RootState) => state.products);

  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;
    void dispatch(fetchProductBySlug(slug));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  const activeVariant = product?.variants?.[activeVariantIndex];

  const variantImages = useMemo<string[]>(() => {
    if (!product) return [];
    const fromVariant = activeVariant?.images ?? [];
    const fromProduct = product.images ?? [];
    return Array.from(new Set([...fromVariant, ...fromProduct]));
  }, [product, activeVariant]);

  useEffect(() => {
    if (activeVariant?.size) setSelectedSize(activeVariant.size);
    setActiveImageIndex(0);
    setQuantity(1);
  }, [activeVariant]);

  const sizes = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set(product.variants.map((v) => v.size)));
  }, [product]);

  const price = activeVariant?.price ?? 0;
  const salePrice =
    typeof activeVariant?.salePrice === "number" && activeVariant.salePrice > 0
      ? activeVariant.salePrice
      : price;

  const discountPercent =
    price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const stock = activeVariant?.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const maxQuantity = Math.max(1, stock);

  const handleAddToCart = () => {
    if (!product || !activeVariant || isOutOfStock) return;
    if (!isAuthenticated || !user) {
      dispatch(openAuthModal("login"));
      return;
    }

    addToCart({
      productId: product._id,
      size: activeVariant.size,
      color: activeVariant.color,
      quantity: Math.min(quantity, maxQuantity),
    });
  };

  const handleSelectSize = (size: string) => {
    const idx = product?.variants.findIndex((v) => v.size === size) ?? -1;
    if (idx < 0) return;
    const variantStock = product?.variants[idx]?.stock ?? 0;
    if (variantStock <= 0) return;
    setSelectedSize(size);
    setActiveVariantIndex(idx);
  };

  if (isLoading && !product) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-4">
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="py-24 text-center text-sm text-red-500">{error}</div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center text-gray-500">Product not found.</div>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
            <AnimatePresence mode="wait">
              {variantImages[activeImageIndex] && (
                <motion.div
                  key={variantImages[activeImageIndex]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={variantImages[activeImageIndex]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {discountPercent > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
                -{discountPercent}%
              </span>
            )}

            {isOutOfStock && (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                OUT OF STOCK
              </span>
            )}
          </div>

          {variantImages.length > 1 && (
            <div className="flex gap-3 justify-center overflow-x-auto pb-1">
              {variantImages.map((img, index) => (
                <button
                  key={img + index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition ${
                    activeImageIndex === index
                      ? "border-[#003B1F]"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm text-gray-600">
            Type:{" "}
            <span className="font-medium text-gray-900">
              {product.category?.name ?? "Shirt"}
            </span>
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2">
            {discountPercent > 0 && (
              <span className="text-lg text-gray-400 line-through">
                Rs {price.toLocaleString()}.00
              </span>
            )}
            <span className="text-xl font-semibold text-red-600 sm:text-2xl">
              Rs {salePrice.toLocaleString()}.00
            </span>
          </div>

          <p className="text-sm text-gray-500">
            Tax included. <span className="underline">Shipping</span> calculated
            at checkout.
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Eye size={18} className="text-gray-500" />
            <span className="font-semibold text-red-600">15</span>
            <span>People are viewing this right now</span>
          </div>

          {isOutOfStock ? (
            <p className="text-sm font-semibold text-red-600">Out of stock</p>
          ) : stock <= 5 ? (
            <p className="text-sm font-semibold text-orange-600">
              Only {stock} left in stock
            </p>
          ) : null}

          {sizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  SIZE: {selectedSize?.toUpperCase()}
                </span>
                <button
                  type="button"
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  SIZE CHART
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variantForSize = product.variants.find(
                    (v) => v.size === size,
                  );
                  const variantStock = variantForSize?.stock ?? 0;
                  const isDisabled = variantStock <= 0;
                  const isActive = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectSize(size)}
                      className={`relative min-w-[48px] rounded border px-3 py-2 text-sm font-medium transition ${
                        isDisabled
                          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                          : isActive
                            ? "border-[#003B1F] bg-[#003B1F] text-white"
                            : "border-gray-300 bg-white text-gray-800 hover:border-gray-500"
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-stretch gap-3">
            <div className="flex items-center rounded border border-gray-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={isOutOfStock || quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-[40px] text-center text-base font-medium">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={isOutOfStock || quantity >= maxQuantity}
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                className="px-4 py-3 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded border border-gray-300 bg-white px-6 py-3 text-sm font-medium tracking-wide text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full rounded bg-[#1a1a1a] px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isOutOfStock ? "OUT OF STOCK" : "BUY IT NOW"}
          </button>

          <div className="mt-2 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold underline">Material:</span> Premium
              Rayon Blend
            </p>
            <p>
              <span className="font-semibold underline">Fit:</span> Oversized
              Fit
            </p>
            {product.description && (
              <p className="pt-2 text-gray-600">{product.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-t border-gray-100 pt-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Customer Reviews
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                Be the first to write a review
              </span>
            </div>
          </div>

          <button
            type="button"
            className="rounded border border-gray-300 px-5 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
          >
            Write a review
          </button>
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white shadow-lg transition hover:bg-gray-50"
      >
        <ChevronUp size={20} />
      </button>
    </section>
  );
}

export default ProductSection;
