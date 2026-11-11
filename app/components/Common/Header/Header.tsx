"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ClipboardList,
  Loader2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "@/app/utils/useCart";
import { fetchProducts, type Product } from "@/app/store/slice/productSlice";
import {
  fetchCategories,
  fetchParentCategories,
} from "@/app/store/slice/parentCategorySlice";
import { fetchWishlist } from "@/app/store/slice/wishlistSlice";
import { logoutUser } from "@/app/store/slice/authSlice";
import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";
import { openAuthModal } from "@/app/store/slice/authModalSlice";
import { getAvailableVariant, getEffectivePrice, getProductImage } from "@/app/utils/product";

const navItems = [
  { label: "Shop", href: "/products" },
  { label: "T-Shirts", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Best Sellers", href: "/products?sort=popular" },
];
const EMPTY_PRODUCTS: Product[] = [];

function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [expandedMobileCategoryId, setExpandedMobileCategoryId] = useState<
    string | null
  >(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const { itemCount, fetchCart } = useCart();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, isLoading } = useSelector(
    (state: RootState) => state.products,
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.wishlist.length,
  );
  const {
    items: parentCategories,
    categories,
    isLoading: isParentCategoriesLoading,
    error: parentCategoriesError,
    isCategoriesLoading,
    categoriesError,
  } = useSelector((state: RootState) => state.parentCategories);

  const safeProducts: Product[] = Array.isArray(products) ? products : [];

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    if (searchOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch, searchOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    if (accountMenuOpen) window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [accountMenuOpen]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) return;

    void dispatch(
      fetchProducts({
        search: q,
        page: 1,
        limit: 6,
      }),
    );
  }, [debouncedQuery, dispatch]);

  const showResults = debouncedQuery.trim().length > 0;
  const results = showResults ? safeProducts.slice(0, 6) : EMPTY_PRODUCTS;

  useEffect(() => {
    void dispatch(fetchParentCategories());
    void dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchCart();
      void dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated, fetchCart]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href="/" aria-label="SND Shop home">
              <Image
                src="/images/logo.png"
                alt="SND Shop"
                width={130}
                height={60}
                priority
                className="h-auto w-[100px] object-contain sm:w-[110px]"
              />
            </Link>

            <nav
              aria-label="Main navigation"
              className="hidden flex-1 items-center justify-center gap-5 md:flex"
            >
              <div className="group relative">
                <Link
                  href="/products"
                  aria-haspopup="true"
                  className="group flex items-center gap-1 whitespace-nowrap text-sm font-medium text-gray-800 transition-colors duration-200 hover:text-[#003B1F]"
                >
                  Shop
                  <ChevronDown
                    size={13}
                    strokeWidth={1.8}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 mt-2 max-h-72 min-w-48 overflow-y-auto overscroll-contain rounded-lg border border-gray-100 bg-white py-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <Link
                    href="/products"
                    className="block px-4 py-2 text-sm font-semibold text-[#003B1F] hover:bg-[#F4F7F5]"
                  >
                    All Products
                  </Link>
                  {parentCategories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/collections/${category.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F4F7F5] hover:text-[#003B1F]"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              {parentCategories
                .filter((category) =>
                  /\bmen(?:'s)?\b|\bkids?\b|\bchildren\b/i.test(category.name),
                )
                .map((category) => {
                const childCategories = categories.filter(
                  (item) => item.parentCategory?._id === category._id,
                );
                const hasDropdown =
                  childCategories.length > 0 ||
                  isCategoriesLoading ||
                  Boolean(categoriesError);

                return (
                  <div key={category._id} className="group relative">
                    <Link
                      href={`/collections/${category.slug}`}
                      aria-haspopup={hasDropdown}
                      className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-gray-800 transition-colors duration-200 hover:text-[#003B1F]"
                    >
                      {category.name}
                      {hasDropdown && (
                        <ChevronDown
                          size={13}
                          strokeWidth={1.8}
                          className="transition-transform duration-200 group-hover:rotate-180"
                        />
                      )}
                    </Link>
                    {hasDropdown && (
                      <div className="invisible absolute left-0 top-full z-50 mt-2 max-h-72 min-w-48 translate-y-1 overflow-y-auto overscroll-contain rounded-lg border border-gray-100 bg-white py-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <Link
                          href={`/collections/${category.slug}`}
                          className="block px-4 py-2 text-sm font-semibold text-[#003B1F] hover:bg-[#F4F7F5]"
                        >
                          All {category.name}
                        </Link>
                        {childCategories.map((child) => (
                          <Link
                            key={child._id}
                            href={`/collections/${child.slug}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F4F7F5] hover:text-[#003B1F]"
                          >
                            {child.name}
                          </Link>
                        ))}
                        {isCategoriesLoading && childCategories.length === 0 && (
                          <p className="px-4 py-2 text-sm text-gray-500">
                            Loading categories...
                          </p>
                        )}
                        {categoriesError && childCategories.length === 0 && (
                          <p role="alert" className="px-4 py-2 text-sm text-red-600">
                            Unable to load categories.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {navItems
                .filter((item) => item.label !== "Shop")
                .map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="group flex items-center gap-1 whitespace-nowrap text-sm font-medium text-gray-800 transition-colors duration-200 hover:text-[#003B1F]"
                  >
                    {item.label}
                  </Link>
                ))}
              {isParentCategoriesLoading && parentCategories.length === 0 && (
                <span className="text-sm text-gray-500">Loading categories...</span>
              )}
              {parentCategoriesError && parentCategories.length === 0 && (
                <span role="alert" className="text-sm text-red-600">
                  Categories could not be loaded.
                </span>
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-4 ">
              <button
                type="button"
                aria-label="Search"
                aria-expanded={searchOpen}
                onClick={() => {
                  if (searchOpen) {
                    closeSearch();
                    return;
                  }
                  setSearchOpen(true);
                  window.setTimeout(() => inputRef.current?.focus(), 80);
                }}
                className="flex items-center gap-2 text-gray-800 transition-colors hover:text-[#003B1F]"
              >
                <Search size={22} strokeWidth={1.8} />
                <span className="hidden whitespace-nowrap text-sm font-medium lg:inline">
                  Search
                </span>
              </button>

              {!isAuthenticated ? (
                <button
                  type="button"
                  aria-label="Account"
                  onClick={() => dispatch(openAuthModal("login"))}
                  className="text-gray-800 transition-colors hover:text-[#003B1F]"
                >
                  <UserRound size={22} strokeWidth={1.8} />
                </button>
              ) : (
                <div className="relative" ref={accountRef}>
                  <button
                    type="button"
                    aria-label="Account menu"
                    aria-expanded={accountMenuOpen}
                    onClick={() => setAccountMenuOpen((v) => !v)}
                    className="flex items-center gap-2 text-gray-800 cursor-pointer transition-colors hover:text-[#003B1F]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003B1F] text-xs font-semibold text-white">
                      {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {accountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl"
                      >
                        <Link
                          href="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-800 transition hover:bg-[#F4F7F5]"
                        >
                          <UserIcon size={16} />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-gray-800 transition hover:bg-[#F4F7F5]"
                        >
                          <ClipboardList size={16} />
                          My Orders
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            void dispatch(logoutUser());
                          }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <Link
                href="/wishlist"
                aria-label={
                  wishlistCount > 0 && isAuthenticated
                    ? `Wishlist, ${wishlistCount} saved`
                    : "Wishlist"
                }
                className="relative hidden text-gray-800 transition-colors hover:text-[#003B1F] sm:block"
              >
                <Heart size={22} strokeWidth={1.8} />
                <AnimatePresence>
                  {wishlistCount > 0 && isAuthenticated && (
                    <motion.span
                      key={wishlistCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                      className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#003B1F] px-1 text-[10px] font-semibold text-white"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link
                href="/cart"
                aria-label="Shopping cart"
                className="relative text-gray-800 transition-colors hover:text-[#003B1F]"
              >
                <ShoppingBag size={22} strokeWidth={1.8} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                      className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#003B1F] px-1 text-[10px] font-semibold text-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button
                type="button"
                aria-label={
                  mobileMenu ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={mobileMenu}
                onClick={() => setMobileMenu((v) => !v)}
                className="text-gray-800 md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenu ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="inline-block"
                    >
                      <X size={24} strokeWidth={1.8} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="inline-block"
                    >
                      <Menu size={24} strokeWidth={1.8} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <>
              <motion.div
                key="search-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={closeSearch}
                className="fixed inset-0 top-20 z-40 bg-black/30"
              />

              <motion.div
                key="search-panel"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 right-0 top-full z-50 mx-auto w-full max-w-3xl px-3 sm:px-6"
              >
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
                    <Search
                      size={20}
                      strokeWidth={1.8}
                      className="shrink-0 text-gray-400"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search for products, categories..."
                      className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 sm:text-base"
                    />
                    {isLoading && showResults && (
                      <Loader2
                        size={18}
                        className="animate-spin text-gray-400"
                      />
                    )}
                    {query && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => {
                          setQuery("");
                          inputRef.current?.focus();
                        }}
                        className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {showResults ? (
                    <div className="max-h-[70vh] overflow-y-auto">
                      {isLoading && results.length === 0 ? (
                        <div className="space-y-2 p-3">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex animate-pulse items-center gap-3 rounded-lg p-2"
                            >
                              <div className="h-14 w-14 rounded-md bg-gray-200" />
                              <div className="flex-1 space-y-2">
                                <div className="h-3 w-2/3 rounded bg-gray-200" />
                                <div className="h-3 w-1/3 rounded bg-gray-200" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : results.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-gray-500">
                          No products found for &ldquo;{debouncedQuery}&rdquo;
                        </div>
                      ) : (
                        <ul className="p-2">
                          {results.map((product) => {
                            const variant = getAvailableVariant(product);
                            const image = getProductImage(product, variant);
                            const price = getEffectivePrice(variant);

                            return (
                              <li key={product._id}>
                                <Link
                                  href={`/products/${product.slug ?? product._id}`}
                                  onClick={closeSearch}
                                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#F4F7F5]"
                                >
                                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                    {image ? (
                                      <Image
                                        src={image}
                                        alt={product.name}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                        No image
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900">
                                      {product.name}
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-[#003B1F]">
                                      ₹{price.toFixed(2)}
                                    </p>
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {results.length > 0 && (
                        <Link
                          href={`/products?search=${encodeURIComponent(
                            debouncedQuery,
                          )}`}
                          onClick={closeSearch}
                          className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-medium text-[#003B1F] transition-colors hover:bg-[#F4F7F5]"
                        >
                          View all results for &ldquo;{debouncedQuery}&rdquo;
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-xs text-gray-400 sm:text-sm">
                      Start typing to search products...
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
            >
              <nav
                aria-label="Mobile navigation"
                className="mx-auto max-w-7xl px-4 py-4"
              >
                <motion.div
                  className="space-y-1"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.045,
                        delayChildren: 0.05,
                      },
                    },
                  }}
                >
                  {navItems.map((item) => (
                    <motion.div
                      key={item.href + item.label}
                      variants={{
                        hidden: { opacity: 0, x: -12 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenu(false)}
                        className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                      >
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  {parentCategories.map((category) => {
                    const childCategories = categories.filter(
                      (item) => item.parentCategory?._id === category._id,
                    );
                    const expanded =
                      expandedMobileCategoryId === category._id;
                    const hasDropdown =
                      childCategories.length > 0 ||
                      isCategoriesLoading ||
                      Boolean(categoriesError);

                    return (
                      <motion.div
                        key={category._id}
                        variants={{
                          hidden: { opacity: 0, x: -12 },
                          show: { opacity: 1, x: 0 },
                        }}
                      >
                        <div className="flex items-center rounded-lg hover:bg-[#E8F1EC]">
                          <Link
                            href={`/collections/${category.slug}`}
                            onClick={() => setMobileMenu(false)}
                            className="flex-1 px-3 py-3 text-sm font-medium text-gray-800 hover:text-[#003B1F]"
                          >
                            {category.name}
                          </Link>
                          {hasDropdown && (
                            <button
                              type="button"
                              aria-label={`${expanded ? "Collapse" : "Expand"} ${category.name} categories`}
                              aria-expanded={expanded}
                              onClick={() =>
                                setExpandedMobileCategoryId(
                                  expanded ? null : category._id,
                                )
                              }
                              className="px-3 py-3 text-gray-700"
                            >
                              <ChevronDown
                                size={16}
                                strokeWidth={1.8}
                                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          )}
                        </div>
                        {expanded && (
                          <div className="ml-3 border-l border-gray-200 pl-3">
                            {childCategories.map((child) => (
                              <Link
                                key={child._id}
                                href={`/collections/${child.slug}`}
                                onClick={() => setMobileMenu(false)}
                                className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                              >
                                {child.name}
                              </Link>
                            ))}
                            {isCategoriesLoading &&
                              childCategories.length === 0 && (
                                <p className="px-3 py-2.5 text-sm text-gray-500">
                                  Loading categories...
                                </p>
                              )}
                            {categoriesError &&
                              childCategories.length === 0 && (
                                <p
                                  role="alert"
                                  className="px-3 py-2.5 text-sm text-red-600"
                                >
                                  Unable to load categories.
                                </p>
                              )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                  {isParentCategoriesLoading && parentCategories.length === 0 && (
                    <p className="px-3 py-3 text-sm text-gray-500">
                      Loading categories...
                    </p>
                  )}
                  {(parentCategoriesError || categoriesError) &&
                    parentCategories.length === 0 && (
                    <p role="alert" className="px-3 py-3 text-sm text-red-600">
                      Unable to load categories.
                    </p>
                  )}

                  {isAuthenticated && (
                    <>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -12 },
                          show: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href="/account"
                          onClick={() => setMobileMenu(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                        >
                          <UserIcon size={18} strokeWidth={1.8} />
                          My Profile
                        </Link>
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -12 },
                          show: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href="/orders"
                          onClick={() => setMobileMenu(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                        >
                          <ClipboardList size={18} strokeWidth={1.8} />
                          My Orders
                        </Link>
                      </motion.div>
                    </>
                  )}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href="/wishlist"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                    >
                      <span className="flex items-center gap-3">
                        <Heart size={18} strokeWidth={1.8} />
                        Wishlist
                      </span>
                      {wishlistCount > 0 && isAuthenticated && (
                        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#003B1F] px-1 text-[10px] font-semibold text-white">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>

                  {isAuthenticated ? (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -12 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenu(false);
                          void dispatch(logoutUser());
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut size={18} strokeWidth={1.8} />
                        Logout
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -12 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenu(false);
                          dispatch(openAuthModal("login"));
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                      >
                        <UserRound size={18} strokeWidth={1.8} />
                        Login / Register
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;
