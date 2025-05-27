import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Navigation } from 'swiper/modules';

const HomeCatSlider = () => {
  return (
    <div className='homeCatSlider py-4'>
      <div className='container'>
        <Swiper
        slidesPerView={7}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>

         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>

        
        
      </Swiper>
         </div>
    </div>
  )
}

export default HomeCatSlider
