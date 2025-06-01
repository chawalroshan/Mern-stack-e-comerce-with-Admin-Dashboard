import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules'; // ✅ You missed this line

import 'swiper/css'; // ✅ Required base Swiper styles
import 'swiper/css/navigation'; // ✅ Required styles for navigation buttons
import ProductItem from '../ProductItem/Productitem';


const ProductSlider = (props) => {
  return (
    <div className='productSlider py-3 '>
        <Swiper
                spaceBetween={props.items}
              navigation={true}
              modules={[Navigation, Autoplay]} // ✅ Attach the module
              autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
              className="mySwiper"
            >
              <SwiperSlide className='max-w-[300px] mx-auto'>
                <ProductItem />
              </SwiperSlide>
              <SwiperSlide className='max-w-[300px] mx-auto'>
                <ProductItem />
              </SwiperSlide >
              <SwiperSlide className='max-w-[300px] mx-auto'>
                <ProductItem />
              </SwiperSlide>
              <SwiperSlide className='max-w-[300px] mx-auto'>
                <ProductItem />
              </SwiperSlide>
              <SwiperSlide className='max-w-[300px] mx-auto'>
                <ProductItem />
              </SwiperSlide >
              <SwiperSlide className='max-w-[300px] mx-auto'>
                <ProductItem />
              </SwiperSlide>
              <SwiperSlide className='max-w-[300px] mx-auto'>
                <ProductItem />
              </SwiperSlide>
              <SwiperSlide className='max-w-[300px] mx-auto'>
                <ProductItem />
              </SwiperSlide>
            </Swiper>
       
      
    </div>
  )
}

export default ProductSlider
