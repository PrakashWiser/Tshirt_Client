"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import type { AppDispatch, RootState } from "../../../store/store";
import { fetchParentCategories } from "../../../store/slice/parentCategorySlice";
import CustomImage from "@/app/common/CustomImage";

import "swiper/css";
import "swiper/css/navigation";

function CategorySlider() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: categories,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.parentCategories);

  useEffect(() => {
    void dispatch(fetchParentCategories());
  }, [dispatch]);

  return (
    <section className="w-full bg-[#fffdf9] py-8 sm:py-12 lg:py-15">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          {isLoading && categories.length === 0 && (
            <div
              aria-label="Loading categories"
              className="grid grid-cols-2 gap-3 py-2 min-[480px]:grid-cols-3 sm:grid-cols-4 sm:gap-5 md:grid-cols-5 lg:grid-cols-6"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="animate-pulse text-center">
                  <div className="aspect-square w-full rounded-2xl bg-gray-200" />
                  <div className="mx-auto mt-3 h-4 w-3/4 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {error && categories.length === 0 && (
            <p role="alert" className="py-8 text-center text-sm text-red-700">
              Unable to load categories: {error}
            </p>
          )}

          {!isLoading && !error && categories.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-600">
              No categories are available.
            </p>
          )}

          {categories.length > 0 && (
            <>
              <button
                type="button"
                className="category-prev absolute left-2 top-[70px] z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-[#003B1F] text-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#00552D] md:flex lg:top-[80px]"
                aria-label="Previous categories"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                className="category-next absolute right-2 top-[70px] z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-[#003B1F] text-white shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#00552D] md:flex lg:top-[80px]"
                aria-label="Next categories"
              >
                <ChevronRight size={20} />
              </button>

              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: ".category-prev",
                  nextEl: ".category-next",
                }}
                spaceBetween={12}
                slidesPerView={2.4}
                breakpoints={{
                  480: {
                    slidesPerView: 3,
                    spaceBetween: 14,
                  },
                  640: {
                    slidesPerView: 4,
                    spaceBetween: 18,
                  },
                  768: {
                    slidesPerView: 5,
                    spaceBetween: 22,
                  },
                  1024: {
                    slidesPerView: 6,
                    spaceBetween: 24,
                  },
                }}
                className="!overflow-hidden !py-2"
              >
                {categories.map((category) => (
                  <SwiperSlide key={category._id} className="!h-auto">
                    <div className="group flex h-full flex-col cursor-pointer text-center">
                      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#050607] shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:shadow-xl">
                        <CustomImage
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 40vw"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-[#003B1F]/0 transition-all duration-500 group-hover:bg-[#003B1F]/10" />
                      </div>

                      <div className="mt-2 flex items-center justify-center gap-1.5 sm:mt-3">
                        <p className="line-clamp-1 text-[11px] font-medium text-gray-900 transition-colors duration-300 group-hover:text-[#003B1F] sm:text-sm lg:text-[15px]">
                          {category.name}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CategorySlider;
