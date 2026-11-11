"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "@/app/common/ProductCard";
import { useCart } from "@/app/utils/useCart";
import {
  fetchProducts,
  type ProductFilterParams,
} from "@/app/store/slice/productSlice";
import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";

interface ProductListingSectionProps {
  sort: "newest" | "popular" | "";
  page: number;
}

const PAGE_SIZE = 12;

function ProductListingSection({ sort, page }: ProductListingSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart } = useCart();
  const { items: products, pagination, isLoading, error } = useSelector(
    (state: RootState) => state.products,
  );

  useEffect(() => {
    const params: ProductFilterParams = {
      page,
      limit: PAGE_SIZE,
      sort: "createdAt",
      order: "desc",
      ...(sort === "popular" ? { bestSeller: true } : {}),
    };

    void dispatch(fetchProducts(params));
  }, [dispatch, page, sort]);

  const title =
    sort === "newest"
      ? "New Arrivals"
      : sort === "popular"
        ? "Best Sellers"
        : "Shop All Products";

  return (
    <section className="w-full bg-[#fffdf9] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-semibold text-[#222] sm:mb-8 sm:text-3xl">
          {title}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="animate-pulse bg-white">
                <div className="aspect-[4/5] w-full bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-full rounded bg-gray-200" />
                  <div className="mx-auto h-5 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="py-16 text-center text-sm text-red-600">
            Unable to load products: {error}
          </div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-600">
            No products are available.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            {pagination.pages > 1 && (
              <nav
                aria-label="Product pages"
                className="mt-8 flex items-center justify-center gap-4"
              >
                {page > 1 ? (
                  <Link
                    href={`/products?sort=${sort}&page=${page - 1}`}
                    className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded border border-gray-200 px-4 py-2 text-sm text-gray-400">
                    Previous
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  Page {page} of {pagination.pages}
                </span>
                {page < pagination.pages ? (
                  <Link
                    href={`/products?sort=${sort}&page=${page + 1}`}
                    className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded border border-gray-200 px-4 py-2 text-sm text-gray-400">
                    Next
                  </span>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProductListingSection;
