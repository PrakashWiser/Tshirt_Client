"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useCart } from "@/app/utils/useCart";

const navItems = [
  { label: "Shop", href: "/products", dropdown: true },
  { label: "Men", href: "/men", dropdown: true },
  { label: "Kids", href: "/kids", dropdown: true },
  { label: "T-Shirts", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Best Sellers", href: "/products?sort=popular" },
];

function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo — always left */}
          <Link
            href="/"
            aria-label="SND Shop home"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/images/logo.png"
              alt="SND Shop"
              width={130}
              height={60}
              priority
              className="h-auto w-[100px] object-contain sm:w-[110px]"
            />
          </Link>

          {/* Desktop nav — centered, grows to fill middle */}
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

          {/* Right: icons + hamburger */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            <Link
              href="/products"
              aria-label="Search"
              className="flex items-center gap-2 text-gray-800 transition-colors hover:text-[#003B1F]"
            >
              <Search size={22} strokeWidth={1.8} />
              <span className="hidden whitespace-nowrap text-sm font-medium lg:inline">
                Search
              </span>
            </Link>

            <Link
              href="/account"
              aria-label="Account"
              className="text-gray-800 transition-colors hover:text-[#003B1F]"
            >
              <UserRound size={22} strokeWidth={1.8} />
            </Link>

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

            {/* Hamburger — mobile only */}
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

      {/* Mobile menu */}
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
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;