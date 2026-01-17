import React, { useContext, useState } from 'react';
import HomeSlider from '../../components/HomeSlider/HomeSlider';
import HomeCatSlider from '../../components/HomeCatSlider/HomeCatslider';
import { LiaShippingFastSolid } from "react-icons/lia";
import AdsBannerSlider from '../../components/AdsBannerSlider/AdsBannerSlider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import BlogItem from '../../components/BlogItem/BlogItem';
import PersonalizedRecommendations from '../../components/recommendeation/PersonalizedRecommendations';
import { MyContext } from '../../App';

const Home = () => {
  const [value, setValue] = useState(0);
  const context = useContext(MyContext);
  const userData = context?.userData || {};

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Get statistics for display
  const totalProducts = context.products?.length || 0;
  const featuredProducts = context.featuredProducts?.length || 0;

  return (
    <>
      <HomeSlider />

      <HomeCatSlider />

      {/* Popular Products Section */}
      <section className="bg-white py-8">
        <div className="container">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="leftSec">
              <h3 className="text-[24px] font-[600] mb-1">Popular Products</h3>
              <p className="text-[14px] font-[400] text-gray-600">
                Showing {totalProducts} amazing products ({featuredProducts} featured)
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
                  aria-label="product categories"
                >
                  <Tab label="All Products" />
                  <Tab label="Featured" />
                  <Tab label="New Arrivals" />
                  <Tab label="Best Sellers" />
                  <Tab label="On Sale" />
                </Tabs>
              </Box>
            </div>
          </div>
          
          {/* Show products based on selected tab */}
          {value === 0 && (
            <ProductSlider items={5} autoplay={true} />
          )}
          {value === 1 && (
            <ProductSlider type="featured" items={5} />
          )}
          {value === 2 && (
            <ProductSlider type="latest" items={5} limit={8} />
          )}
          {value === 3 && (
            <ProductSlider items={5} />
          )}
          {value === 4 && (
            <ProductSlider items={5} />
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <PersonalizedRecommendations 
                        userId={userData?._id}
                        title="Recommended For You"
                    />
                </div>
            </section>

      {/* Free Shipping Section */}
      <section className="py-8 bg-[#f5f5f5]">
        <div className="container">
          <div className="freeShipping w-full md:w-[80%] mx-auto py-4 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white flex flex-col md:flex-row items-center justify-between rounded-xl mb-8 shadow-lg">
            <div className="col1 flex items-center gap-4 mb-4 md:mb-0">
              <LiaShippingFastSolid className="text-[40px] md:text-[50px]" />
              <div>
                <span className="text-[18px] md:text-[20px] font-[600] uppercase">Free Shipping</span>
                <p className="text-[12px] mt-1">On orders over Rs.2000</p>
              </div>
            </div>

            <div className="col2 text-center md:text-left mb-4 md:mb-0">
              <p className="mb-0 font-[500] text-[14px] md:text-[16px]">
                Free Delivery Now On Your First Order and over Rs.2000
              </p>
            </div>

            <div className="col3">
              <p className="font-[600] text-[24px] md:text-[30px]">Rs.2000*</p>
            </div>
          </div>

          <AdsBannerSlider items={4} />

          {/* Latest Products Section */}
          <section className='py-8 pt-10 bg-white rounded-lg shadow-sm mt-8'>
            <div className="container">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className='text-[24px] font-[600] mb-1'>Latest Products</h3>
                  <p className="text-gray-600 text-[14px]">Fresh arrivals just for you</p>
                </div>
                <button className="text-primary hover:underline text-[14px] font-[500]">
                  View All →
                </button>
              </div>
              <ProductSlider type="latest" items={5} limit={8} />
            </div>
          </section>

          {/* Featured Products Section */}
          <section className='py-8 pt-10 bg-white rounded-lg shadow-sm mt-8'>
            <div className="container">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className='text-[24px] font-[600] mb-1'>Featured Products</h3>
                  <p className="text-gray-600 text-[14px]">Our top picks for you</p>
                </div>
                <button className="text-primary hover:underline text-[14px] font-[500]">
                  View All →
                </button>
              </div>
              <ProductSlider type="featured" items={5} />
            </div>
          </section>

          {/* Blog Section */}
          <section className='py-8 pt-10 bg-white blogSection rounded-lg shadow-sm mt-8'>
            <div className='container'>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className='text-[24px] font-[600] mb-1'>From Our Blog</h3>
                  <p className="text-gray-600 text-[14px]">Latest news and tips</p>
                </div>
                <button className="text-primary hover:underline text-[14px] font-[500]">
                  View All Posts →
                </button>
              </div>
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                navigation={true}
                modules={[Navigation]}
                breakpoints={{
                  480: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                className="blogSlider"
              >
                <SwiperSlide>
                  <BlogItem 
                    title="Summer Fashion Trends 2024"
                    excerpt="Discover the hottest fashion trends for this summer season"
                    image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=500"
                    date="May 15, 2024"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <BlogItem 
                    title="How to Style Casual Outfits"
                    excerpt="Tips and tricks for perfect casual styling"
                    image="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w-500"
                    date="May 10, 2024"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <BlogItem 
                    title="The Rise of Sustainable Fashion"
                    excerpt="How eco-friendly fashion is changing the industry"
                    image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500"
                    date="May 5, 2024"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <BlogItem 
                    title="Accessorizing Your Look"
                    excerpt="Complete your outfit with perfect accessories"
                    image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500"
                    date="April 28, 2024"
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </section>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-primary text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <h4 className="text-[32px] font-bold">{totalProducts}+</h4>
              <p className="text-sm">Total Products</p>
            </div>
            <div className="text-center">
              <h4 className="text-[32px] font-bold">{featuredProducts}</h4>
              <p className="text-sm">Featured Items</p>
            </div>
            <div className="text-center">
              <h4 className="text-[32px] font-bold">24/7</h4>
              <p className="text-sm">Customer Support</p>
            </div>
            <div className="text-center">
              <h4 className="text-[32px] font-bold">100%</h4>
              <p className="text-sm">Quality Guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;