import React from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Autoplay } from 'swiper/modules';

const HomeCatSlider = () => {
  const categories = [
    {
      id: 1,
      name: 'Fashion',
      image: 'https://api.spicezgold.com/download/file_1734525204708_fash.png',
      link: '/category/fashion',
    },
    {
      id: 2,
      name: 'Electronics',
      image: 'https://serviceapi.spicezgold.com/download/1741660988059_ele.png',
      link: '/category/electronics',
    },
    {
      id: 3,
      name: 'Bags',
      image: 'https://serviceapi.spicezgold.com/download/1741661045887_bag.png',
      link: '/category/bags',
    },
    {
      id: 4,
      name: 'Footwear',
      image: 'https://serviceapi.spicezgold.com/download/1741661061379_foot.png',
      link: '/category/footwear',
    },
    {
      id: 5,
      name: 'Groceries',
      image: 'https://serviceapi.spicezgold.com/download/1741661077633_gro.png',
      link: '/category/groceries',
    },
    {
      id: 6,
      name: 'Beauty',
      image: 'https://serviceapi.spicezgold.com/download/1741661092792_beauty.png',
      link: '/category/beauty',
    },
    {
      id: 7,
      name: 'Wellness',
      image: 'https://serviceapi.spicezgold.com/download/1741661105893_well.png',
      link: '/category/wellness',
    },
    {
      id: 8,
      name: 'Jewellery',
      image: 'https://serviceapi.spicezgold.com/download/1741661120743_jw.png',
      link: '/category/jewellery',
    },
  ];

  return (
    <div className='homeCatSlider py-6 md:py-8 bg-gray-50'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center mb-6 md:mb-8'>
          <h2 className='text-xl md:text-2xl font-bold text-gray-800 mb-1'>
            Shop by Category
          </h2>
          <p className='text-gray-600 text-sm'>
            Browse our wide range of categories
          </p>
        </div>

        <Swiper
          slidesPerView={2}
          spaceBetween={12}
          navigation={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 12
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 15
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 16
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 18
            },
            1280: {
              slidesPerView: 7,
              spaceBetween: 20
            }
          }}
          className="homeCatSwiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link 
                to={category.link} 
                className='block group'
              >
                <div className='
                  bg-white 
                  rounded-lg 
                  overflow-hidden 
                  shadow-sm 
                  hover:shadow-lg 
                  transition-all 
                  duration-300 
                  border 
                  border-gray-200
                  hover:border-primary/30
                  h-full
                  flex 
                  flex-col 
                  items-center 
                  justify-center
                  p-4
                  md:p-5
                '>
                  {/* Icon Container */}
                  <div className='
                    w-14 
                    h-14 
                    md:w-16 
                    md:h-16 
                    mb-3 
                    md:mb-4
                    rounded-lg
                    bg-gray-50
                    p-2
                    flex 
                    items-center 
                    justify-center
                    group-hover:scale-110
                    transition-transform
                    duration-300
                  '>
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className='
                        w-10 
                        h-10 
                        md:w-12 
                        md:h-12 
                        object-contain
                      '
                    />
                  </div>

                  {/* Category Name */}
                  <h3 className='
                    text-center 
                    text-sm 
                    md:text-base 
                    font-medium 
                    text-gray-800
                    group-hover:text-primary
                    transition-colors
                    duration-300
                  '>
                    {category.name}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All Categories Button */}
        <div className='text-center mt-6 md:mt-8'>
          <Link 
            to="/categories" 
            className='
              inline-flex 
              items-center 
              gap-1 
              bg-primary 
              text-white 
              hover:bg-primary-dark 
              transition-colors 
              duration-300 
              px-5 
              py-2.5 
              rounded-md 
              font-medium
              shadow-md
              hover:shadow-lg
              text-sm
            '
          >
            <span>View All Categories</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeCatSlider