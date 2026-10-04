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
  {
    label: "Shop",
    href: "/products",
    dropdown: true,
  },
  {
    label: "Men",
    href: "/men",
    dropdown: true,
  },
  {
    label: "Kids",
    href: "/kids",
    dropdown: true,
  },
  {
    label: "T-Shirts",
    href: "/products",
  },
  {
    label: "New Arrivals",
    href: "/products?sort=newest",
  },
  {
    label: "Best Sellers",
    href: "/products?sort=popular",
  },
];

function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto max-w-7xl px-2   sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center">
            <Link
              href="/products"
              className="hidden items-center gap-2 text-gray-800 sm:flex"
            >
              <Search size={23} strokeWidth={1.8} />

              <span className="text-sm font-medium">Search our store</span>
            </Link>
          </div>

          <Link
            href="/"
            aria-label="SDN Shop home"
            className="absolute left-0 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2"
          >
            <Image
              src="/images/logo.png"
              alt="SDN Shop"
              width={130}
              height={60}
              priority
              className="h-auto w-[105px] object-contain sm:w-[100px]"
            />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-4 sm:gap-5">
            <Link
              href="/account"
              aria-label="Account"
              className="transition-colors hover:text-[#003B1F]"
            >
              <UserRound size={23} strokeWidth={1.8} />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden transition-colors hover:text-[#003B1F] sm:block"
            >
              <Heart size={23} strokeWidth={1.8} />
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative transition-colors hover:text-[#003B1F]"
            >
              <ShoppingBag size={23} strokeWidth={1.8} />

              <span className="absolute -right-2.5 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#003B1F] px-1 text-[10px] font-semibold text-white">
                0
              </span>
            </Link>

            <button
              type="button"
              aria-label={
                mobileMenu ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu((value) => !value)}
              className="ml-1 md:hidden"
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

      <div className="hidden border-y border-gray-100 md:block">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-8 px-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="group flex items-center gap-1 text-sm font-medium text-gray-800 transition-colors duration-200 hover:text-[#003B1F]"
            >
              {item.label}

              {item.dropdown && (
                <ChevronDown
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:rotate-180"
                />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {mobileMenu && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-4 py-4"
          >
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
              >
                <Search size={19} strokeWidth={1.8} />
                Search our store
              </Link>

              {navItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-[#E8F1EC] hover:text-[#003B1F]"
                >
                  <span>{item.label}</span>

                  {item.dropdown && <ChevronDown size={16} strokeWidth={1.8} />}
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
