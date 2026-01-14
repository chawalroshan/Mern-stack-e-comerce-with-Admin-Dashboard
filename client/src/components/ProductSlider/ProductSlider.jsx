// client/src/components/ProductSlider/ProductSlider.jsx
import React, { useContext, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductItem from '../ProductItem/ProductItem';
import { MyContext } from '../../App';

const ProductSlider = (props) => {
    const context = useContext(MyContext);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let productsToDisplay = [];
        
        if (props.type === 'featured') {
            productsToDisplay = context.featuredProducts || [];
        } else if (props.type === 'latest') {
            // Show newest products first
            productsToDisplay = [...(context.products || [])]
                .sort((a, b) => new Date(b.createdAt || b.dateCreated) - new Date(a.createdAt || a.dateCreated))
                .slice(0, props.limit || 10);
        } else if (props.products && Array.isArray(props.products)) {
            productsToDisplay = props.products;
        } else {
            productsToDisplay = context.products || [];
        }

        console.log(`ProductSlider: Displaying ${productsToDisplay.length} products of type: ${props.type || 'all'}`);
        setDisplayProducts(productsToDisplay);
        setLoading(false);
    }, [context.products, context.featuredProducts, props.type, props.products, props.limit]);

    if (loading) {
        return (
            <div className="productSlider py-3">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (displayProducts.length === 0) {
        return (
            <div className="productSlider py-3">
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No products available</p>
                    {props.type === 'featured' && (
                        <p className="text-sm text-gray-400 mt-1">No featured products found</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className='productSlider py-3'>
            <Swiper
                spaceBetween={20}
                navigation={true}
                slidesPerView={props.items || 4}
                modules={[Navigation, Autoplay]}
                autoplay={props.autoplay ? {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                } : false}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    480: { slidesPerView: 2, spaceBetween: 15 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: props.items || 4, spaceBetween: 25 },
                    1280: { slidesPerView: props.items || 5, spaceBetween: 30 },
                }}
                className="mySwiper"
            >
                {displayProducts.map((product) => (
                    <SwiperSlide key={product._id} className="!h-auto">
                        <ProductItem product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ProductSlider;