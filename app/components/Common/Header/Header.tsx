"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Loader2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "@/app/utils/useCart";
import { fetchProducts, type Product } from "@/app/store/slice/productSlice";
import { logoutUser } from "@/app/store/slice/authSlice";
import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";
import AuthModal from "@/app/common/AuthModal";

const navItems = [
  { label: "Shop", href: "/products", dropdown: true },
  { label: "Men", href: "/men", dropdown: true },
  { label: "Kids", href: "/kids", dropdown: true },
  { label: "T-Shirts", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Best Sellers", href: "/products?sort=popular" },
];

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
  const [authOpen, setAuthOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

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

  const safeProducts: Product[] = Array.isArray(products) ? products : [];

  useEffect(() => {
    if (searchOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(id);
    }
    setQuery("");
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    if (searchOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

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
  const results = useMemo(
    () => (showResults ? safeProducts.slice(0, 6) : []),
    [showResults, safeProducts],
  );

  const closeSearch = () => setSearchOpen(false);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

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
              {navItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="group flex items-center gap-1 whitespace-nowrap text-sm font-medium text-gray-800 transition-colors duration-200 hover:text-[#003B1F]"
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      size={13}
                      strokeWidth={1.8}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-4 ">
              <button
                type="button"
                aria-label="Search"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((v) => !v)}
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
                  onClick={() => setAuthOpen(true)}
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
                          My Account
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
                aria-label="Wishlist"
                className="hidden text-gray-800 transition-colors hover:text-[#003B1F] sm:block"
              >
                <Heart size={22} strokeWidth={1.8} />
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
                            const variant = product.variants?.[0];
                            const image =
                              variant?.images?.[0] ?? product.images?.[0] ?? "";
                            const price =
                              typeof variant?.salePrice === "number" &&
                              variant.salePrice > 0
                                ? variant.salePrice
                                : typeof variant?.price === "number"
                                  ? variant.price
                                  : 0;

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
                        {item.dropdown && (
                          <ChevronDown size={16} strokeWidth={1.8} />
                        )}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href="/wishlist"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                    >
                      <Heart size={18} strokeWidth={1.8} />
                      Wishlist
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
                          setAuthOpen(true);
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

      <AuthModal
        isOpen={authOpen}
        initialView="login"
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}

export default Header;
