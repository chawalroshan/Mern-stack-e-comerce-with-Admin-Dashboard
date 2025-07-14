import React, { useState } from 'react';
import HomeSlider from '../../components/HomeSlider/HomeSlider';
import HomeCatSlider from '../../components/HomeCatSlider/HomeCatslider';
import { LiaShippingFastSolid } from "react-icons/lia";
import AdsBannerSlider from '../../components/AdsBannerSlider/AdsBannerSlider';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Navigation } from 'swiper/modules';
import BlogItem from '../../components/BlogItem/BlogItem';
import HomeSliderV2 from '../../components/HomeSliderV2/HomeSliderV2';
import BannerBoxV2 from '../../components/BannerBoxV2/BannerBoxV2';

const Home = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <HomeSlider />

      {/* <section className='py-6'>
        <div className="container flex gap-5">
          <div className='part1 w-[70%]'>
            <HomeSliderV2/>
          </div>
          <div className='part2 w-[30%] flex items-center justify-center'>
            <BannerBoxV2 info='left' image={'https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg'} />
            <BannerBoxV2 info='right' image={'https://serviceapi.spicezgold.com/download/1741664496923_1737020250515_New_Project_47.jpg'} />
            <div>
            </div>
          </div>
        </div>
      </section> */}
      <HomeCatSlider />

      {/* Popular Products Section */}
      <section className="bg-white py-8">
        <div className="container">
          <div className="flex items-center justify-between gap-4">
            <div className="leftSec">
              <h3 className="text-[20px] font-[600]">Popular Products</h3>
              <p className="text-[14px] font-[400]">
                Do not miss the current offers until the end of March.
              </p>
            </div>

            <div className="rightSec">
              <Box
                sx={{
                  maxWidth: { xs: 320, sm: 480 },
                  bgcolor: 'background.paper',
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label="Fashion" />
                  <Tab label="Electronics" />
                  <Tab label="Bags" />
                  <Tab label="Footwear" />
                  <Tab label="Groceries" />
                  <Tab label="Beauty" />
                  <Tab label="Wellness" />
                   <Tab label="Jewellery" />
                </Tabs>
              </Box>
            </div>
          </div>
        </div>
      </section>

          <ProductSlider items={5}/>

          {/* Free Shipping Section */}
      <section className="py-16 pt-2 bg-[#f5f5f5]">
        <div className="container">
          <div className="freeShipping w-[80%] py-3 px-4 border border-[red] flex items-center justify-between rounded-md mb-7">
            <div className="col1 flex items-center gap-4">
              <LiaShippingFastSolid className="text-[50px]" />
              <span className="text-[20px] font-[600] uppercase">Free Shipping</span>
            </div>

            <div className="col2">
              <p className="mb-0 font-[500]">
                Free Delivery Now On Your First Order and over $200
              </p>
            </div>

            <p className="font-[600] text-[30px]">- Only $200*</p>
          </div>

          <AdsBannerSlider items={4} />

          <section className='py-4 pt-0 bg-white'>
            <div className="container">
              <h3 className='text-[20px] font-[600] mb-4'>Latest Products</h3>
              <ProductSlider items={5}/>


              <AdsBannerSlider items={3} />
            </div>
          </section>



          <section className='py-4 pt-0 bg-white'>
            <div className="container">
              <h3 className='text-[20px] font-[600] mb-4'>Featured Products</h3>
              <ProductSlider items={5}/>


              <AdsBannerSlider items={2} />
            </div>
          </section>

          <section className='py-4 pt-0 bg-white blogSection'>
            <div className='container'>
              <h3 className='text-[20px] font-[600] mb-4'>From The Blog</h3>
                  <Swiper
                          slidesPerView={4}
                          spaceBetween={30}
                          navigation={true}
                          modules={[Navigation]}
                          className="blogSlider"
                        >
                          <SwiperSlide>
                            <BlogItem />
                          </SwiperSlide>
                          <SwiperSlide>
                            <BlogItem />
                          </SwiperSlide>
                          <SwiperSlide>
                            <BlogItem />
                          </SwiperSlide>
                          <SwiperSlide>
                            <BlogItem />
                          </SwiperSlide>
                          <SwiperSlide>
                            <BlogItem />
                          </SwiperSlide>
                          <SwiperSlide>
                            <BlogItem />
                          </SwiperSlide>
                          <SwiperSlide>
                            <BlogItem />
                          </SwiperSlide>
                          </Swiper>
            </div>
          </section>

          
        </div>
      </section>
    </>
  );
};

export default Home;
