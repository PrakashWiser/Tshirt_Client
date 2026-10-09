"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";

const videos = [
  {
    id: 1,
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    title: "Stay Meen Men's Shirt",
  },
  {
    id: 3,
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    image:
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=600&q=80",
    title: "Toddy Tales Men's Shirt",
  },
  {
    id: 5,
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80",
    title: "Oversized Graphic T-Shirt",
  },
  {
    id: 6,
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    title: "Classic Black T-Shirt",
  },
];

function WatchAndShop() {
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const [playingId, setPlayingId] = useState<number | null>(null);

  const playVideo = async (id: number) => {
    const video = videoRefs.current[id];

    if (!video) return;

    try {
      await video.play();
      setPlayingId(id);
    } catch (error) {
      console.error("Video play failed:", error);
    }
  };

  const pauseVideo = (id: number) => {
    const video = videoRefs.current[id];

    if (!video) return;

    video.pause();

    setPlayingId((current) => (current === id ? null : current));
  };

  const toggleVideo = async (id: number) => {
    const video = videoRefs.current[id];

    if (!video) return;

    if (video.paused) {
      await playVideo(id);
    } else {
      pauseVideo(id);
    }
  };

  return (
    <section className="w-full bg-[#fffdf9] py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-center sm:mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#222] sm:text-3xl lg:text-4xl">
            Watch &amp; Shop
          </h2>
        </div>

        <div className="group relative overflow-hidden">
          <button
            type="button"
            aria-label="Previous videos"
            className="watch-prev pointer-events-none absolute left-2 top-[40%] z-20 hidden h-10 w-10 items-center justify-center bg-[#111] text-white opacity-0 transition-all duration-300 hover:bg-[#003B1F] group-hover:pointer-events-auto group-hover:opacity-100 md:flex lg:h-11 lg:w-11"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Next videos"
            className="watch-next pointer-events-none absolute right-2 top-[40%] z-20 hidden h-10 w-10 items-center justify-center bg-[#111] text-white opacity-0 transition-all duration-300 hover:bg-[#003B1F] group-hover:pointer-events-auto group-hover:opacity-100 md:flex lg:h-11 lg:w-11"
          >
            <ChevronRight size={20} />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".watch-prev",
              nextEl: ".watch-next",
            }}
            spaceBetween={10}
            slidesPerView={1.35}
            breakpoints={{
              480: {
                slidesPerView: 1.8,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 2,
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
            {videos.map((item) => (
              <SwiperSlide key={item.id} className="!h-auto">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div
                    className="group/video relative aspect-[9/12] w-full cursor-pointer overflow-hidden bg-black"
                    onMouseEnter={() => playVideo(item.id)}
                    onMouseLeave={() => pauseVideo(item.id)}
                    onClick={() => toggleVideo(item.id)}
                  >
                    <video
                      ref={(element) => {
                        videoRefs.current[item.id] = element;
                      }}
                      src={item.video}
                      poster={item.image}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />

                    <div
                      className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        playingId === item.id
                          ? "opacity-0"
                          : "opacity-100"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm sm:h-12 sm:w-12">
                        <Play
                          size={18}
                          fill="currentColor"
                          className="ml-0.5 sm:h-[22px] sm:w-[22px]"
                        />
                      </div>
                    </div>

                    <div
                      className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        playingId === item.id
                          ? "opacity-0 group-hover/video:opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm sm:h-12 sm:w-12">
                        <Pause
                          size={18}
                          fill="currentColor"
                          className="sm:h-[22px] sm:w-[22px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-14 sm:w-14">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <h3 className="line-clamp-1 text-xs font-semibold text-[#292929] sm:text-sm lg:text-base">
                      {item.title}
                    </h3>
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

export default WatchAndShop;