import React from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

const HomeCatSlider = () => {
  return (
    <div className='homeCatSlider pt-4 py-8'>
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
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col '>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Fashion</h3>
            </div>
            </Link>
        </SwiperSlide>

         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://serviceapi.spicezgold.com/download/1741660988059_ele.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Electronics</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col '>
                <img src='https://serviceapi.spicezgold.com/download/1741661045887_bag.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Bags</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://serviceapi.spicezgold.com/download/1741661061379_foot.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Footwear</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://serviceapi.spicezgold.com/download/1741661077633_gro.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Groceries</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://serviceapi.spicezgold.com/download/1741661092792_beauty.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Beauty</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://serviceapi.spicezgold.com/download/1741661105893_well.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Wellness</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://serviceapi.spicezgold.com/download/1741661120743_jw.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Jwellery</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>
         <SwiperSlide>
            <Link to='/'>
            <div className='item p-7 px-3 bg-white rounded-sm text-center items-center justify-center flex-col'>
                <img src='https://api.spicezgold.com/download/file_1734525204708_fash.png' alt='' className='w-[60px] transition-all'/>
                <h3 className='link text-[15px] font-[500] mt-3'> Smart Tablet</h3>
            </div>
            </Link>
        </SwiperSlide>

        
        
      </Swiper>
         </div>
    </div>
  )
}

export default HomeCatSlider
