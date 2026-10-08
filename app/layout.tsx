import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/app/provider/ReduxProvider";
import ProtectedRoute from "./protectRoute/ProtectRoute";
import AuthBootstrap from "./common/AuthBootstrap";
import ConditionalHeader from "./common/ConditionalHeader";
import Footer from "./components/Common/Footer/Footer";
import WhatsAppButton from "./common/WhatsAppButton";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),

  title: {
    default: "T-shirts for Men & Kids | SND Shop",
    template: "%s | SND Shop",
  },

  description:
    "Shop trendy and comfortable T-shirts for men and children. Discover quality fabrics, stylish designs, and affordable everyday fashion.",

  keywords: [
    "T-shirts",
    "men T-shirts",
    "kids T-shirts",
    "children T-shirts",
    "boys T-shirts",
    "girls T-shirts",
    "cotton T-shirts",
    "oversized T-shirts",
    "trendy T-shirts",
    "online T-shirt shopping",
  ],

  authors: [{ name: "SND Shop" }],
  creator: "SND Shop",
  publisher: "SND Shop",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "SND Shop",
    title: "T-shirts for Men & Kids | SND Shop",
    description:
      "Shop trendy and comfortable T-shirts for men and children. Discover quality fabrics, stylish designs, and affordable everyday fashion.",
    images: [
      {
        url: "/images/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "T-shirts for Men and Kids from SND Shop",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "T-shirts for Men & Kids | SND Shop",
    description: "Shop trendy and comfortable T-shirts for men and children.",
    images: ["/images/og-image.jpeg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body suppressHydrationWarning>
        <ReduxProvider>
          <AuthBootstrap />
          <ConditionalHeader />
          <ProtectedRoute>{children}</ProtectedRoute>
          <Footer />
          <WhatsAppButton />
        </ReduxProvider>
      </body>
    </html>
  );
}
