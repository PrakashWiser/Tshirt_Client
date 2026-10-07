"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Top Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Left - Logo */}
          <Link
            href="/"
            aria-label="SDN Shop home"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/images/logo.png"
              alt="SDN Shop"
              width={130}
              height={60}
              priority
              className="h-auto w-[100px] object-contain sm:w-[110px]"
            />
          </Link>

          {/* Center - Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden flex-1 items-center justify-center gap-5 lg:flex"
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

          {/* Right - Search + Actions */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            {/* Search */}
            <Link
              href="/products"
              aria-label="Search"
              className="flex items-center gap-2 text-gray-800 transition-colors hover:text-[#003B1F]"
            >
              <Search size={22} strokeWidth={1.8} />
              <span className="hidden text-sm font-medium whitespace-nowrap lg:inline">
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
              <span className="absolute -right-2.5 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#003B1F] px-1 text-[10px] font-semibold text-white">
                0
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              aria-label={
                mobileMenu ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu((value) => !value)}
              className="ml-1 text-gray-800 md:hidden"
            >
              {mobileMenu ? (
                <X size={24} strokeWidth={1.8} />
              ) : (
                <Menu size={24} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-4 py-4"
          >
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                >
                  <span>{item.label}</span>
                  {item.dropdown && (
                    <ChevronDown size={16} strokeWidth={1.8} />
                  )}
                </Link>
              ))}

              <Link
                href="/wishlist"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
              >
                <Heart size={18} strokeWidth={1.8} />
                Wishlist
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;