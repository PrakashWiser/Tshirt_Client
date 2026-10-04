"use client";

import { useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CustomImage from "@/app/common/CustomImage";

import "swiper/css";
import "swiper/css/navigation";
import { RootState } from "@/app/store/rootReducer";
import { fetchTrendingProducts } from "@/app/store/slice/productSlice";
import { AppDispatch } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";

function TrendingNow() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    items: products,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchTrendingProducts());
  }, [dispatch]);

  return (
    <section className="w-full bg-[#fffdf9] py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-center sm:mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#222] sm:text-3xl lg:text-4xl">
            The Styles Everyone Is Talking About.{" "}
          </h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-white">
                <div className="aspect-[4/5] w-full bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-full rounded bg-gray-200" />
                  <div className="mx-auto h-5 w-1/2 rounded bg-gray-200" />
                  <div className="h-px w-full bg-gray-200" />
                  <div className="mx-auto h-5 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="py-10 text-center text-sm text-red-500">{error}</div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No trending products available.
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="product-slider relative overflow-hidden">
            <button
              type="button"
              aria-label="Previous products"
              className="trending-prev slider-nav absolute left-2 top-[35%] z-20 hidden h-10 w-10 items-center justify-center bg-[#111] text-white transition-colors duration-300 hover:bg-[#003B1F] md:flex lg:h-11 lg:w-11"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              aria-label="Next products"
              className="trending-next slider-nav absolute right-2 top-[35%] z-20 hidden h-10 w-10 items-center justify-center bg-[#111] text-white transition-colors duration-300 hover:bg-[#003B1F] md:flex lg:h-11 lg:w-11"
            >
              <ChevronRight size={20} />
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".trending-prev",
                nextEl: ".trending-next",
              }}
              spaceBetween={12}
              slidesPerView={1.6}
              breakpoints={{
                480: {
                  slidesPerView: 1.8,
                  spaceBetween: 14,
                },
                640: {
                  slidesPerView: 2.2,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="!overflow-hidden"
            >
              {products.map((product) => {
                const activeVariant = product.variants.find(
                  (variant) => variant.isActive && variant.stock > 0,
                );

                if (!activeVariant) {
                  return null;
                }

                const price = activeVariant.price;
                const salePrice = activeVariant.salePrice;

                const discount =
                  price > salePrice
                    ? Math.round(((price - salePrice) / price) * 100)
                    : 0;

                const image1 = activeVariant.images?.[0];
                const image2 = activeVariant.images?.[1];

                return (
                  <SwiperSlide key={product._id} className="!h-auto">
                    <div className="group flex h-full flex-col overflow-hidden bg-white">
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f3f3f3]">
                        {image1 ? (
                          <CustomImage
                            src={image1}
                            alt={product.name}
                            fill
                            sizes="(max-width: 480px) 60vw, (max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
                            className={`object-cover transition-all duration-700 ease-out ${
                              image2
                                ? "group-hover:scale-105 group-hover:opacity-0"
                                : "group-hover:scale-110"
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
                            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                          />
                        )}

                        {discount > 0 && (
                          <span className="absolute right-2 top-2 z-10 rounded-full bg-[#ffbf00] px-2 py-0.5 text-[10px] font-bold text-white sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col px-2 pb-4 pt-3 text-center sm:px-4 sm:pb-5 sm:pt-4">
                        <h3 className="line-clamp-2  text-xs font-semibold leading-4 text-[#292929] sm:text-base sm:leading-6 lg:text-lg">
                          {product.name}
                        </h3>

                        <div className="mt-1.5 flex items-center justify-center gap-1.5 whitespace-nowrap sm:mt-2 sm:gap-2">
                          {price > salePrice && (
                            <span className="text-[11px] font-medium text-gray-500 line-through sm:text-sm lg:text-base">
                              Rs {price}.00
                            </span>
                          )}

                          <span className="text-sm font-bold text-[#e62f2f] sm:text-lg lg:text-xl">
                            Rs {salePrice}.00
                          </span>
                        </div>

                        <div className="mt-auto pt-3">
                          <div className="mx-auto h-px w-full bg-gray-200" />

                          <button
                            type="button"
                            className="mt-2.5 flex w-full items-center justify-center gap-1.5 text-[11px] font-semibold text-[#222] transition-colors duration-300 hover:text-[#003B1F] sm:mt-4 sm:gap-2 sm:text-sm lg:text-base"
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
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}

export default TrendingNow;
