"use client";

import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CustomImage from "@/app/common/CustomImage";

import "swiper/css";
import "swiper/css/navigation";

const products = [
  {
    id: 1,
    title: "Life Time Settlement | Thalapathy & Thala T-Shirt",
    price: 599,
    oldPrice: 750,
    discount: "-20%",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=90",
    img2: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=90",
  },
  {
    id: 2,
    title: "Scene of The One T-Shirt",
    price: 599,
    oldPrice: 750,
    discount: "-20%",
    img: "https://images.unsplash.com/photo-1583743814966-8936f37f2096?w=800&q=90",
    img2: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=90",
  },
  {
    id: 3,
    title: "MP3 King T-Shirt",
    price: 599,
    oldPrice: 750,
    discount: "-20%",
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=90",
    img2: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=90",
  },
  {
    id: 4,
    title: "Absolute Mysore Pak T-Shirt",
    price: 599,
    oldPrice: 750,
    discount: "-20%",
    img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=90",
    img2: "",
  },
  {
    id: 5,
    title: "Classic Oversized Black T-Shirt",
    price: 649,
    oldPrice: 799,
    discount: "-19%",
    img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=90",
    img2: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=90",
  },
  {
    id: 6,
    title: "Premium White Graphic T-Shirt",
    price: 549,
    oldPrice: 699,
    discount: "-21%",
    img: "https://images.unsplash.com/photo-1583743814966-8936f37f2096?w=800&q=90",
    img2: "",
  },
];

function TrendingNow() {
  return (
    <section className="w-full bg-[#fffdf9] py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-center sm:mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#222] sm:text-3xl lg:text-4xl">
            Trending Now
          </h2>
        </div>

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
            {products.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <div className="group flex h-full flex-col overflow-hidden bg-white">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f3f3f3]">
                    <CustomImage
                      src={product.img}
                      alt={product.title}
                      fill
                      sizes="(max-width: 480px) 60vw, (max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
                      className={`object-cover transition-all duration-700 ease-out ${
                        product.img2
                          ? "group-hover:scale-105 group-hover:opacity-0"
                          : "group-hover:scale-110"
                      }`}
                    />

                    {product.img2 && (
                      <CustomImage
                        src={product.img2}
                        alt={`${product.title} alternate view`}
                        fill
                        sizes="(max-width: 480px) 60vw, (max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                      />
                    )}

                    <span className="absolute right-2 top-2 z-10 rounded-full bg-[#ffbf00] px-2 py-0.5 text-[10px] font-bold text-white sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
                      {product.discount}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-2 pb-4 pt-3 text-center sm:px-4 sm:pb-5 sm:pt-4">
                    <h3 className="line-clamp-2 min-h-[36px] text-xs font-semibold leading-4 text-[#292929] sm:min-h-[48px] sm:text-base sm:leading-6 lg:text-lg">
                      {product.title}
                    </h3>

                    <div className="mt-1.5 flex items-center justify-center gap-1.5 whitespace-nowrap sm:mt-2 sm:gap-2">
                      <span className="text-[11px] font-medium text-gray-500 line-through sm:text-sm lg:text-base">
                        Rs {product.oldPrice}.00
                      </span>

                      <span className="text-sm font-bold text-[#e62f2f] sm:text-lg lg:text-xl">
                        Rs {product.price}.00
                      </span>
                    </div>

                    <div className="mt-auto pt-3 sm:pt-5">
                      <div className="mx-auto h-px w-full bg-gray-200" />

                      <button
                        type="button"
                        className="mt-2.5 flex w-full items-center justify-center gap-1.5 text-[11px] font-semibold text-[#222] transition-colors duration-300 hover:text-[#003B1F] sm:mt-4 sm:gap-2 sm:text-sm lg:text-base"
                      >
                        <ShoppingCart size={16} strokeWidth={1.8} className="sm:hidden" />
                        <ShoppingCart size={20} strokeWidth={1.8} className="hidden sm:block" />
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default TrendingNow;