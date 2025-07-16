import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css';
import { IoGiftOutline } from "react-icons/io5";
import { IoStatsChartSharp } from "react-icons/io5";
import { PiChartPieSlice } from "react-icons/pi";
import { BsBank } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";

const DashboardBoxes = () => {
  return (
    <div>
        <Swiper
        slidesPerView={4}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation]}
        className="mySwiper"
      >

        <SwiperSlide>
            <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center justify-center gap-4 ">
                <IoGiftOutline className='text-[40px] text-[#3872fa] '/>

                <div className='info w-[70%]'>
                    <h3>New Orders</h3>
                    <b>1,390</b>

                </div>
                <IoStatsChartSharp className='text-[50px] text-[#3872fa] '/>

            </div>
        </SwiperSlide>

        <SwiperSlide>
            <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center justify-center gap-4 ">
                <PiChartPieSlice className='text-[40px] text-[#33aa8f]'/>

                <div className='info w-[70%]'>
                    <h3>Sales</h3>
                    <b>159,390</b>

                </div>
                <IoStatsChartSharp className='text-[50px] text-[#33aa8f] '/>

            </div>
        </SwiperSlide>


        <SwiperSlide>
            <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center justify-center gap-4 ">
                <BsBank className='text-[40px] text-[#7043a6]'/>

                <div className='info w-[70%]'>
                    <h3>Revenue</h3>
                    <b>1,390</b>

                </div>
                <IoStatsChartSharp className='text-[50px] text-[#7043a6] '/>

            </div>
        </SwiperSlide>


        <SwiperSlide>
            <div className="box bg-white p-5 cursor-pointer hover:bg-[#fafafa] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center justify-center gap-4 ">
                <RiProductHuntLine className='text-[40px] text-[#3872fa] '/>

                <div className='info w-[70%]'>
                    <h3>Total Products</h3>
                    <b>1,390</b>

                </div>
                <IoStatsChartSharp className='text-[50px] text-[#3872fa] '/>

            </div>
        </SwiperSlide>
        

        </Swiper>
      
    </div>
  )
}

export default DashboardBoxes
