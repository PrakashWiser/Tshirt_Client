"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomImage from "@/app/common/CustomImage";
import type { Product, ProductVariant } from "@/app/store/slice/productSlice";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (payload: {
    productId: string;
    size: string;
    color: string;
    quantity: number;
  }) => Promise<unknown> | unknown;
  className?: string;
}

type ButtonState = "idle" | "loading" | "success";

function ProductCard({
  product,
  onAddToCart,
  className = "",
}: ProductCardProps) {
  const [buttonState, setButtonState] = useState<ButtonState>("idle");

  useEffect(() => {
    return () => {
      setButtonState("idle");
    };
  }, []);

  const activeVariant = product.variants?.find(
    (variant: ProductVariant) => variant.isActive && variant.stock > 0,
  );

  if (!activeVariant) return null;

  const price = activeVariant.price;

  const salePrice =
    activeVariant.salePrice > 0 ? activeVariant.salePrice : activeVariant.price;

  const discount =
    price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  const image1 = activeVariant.images?.[0];
  const image2 = activeVariant.images?.[1];

  const productUrl = `/products/${product.slug}`;

  const handleAddToCart = async () => {
    if (buttonState !== "idle") return;
    if (!onAddToCart) return;

    setButtonState("loading");

    try {
      await onAddToCart({
        productId: product._id,
        size: activeVariant.size,
        color: activeVariant.color,
        quantity: 1,
      });

      setButtonState("success");

      window.setTimeout(() => {
        setButtonState("idle");
      }, 1600);
    } catch {
      setButtonState("idle");
    }
  };

  return (
    <div
      className={`group/card flex h-full flex-col overflow-hidden bg-white ${className}`}
    >
      <Link
        href={productUrl}
        className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden bg-[#f3f3f3]"
        aria-label={`View ${product.name}`}
      >
        {image1 ? (
          <CustomImage
            src={image1}
            alt={product.name}
            fill
            sizes="(max-width: 480px) 60vw, (max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-700 ease-out ${
              image2
                ? "group-hover/card:scale-105 group-hover/card:opacity-0"
                : "group-hover/card:scale-110"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}

        {image2 && (
          <CustomImage
            src={image2}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 480px) 60vw, (max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover/card:scale-105 group-hover/card:opacity-100"
          />
        )}

        {discount > 0 && (
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className="absolute right-2 top-2 z-10 rounded-full bg-[#ffbf00] px-2 py-0.5 text-[10px] font-bold text-white sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs"
          >
            -{discount}%
          </motion.span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-4 pt-3 text-center sm:px-4 sm:pb-5 sm:pt-4">
        <Link href={productUrl} className="block cursor-pointer">
          <h2 className="line-clamp-2 text-xs font-semibold leading-4 text-[#292929] transition-colors hover:text-[#003B1F] sm:text-base sm:leading-6 lg:text-lg">
            {product.name}
          </h2>

          <div className="mt-1.5 flex items-center justify-center gap-1.5 whitespace-nowrap sm:mt-2 sm:gap-2">
            {price > salePrice && (
              <span className="text-[11px] font-medium text-gray-500 line-through sm:text-sm lg:text-base">
                Rs {price.toLocaleString()}.00
              </span>
            )}

            <span className="text-sm font-bold text-[#e62f2f] sm:text-lg lg:text-xl">
              Rs {salePrice.toLocaleString()}.00
            </span>
          </div>
        </Link>

        <div className="mt-auto pt-3">
          <div className="mx-auto h-px w-full bg-gray-200" />

          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={buttonState !== "idle" || !onAddToCart}
            whileHover={buttonState === "idle" ? { scale: 1.02 } : undefined}
            whileTap={buttonState === "idle" ? { scale: 0.95 } : undefined}
            animate={
              buttonState === "success"
                ? {
                    backgroundColor: "#003B1F",
                    color: "#ffffff",
                  }
                : {
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    color: "#222222",
                  }
            }
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="relative mt-2.5 flex w-full cursor-pointer items-center justify-center gap-1.5 overflow-hidden text-[11px] font-semibold transition-colors duration-300 hover:text-[#003B1F] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-4 sm:gap-2 sm:text-sm lg:text-base"
          >
            <AnimatePresence mode="wait" initial={false}>
              {buttonState === "idle" && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <ShoppingCart
                    size={16}
                    strokeWidth={1.8}
                    className="sm:hidden"
                  />
                  <ShoppingCart
                    size={20}
                    strokeWidth={1.8}
                    className="hidden sm:block"
                  />
                  ADD TO CART
                </motion.span>
              )}

              {buttonState === "loading" && (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                  />
                  ADDING...
                </motion.span>
              )}

              {buttonState === "success" && (
                <motion.span
                  key="success"
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.6,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <Check size={18} strokeWidth={2.5} />
                  ADDED!
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
