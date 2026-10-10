"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";

import {
  fetchWishlist,
  removeFromWishlist,
} from "@/app/store/slice/wishlistSlice";

function WishlistSection() {
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  const isLoading = useSelector((state: RootState) => state.wishlist.isLoading);

  const isMutating = useSelector(
    (state: RootState) => state.wishlist.isMutating,
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#F4F7F5] px-4 py-10">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F4F7F5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-gray-900">
              MY FAVOURITES
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <Heart size={20} className="fill-red-500 text-red-500" />
          </div>
        </div>
        {wishlist.length === 0 ? (
          <div className="rounded-lg bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Heart size={28} className="text-gray-400" />
            </div>

            <h2 className="mt-5 text-base font-semibold text-gray-900">
              Your favourites are empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Save products you love and find them here later.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              SHOP PRODUCTS
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => {
              const product = item.product;

              if (!product) return null;

              const image =
                product.images?.[0] || product.variants?.[0]?.images?.[0] || "";

              const variant = product.variants?.[0];

              const price = Number(variant?.price ?? 0);
              const salePrice = Number(variant?.salePrice ?? price);

              const hasDiscount = salePrice < price;

              const productId = product._id;

              const productUrl = `/products/${product.slug || productId}`;

              return (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row"
                >
                  <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-36 sm:w-32">
                    {image ? (
                      <Image
                        src={image}
                        alt={product.name || "Product"}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    {hasDiscount && (
                      <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-[10px] font-semibold text-white">
                        SALE
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <Link
                          href={productUrl}
                          className="text-sm font-semibold text-gray-900 hover:text-gray-600 sm:text-base"
                        >
                          {product.name}
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleRemove(productId)}
                          disabled={isMutating}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                          aria-label="Remove from favourites"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                        )}

                        <span className="text-sm font-semibold text-red-600">
                          ₹{salePrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={productUrl}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800 sm:flex-none"
                      >
                        <ShoppingBag size={14} />
                        VIEW PRODUCT
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemove(productId)}
                        disabled={isMutating}
                        className="flex h-10 w-10 items-center justify-center rounded border border-gray-200 text-gray-600 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                        aria-label="Remove favourite"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default WishlistSection;
