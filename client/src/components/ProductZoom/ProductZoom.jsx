import React, {useRef, useState} from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

const ProductZoom = ({ product }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  // Get product images or use default
  const productImages = product?.images || [];
  
  // Default placeholder images if no product images
  const defaultImages = [
    'https://demos.codezeel.com/prestashop/PRS21/PRS210502/35-large_default/brown-bear-printed-sweater.jpg',
    'https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg',
    'https://api.spicezgold.com/download/file_1734529297930_fiorra-women-s-teapot-blue-pure-cotton-a-line-kurta-with-sharara-and-dupatta-product-images-rvo9n8udfg-1-202307260626.jpg'
  ];

  // Use product images if available, otherwise use defaults
  const imagesToShow = productImages.length > 0 ? productImages : defaultImages;

  const goto = (index) => {
    setSlideIndex(index);
    if (zoomSliderBig.current && zoomSliderBig.current.swiper) {
      zoomSliderBig.current.swiper.slideTo(index);
    }
    if (zoomSliderSml.current && zoomSliderSml.current.swiper) {
      zoomSliderSml.current.swiper.slideTo(index);
    }
  }

  // Handle image click to change main image
  const handleThumbClick = (index) => {
    goto(index);
  }

  return (
    <div className='flex flex-col md:flex-row gap-3 md:gap-4'>
      {/* Thumbnails - Vertical on desktop, horizontal on mobile */}
      <div className='slider hidden md:block w-full md:w-[12%]'>
        <Swiper
          direction={'vertical'}
          slidesPerView={5}
          spaceBetween={8}
          navigation={true}
          modules={[Navigation]}
          className="zoomProductSliderThumbs h-[400px] md:h-[500px] overflow-hidden"
          ref={zoomSliderSml}
        >
          {imagesToShow.map((image, index) => (
            <SwiperSlide key={index}>
              <div 
                className={`item rounded-md overflow-hidden cursor-pointer group transition-all duration-300 ${slideIndex === index ? 'opacity-100 border-2 border-primary' : 'opacity-50 hover:opacity-80 border border-gray-200'}`} 
                onClick={() => handleThumbClick(index)}
              >
                <div className="relative w-full h-full min-h-[80px]">
                  <img 
                    src={image} 
                    alt={`${product?.name || 'Product'} - View ${index + 1}`}
                    className='w-full h-full object-cover transition-all duration-300 group-hover:scale-105'
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile Thumbnails - Horizontal */}
      <div className='slider block md:hidden w-full order-2 mt-3'>
        <Swiper
          direction={'horizontal'}
          slidesPerView={4}
          spaceBetween={8}
          navigation={false}
          modules={[Navigation]}
          className="zoomProductSliderThumbsMobile h-auto"
        >
          {imagesToShow.map((image, index) => (
            <SwiperSlide key={index}>
              <div 
                className={`item rounded-md overflow-hidden cursor-pointer group transition-all duration-300 ${slideIndex === index ? 'opacity-100 border-2 border-primary' : 'opacity-50 hover:opacity-80 border border-gray-200'}`} 
                onClick={() => handleThumbClick(index)}
              >
                <div className="relative w-full h-20">
                  <img 
                    src={image} 
                    alt={`${product?.name || 'Product'} - View ${index + 1}`}
                    className='w-full h-full object-cover transition-all duration-300 group-hover:scale-105'
                    loading="lazy"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Image Zoom Container */}
      <div className="zoomContainer w-full md:w-[88%] h-[300px] md:h-[500px] overflow-hidden rounded-md bg-gray-100 order-1 md:order-2">
        {imagesToShow.length > 0 ? (
          <Swiper
            ref={zoomSliderBig}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
            loop={true}
            modules={[Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSlideChange={(swiper) => setSlideIndex(swiper.realIndex)}
            className="h-full"
          >
            {imagesToShow.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full flex items-center justify-center p-2">
                  <InnerImageZoom 
                    zoomType="hover"
                    zoomScale={1.5}
                    src={image}
                    alt={`${product?.name || 'Product'} - Main View ${index + 1}`}
                    className="w-full h-full object-contain max-h-full max-w-full"
                    zoomSrc={image}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No images available</p>
            </div>
          </div>
        )}

        {/* Image Counter */}
        {imagesToShow.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
            {slideIndex + 1} / {imagesToShow.length}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductZoom