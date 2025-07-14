import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Button } from '@mui/material';

const HomeSliderV2 = () => {
  return (
    <div className="homeSliderV2 py-4">
      <Swiper
        spaceBetween={30}
        effect={'fade'}
        navigation={true}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Navigation, Pagination,Autoplay]}
        className="w-full"
      >
        <SwiperSlide>
          <div className="item w-full rounded-md overflow-hidden relative">
            <img
              className="w-full h-auto object-cover"
              src="https://serviceapi.spicezgold.com/download/1742439896581_1737036773579_sample-1.jpg"
              alt="Nature 1"
            />
            <div className='info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex items-center flex-col justify-center transition-all duration-700'>
              <h4 className='text-[18px] font-[500] w-full text-left mb-3 relative -right-[100%] opacity-0'>Big Saving Days Sale</h4>
              <h2 className='text-[35px] font-[700] w-full text-left relative -right-[100%] opacity-0'> Buy New trend clothes on Flash Sales</h2>
              <h3 className='flex items-center gap-3 text-[18px] font-[500] w-full text-left mt-3 mb-3 relative -right-[100%] opacity-0'> Starting At Only<span className='text-primary text-[30px] font-[700]'>$59.00</span></h3>
              <div className='w-full'>
              <Button className='btn-org relative -bottom-[100%] opacity-0 btn'>SHOP NOW</Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="item w-full rounded-md overflow-hidden relative">
            <img
              className="w-full h-auto object-cover rounded-md"
              src="https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg"
              alt="Nature 2"
            />
            <div className='info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex items-center flex-col justify-center transition-all duration-700'>
              <h4 className='text-[18px] font-[500] w-full text-left mb-3 relative -right-[100%] opacity-0'>Big Saving Days Sale</h4>
              <h2 className='text-[35px] font-[700] w-full text-left relative -right-[100%] opacity-0'> Buy New trend clothes on Flash Sales</h2>
              <h3 className='flex items-center gap-3 text-[18px] font-[500] w-full text-left mt-3 mb-3 relative -right-[100%] opacity-0'> Starting At Only<span className='text-primary text-[30px] font-[700]'>$59.00</span></h3>
              <div className='w-full'>
              <Button className='btn-org relative -bottom-[100%] opacity-0 btn'>SHOP NOW</Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HomeSliderV2;
