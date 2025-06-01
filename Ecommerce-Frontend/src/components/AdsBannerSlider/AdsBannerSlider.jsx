import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Navigation } from 'swiper/modules';
import BannerBox from '../BannerBox/BannerBox';

const AdsBannerSlider = (props) => {
    return (
        <>
            <Swiper
                slidesPerView={props.items}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="smlBtn"
            >
                <SwiperSlide>
                    <BannerBox img={'https://api.spicezgold.com/download/file_1734525620831_NewProject(3).jpg'} link={'/'}/>
                </SwiperSlide>
                <SwiperSlide>
                    <BannerBox img={'https://api.spicezgold.com/download/file_1734525634299_NewProject(2).jpg'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'https://api.spicezgold.com/download/file_1734525653108_NewProject(20).jpg'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'https://api.spicezgold.com/download/file_1734532742018_NewProject(22).jpg'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'https://api.spicezgold.com/download/file_1734525620831_NewProject(3).jpg'} />
                </SwiperSlide>

                <SwiperSlide>
                    <BannerBox img={'https://api.spicezgold.com/download/file_1734525620831_NewProject(3).jpg'} />
                </SwiperSlide>


            </Swiper>
        </>
    )
}

export default AdsBannerSlider
