"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Pencil,
  Minus,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";
import { fetchProducts } from "@/app/store/slice/productSlice";
import { useCart } from "@/app/utils/useCart";

export default function CartSection() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    cart,
    itemCount,
    subtotal,
    fetchCart,
    updateCartItem,
    removeCartItem,
    isMutating,
  } = useCart();

  const items = cart?.items ?? [];

  const { items: products } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (products.length === 0) {
      void dispatch(
        fetchProducts({
          page: 1,
          limit: 8,
        }),
      );
    }
  }, [products.length, dispatch]);

  const suggestions = useMemo(() => {
    const cartProductIds = new Set(
      items.map((item) => item.product?._id ?? ""),
    );

    return products
      .filter((product) => !cartProductIds.has(product._id))
      .slice(0, 4);
  }, [products, items]);

  const resolveImage = (item: (typeof items)[number]) =>
    item.product?.variants?.find(
      (variant) => variant.size === item.size && variant.color === item.color,
    )?.images?.[0] ??
    item.product?.variants?.[0]?.images?.[0] ??
    item.product?.images?.[0] ??
    "";

  const resolveName = (item: (typeof items)[number]) =>
    item.product?.name ?? "";

  const resolveSize = (item: (typeof items)[number]) => item.size;

  return (
    <section className="min-h-screen w-full bg-[#F4F7F5] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-bold tracking-wider text-gray-900 sm:text-xl">
          SHOPPING CART ({itemCount})
        </h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-lg bg-white py-16 text-center">
            <p className="text-sm text-gray-500">Your cart is empty.</p>

            <Link
              href="/products"
              className="mt-4 inline-block rounded bg-[#1a1a1a] px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => {
                const price = item.price;

                const variant = item.product?.variants?.find(
                  (variant) =>
                    variant.size === item.size && variant.color === item.color,
                );

                const mrp = variant?.price ?? price;
                const hasDiscount = mrp > price;

                const image = resolveImage(item);
                const name = resolveName(item);
                const size = resolveSize(item);

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 rounded-lg bg-white p-4 shadow-sm"
                  >
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {image && (
                        <Image
                          src={image}
                          alt={name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 pr-2 text-sm font-medium text-gray-900 sm:text-base">
                          {name}
                        </p>

                        <button
                          type="button"
                          aria-label="Remove item"
                          disabled={isMutating}
                          onClick={() => removeCartItem(item._id)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {size && (
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-700">
                          <span>Size: {size.toUpperCase()}</span>

                          <button
                            type="button"
                            aria-label="Edit item"
                            disabled={isMutating}
                            className="text-gray-500 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      )}

                      {item.color && (
                        <div className="mt-1 text-xs text-gray-700">
                          Color: {item.color}
                        </div>
                      )}

                      <div className="mt-2 flex items-baseline gap-2 text-sm sm:text-base">
                        {hasDiscount && (
                          <span className="text-gray-400 line-through">
                            Rs {mrp.toLocaleString()}.00
                          </span>
                        )}

                        <span className="font-semibold text-red-600">
                          Rs {price.toLocaleString()}.00
                        </span>
                      </div>

                      <div className="mt-3 inline-flex w-fit items-center rounded border border-gray-300 bg-white">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={isMutating || item.quantity <= 1}
                          onClick={() =>
                            updateCartItem(
                              item._id,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          className="px-3 py-1.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="min-w-[32px] text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={isMutating}
                          onClick={() =>
                            updateCartItem(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900 sm:text-lg">
                    Subtotal:
                  </span>

                  <span className="text-base font-semibold text-gray-900 sm:text-lg">
                    Rs {subtotal.toLocaleString()}.00
                  </span>
                </div>

                <label className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300"
                  />

                  <span>
                    I agree with the{" "}
                    <button
                      type="button"
                      className="underline hover:text-gray-900"
                    >
                      terms and conditions
                    </button>
                  </span>
                </label>

                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center rounded bg-[#1a1a1a] px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black"
                  >
                    CHECKOUT
                  </Link>

                  <Link
                    href="/products"
                    className="flex items-center justify-center rounded border border-gray-900 bg-white px-4 py-3 text-sm font-semibold tracking-wide text-gray-900 transition hover:bg-gray-50"
                  >
                    CONTINUE SHOPPING
                  </Link>
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      You may also like
                    </h3>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Previous"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-100"
                      >
                        <ChevronLeft size={14} />
                      </button>

                      <button
                        type="button"
                        aria-label="Next"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-100"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {suggestions.slice(0, 1).map((product) => {
                    const variant = product.variants?.[0];

                    const image =
                      variant?.images?.[0] ?? product.images?.[0] ?? "";

                    const price = variant?.price ?? 0;

                    const salePrice =
                      typeof variant?.salePrice === "number" &&
                      variant.salePrice > 0
                        ? variant.salePrice
                        : price;

                    const hasDiscount = price > salePrice;

                    return (
                      <div key={product._id} className="flex gap-3 p-4">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          {image && (
                            <Image
                              src={image}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <p className="line-clamp-2 text-sm font-medium text-gray-900">
                              {product.name}
                            </p>

                            <div className="mt-1 flex items-baseline gap-2 text-sm">
                              {hasDiscount && (
                                <span className="text-xs text-gray-400 line-through">
                                  Rs {price.toLocaleString()}.00
                                </span>
                              )}

                              <span className="font-semibold text-red-600">
                                Rs {salePrice.toLocaleString()}.00
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/products/${product.slug ?? product._id}`}
                            className="mt-2 inline-flex w-fit items-center gap-2 rounded bg-[#EDEDED] px-4 py-2 text-xs font-semibold tracking-wide text-gray-800 transition hover:bg-[#E0E0E0]"
                          >
                            <Eye size={14} />
                            QUICK VIEW
                          </Link>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-center gap-2 pb-4">
                    {suggestions.map((_, index) => (
                      <span
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === 0 ? "bg-gray-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
