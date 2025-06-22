import React,{useRef, useState} from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

const ProductZoom = () => {

  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderBig.current.swiper.slideTo(index);
    zoomSliderSml.current.swiper.slideTo(index);
  }

  return (
    <div className='flex gap-3'>
        <div className='slider w-[10%]'>
        <Swiper
         direction={'vertical'}
        slidesPerView={5}
        spaceBetween={0}
        navigation={true}
        modules={[Navigation]}
        className="zoomProductSliderThumbs h-[500px] overflow-hidden"
      >
        <SwiperSlide>
           <div className="item rounded-md overflow-hidden cursor-pointer group ${slideIndex===0 ? 'opacity-1' : 'opacity-30' }" onClick={()=> goto(0)}>
            <Link to='/'>
                <img src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/35-large_default/brown-bear-printed-sweater.jpg' alt='Product' className='w-full transition-all group-hover:scale-105' />
            </Link>
           </div>
        </SwiperSlide>

        <SwiperSlide>
           <div className="item rounded-md overflow-hidden cursor-pointer group ${slideIndex===1 ? 'opacity-1' : 'opacity-30' }" onClick={()=> goto(1)}>
            <Link to='/'>
                <img src='https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg' alt='Product' className='w-full transition-all group-hover:scale-105' />
            </Link>
           </div>
        </SwiperSlide>
        <SwiperSlide>
           <div className="item rounded-md overflow-hidden cursor-pointer group ${slideIndex===2 ? 'opacity-1' : 'opacity-30' }" onClick={()=> goto(2)}>
            <Link to='/'>
                <img src='https://api.spicezgold.com/download/file_1734529297930_fiorra-women-s-teapot-blue-pure-cotton-a-line-kurta-with-sharara-and-dupatta-product-images-rvo9n8udfg-1-202307260626.jpg' alt='Product' className='w-full transition-all group-hover:scale-105' />
            </Link>
           </div>
        </SwiperSlide>
        <SwiperSlide>
           <div className="item rounded-md overflow-hidden cursor-pointer group ${slideIndex===3 ? 'opacity-1' : 'opacity-30' }" onClick={()=> goto(3)}>
            <Link to='/'>
                <img src='https://api.spicezgold.com/download/file_1734774941575_R6WYmq29_6c5a1a62dfd74f98861823f9f99e5225.jpg' alt='Product' className='w-full transition-all group-hover:scale-105' />
            </Link>
           </div>
        </SwiperSlide>
        <SwiperSlide>
           <div className="item rounded-md overflow-hidden cursor-pointer group ${slideIndex===4 ? 'opacity-1' : 'opacity-30' }" onClick={()=> goto(4)}>
            <Link to='/'>
                <img src='https://api.spicezgold.com/download/file_1734526995692_zaaliqa-girls-black-handbag-product-images-rvd5gtvjgi-1-202404151052.webp' alt='Product' className='w-full transition-all group-hover:scale-105' />
            </Link>
           </div>
        </SwiperSlide>
        <SwiperSlide></SwiperSlide>
        
        
      </Swiper>
        </div>
        <div className="zoomContainer w-[85%] h-[500px] overflow-hidden rounded-md">
          <Swiper
          ref={zoomSliderBig}
        slidesPerView={1}
        spaceBetween={0}
        navigation={false}
       loop={true}
      >

     
      <SwiperSlide>
            <InnerImageZoom zoomType='hover' zoomScale={1} src={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/35-large_default/brown-bear-printed-sweater.jpg'} />
            </SwiperSlide>
            <SwiperSlide>
            <InnerImageZoom zoomType='hover' zoomScale={1} src={'https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg'} />
            </SwiperSlide>
            <SwiperSlide>
            <InnerImageZoom zoomType='hover' zoomScale={1} src={'https://api.spicezgold.com/download/file_1734529297930_fiorra-women-s-teapot-blue-pure-cotton-a-line-kurta-with-sharara-and-dupatta-product-images-rvo9n8udfg-1-202307260626.jpg'} />
            </SwiperSlide>
            <SwiperSlide>
            <InnerImageZoom zoomType='hover' zoomScale={1} src={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/35-large_default/brown-bear-printed-sweater.jpg'} />
            </SwiperSlide>
            <SwiperSlide>
            <InnerImageZoom zoomType='hover' zoomScale={1} src={'https://demos.codezeel.com/prestashop/PRS21/PRS210502/35-large_default/brown-bear-printed-sweater.jpg'} />
            </SwiperSlide>
             </Swiper>
        </div>
      
    </div>
  )
}

export default ProductZoom
