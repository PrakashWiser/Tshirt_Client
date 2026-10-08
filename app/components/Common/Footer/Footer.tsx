import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "Men's T-Shirts", href: "/collections/mens-tshirts" },
  { label: "Oversized Tees", href: "/collections/oversized" },
  { label: "Women's Shirts", href: "/collections/womens-shirts" },
  { label: "Graphic Tees", href: "/collections/graphic" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
];

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Collection", href: "/collections" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

function Footer() {
  return (
    <footer className="bg-[#003B1F] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-2 gap-8 text-left sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 text-left sm:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="SND Shop"
                width={130}
                height={60}
                priority
                className="-ml-6 block h-auto w-[105px] object-contain object-left sm:w-[110px]"
              />
            </Link>

            <p className="mt-3 max-w-xs text-left text-sm leading-6 text-white/70">
              Bold prints, everyday comfort. Made for the ones who wear their
              vibe loud.
            </p>
          </div>

          <div className="col-span-1 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.slice(0, 5).map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.slice(3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 text-left sm:col-span-3 lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href="mailto:support@sdnshop.com"
                  className="transition-colors duration-200 hover:text-white"
                >
                  support@sdnshop.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="transition-colors duration-200 hover:text-white"
                >
                  +91 98765 43210
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} SND Shop. All rights reserved.
          </p>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            <Link className="transition-colors hover:text-white" href="/">
              Home
            </Link>
            <Link className="transition-colors hover:text-white" href="/about">
              About
            </Link>
            <Link
              className="transition-colors hover:text-white"
              href="/privacy-policy"
            >
              Privacy
            </Link>
            <Link className="transition-colors hover:text-white" href="/terms">
              Terms
            </Link>
            <Link
              className="transition-colors hover:text-white"
              href="/sitemap"
            >
              Sitemap
            </Link>
            <Link
              className="transition-colors hover:text-white"
              href="/contact"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
