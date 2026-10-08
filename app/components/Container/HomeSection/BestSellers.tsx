"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { RootState } from "@/app/store/rootReducer";
import { fetchBestSellerProducts } from "@/app/store/slice/productSlice";
import { AppDispatch } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import ProductCard from "@/app/common/ProductCard";
import { useCart } from "@/app/utils/useCart";

function BestSellers() {
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart } = useCart();
  const {
    bestSellerItems: products,
    isBestSellerLoading,
    bestSellerError,
  } = useSelector((state: RootState) => state.products);

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    dispatch(fetchBestSellerProducts());
  }, [dispatch]);

  const updateNavigation = (instance: SwiperType) => {
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  };

  return (
    <section className="w-full bg-[#fffdf9] py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-center sm:mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#222] sm:text-3xl lg:text-4xl">
            All Time Best Sellers
          </h2>
        </div>

        {isBestSellerLoading && (
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

        {!isBestSellerLoading && bestSellerError && (
          <div className="py-10 text-center text-sm text-red-500">
            {bestSellerError}
          </div>
        )}

        {!isBestSellerLoading && !bestSellerError && products.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No best seller products available.
          </div>
        )}

        {!isBestSellerLoading && !bestSellerError && products.length > 0 && (
          <div className="group relative overflow-hidden">
            {!isBeginning && (
              <button
                type="button"
                aria-label="Previous products"
                onClick={() => swiper?.slidePrev()}
                className="absolute left-2 top-[35%] z-20 hidden h-10 w-10 items-center justify-center bg-[#111] text-white opacity-0 transition-all duration-300 hover:bg-[#003B1F] group-hover:opacity-100 md:flex lg:h-11 lg:w-11"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {!isEnd && (
              <button
                type="button"
                aria-label="Next products"
                onClick={() => swiper?.slideNext()}
                className="absolute right-2 top-[35%] z-20 hidden h-10 w-10 items-center justify-center bg-[#111] text-white opacity-0 transition-all duration-300 hover:bg-[#003B1F] group-hover:opacity-100 md:flex lg:h-11 lg:w-11"
              >
                <ChevronRight size={20} />
              </button>
            )}

            <Swiper
              onSwiper={(instance) => {
                setSwiper(instance);
                updateNavigation(instance);
              }}
              onSlideChange={updateNavigation}
              onResize={updateNavigation}
              spaceBetween={12}
              slidesPerView={1.6}
              breakpoints={{
                480: { slidesPerView: 1.8, spaceBetween: 14 },
                640: { slidesPerView: 2.2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="!overflow-hidden"
            >
              {products.map((product) => (
                <SwiperSlide key={product._id} className="!h-auto">
                  <ProductCard product={product} onAddToCart={addToCart} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}

export default BestSellers;
