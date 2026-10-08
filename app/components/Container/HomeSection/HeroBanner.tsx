"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { AppDispatch, RootState } from "../../../store/store";
import { fetchActiveBanners } from "../../../store/slice/bannerSlice";

import "swiper/css";
import "swiper/css/pagination";

import CustomImage from "@/app/common/CustomImage";

function HeroBanner() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, isLoading } = useSelector((state: RootState) => state.banners);

  useEffect(() => {
    void dispatch(fetchActiveBanners());
  }, [dispatch]);

  if (isLoading && items?.length === 0) {
    return (
      <section
        aria-label="Featured T-shirts"
        className="h-[360px] w-full animate-pulse bg-gray-200 sm:h-[460px]"
      />
    );
  }

  if (items?.length === 0) {
    return null;
  }

  return (
    <section aria-label="Featured T-shirts" className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={
          items.length > 1
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        loop={items.length > 1}
        pagination={{
          clickable: true,
        }}
        className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/7] md:aspect-[16/6]"
      >
        {items.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="relative h-full w-full overflow-hidden">
              <CustomImage
                src={banner.image}
                alt={banner.title || "T-shirt banner"}
                fill
                sizes="100vw"
                quality={90}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroBanner;
