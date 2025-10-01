import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";
import banner5 from "../assets/banner5.png";

const banners = [banner1, banner2, banner3, banner4, banner5];

const BannerCarousel = () => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
        }}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        className="w-full"
      >
        {banners.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="w-full max-h-[350px] h-[200px] sm:h-[300px] md:h-[500px] lg:h-[500px] flex items-center justify-center bg-black rounded-xl overflow-hidden mt-0">
              <img
                src={img}
                alt={`Banner ${index + 1}`}
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCarousel;
