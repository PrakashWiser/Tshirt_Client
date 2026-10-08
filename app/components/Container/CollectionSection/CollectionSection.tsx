"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "@/app/common/ProductCard";
import { useCart } from "@/app/utils/useCart";
import {
  fetchProducts,
  type Product,
  type ProductFilterParams,
} from "@/app/store/slice/productSlice";
import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";
import { fetchParentCategories } from "@/app/store/slice/parentCategorySlice";

interface CollectionSectionProps {
  slug: string;
}

const SORT_MAP: Record<string, Pick<ProductFilterParams, "sort" | "order">> = {
  "Most Popular": { sort: "createdAt", order: "desc" },
  Newest: { sort: "createdAt", order: "desc" },
  "Price: Low to High": { sort: "price", order: "asc" },
  "Price: High to Low": { sort: "price", order: "desc" },
};

function CollectionSection({ slug }: CollectionSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart } = useCart();

  const [sortBy, setSortBy] = useState("Most Popular");

  const {
    items: products,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.products);

  const { items: categories } = useSelector(
    (state: RootState) => state.parentCategories,
  );

  useEffect(() => {
    void dispatch(fetchParentCategories());
  }, [dispatch]);

  const category = useMemo(
    () =>
      categories.find((item) => item.slug.toLowerCase() === slug.toLowerCase()),
    [categories, slug],
  );

  useEffect(() => {
    if (!category?._id) return;

    const sortConfig = SORT_MAP[sortBy] ?? SORT_MAP["Most Popular"];

    const params: ProductFilterParams = {
      category: category._id,
      page: 1,
      limit: 12,
      ...sortConfig,
    };

    void dispatch(fetchProducts(params));
  }, [dispatch, category?._id, sortBy]);

  const collectionName = useMemo(
    () =>
      slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    [slug],
  );

  const safeProducts: Product[] = Array.isArray(products) ? products : [];

  const isResolvingCategory = categories.length === 0;
  const isCategoryMissing = !isResolvingCategory && !category;
  const isInitialLoading = isResolvingCategory || isLoading;

  return (
    <section className="w-full bg-[#fffdf9] py-6">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="my-6 flex items-center justify-between border-b border-gray-200 pb-4 sm:mb-10">
          <h1 className="text-2xl font-semibold text-[#111] sm:text-3xl">
            {category?.name || collectionName} 
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm font-medium text-[#111] sm:block sm:text-base">
              Sort By
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer appearance-none rounded-full border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-[#111] shadow-sm outline-none transition hover:border-gray-300 sm:py-3 sm:pl-5 sm:pr-11 sm:text-base"
            >
              {Object.keys(SORT_MAP).map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {isCategoryMissing ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Category not found.
          </div>
        ) : isInitialLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse bg-gray-200"
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-500">{error}</div>
        ) : safeProducts.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No products available.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {safeProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CollectionSection;
