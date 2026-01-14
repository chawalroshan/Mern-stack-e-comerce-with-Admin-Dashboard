// client/src/components/ProductItem/ProductItem.jsx
import React, { useContext, useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { MyContext } from '../../App';

const ProductItem = ({ product }) => {
    const context = useContext(MyContext);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    
    if (!product) {
        console.warn('ProductItem: No product data provided');
        return null;
    }

    // Calculate discount percentage if old price exists
    const calculateDiscount = () => {
        if (product.oldePrice && product.price && product.oldePrice > product.price) {
            const discount = Math.round(((product.oldePrice - product.price) / product.oldePrice) * 100);
            return discount;
        }
        return 0;
    };

    const discount = calculateDiscount();
    const productImages = product.images || [];
    const mainImage = productImages[0] || 'https://via.placeholder.com/300x300?text=No+Image';
    const hoverImage = productImages[1] || mainImage;

    // Check if product is in wishlist
    const isInWishlist = context.isInMyList ? context.isInMyList(product._id) : false;
    
    // Find the wishlist item ID if exists
    const wishlistItem = context.myList?.find(item => item.productId?._id === product._id);

    const handleWishlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if already in wishlist
        const alreadyInWishlist = context.isInMyList(product._id);
        
        // Find the wishlist item
        const wishlistItem = context.myList?.find(item => {
          if (item.productId && typeof item.productId === 'object') {
            return item.productId._id === product._id;
          } else if (item.productId) {
            return item.productId === product._id;
          }
          return false;
        });
        
        setWishlistLoading(true);
        try {
            if (alreadyInWishlist && wishlistItem) {
                await context.removeFromMyList(wishlistItem._id);
            } else {
                await context.addToMyList(product);
            }
        } catch (error) {
            console.error('Error handling wishlist:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <div className='productItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300'>
            <div className='group imageWrapper w-[100%] h-[220px] overflow-hidden rounded-md relative'>
                <Link to={`/product/${product._id}`}>
                    <div className='img h-[220px] overflow-hidden relative'>
                        {/* Main Image */}
                        <img 
                            src={mainImage} 
                            alt={product.name || 'Product'} 
                            className='w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0'
                            loading="lazy"
                        />
                        
                        {/* Hover Image */}
                        <img 
                            src={hoverImage} 
                            alt={product.name || 'Product'} 
                            className='w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105'
                        />
                    </div>
                </Link>

                {/* Discount Badge */}
                {discount > 0 && (
                    <span className='discount flex items-center justify-center absolute top-[10px] left-[10px] z-50 !bg-red-600 text-white rounded-full w-10 h-10 text-[12px] font-bold shadow-md'>
                        -{discount}%
                    </span>
                )}

                {/* Product Actions */}
                <div className='actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[40px] transition-all duration-300 group-hover:top-[10px] opacity-0 group-hover:opacity-100'>
                    <Tooltip title="Quick View" placement="left">
                        <Button 
                            className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-primary hover:!text-white shadow-md hover:shadow-lg transition-all'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                context.openProductDetails && context.openProductDetails(product._id);
                            }}
                        >
                            <MdZoomOutMap className='text-[16px]' />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Add to Compare" placement="left">
                        <Button 
                            className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-primary hover:!text-white shadow-md hover:shadow-lg transition-all'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <IoIosGitCompare className='text-[16px]' />
                        </Button>
                    </Tooltip>

                    <Tooltip title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"} placement="left">
                        <Button 
                            className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full shadow-md hover:shadow-lg transition-all ${
                                isInWishlist 
                                    ? '!bg-red-100 !text-red-600 hover:!bg-red-200' 
                                    : '!bg-white !text-black hover:!bg-primary hover:!text-white'
                            }`}
                            onClick={handleWishlistClick}
                            disabled={wishlistLoading}
                        >
                            {wishlistLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : isInWishlist ? (
                                <FaHeart className='text-[16px] text-red-500' />
                            ) : (
                                <FaRegHeart className='text-[16px]' />
                            )}
                        </Button>
                    </Tooltip>
                </div>

                {/* Add to Cart Button - Visible on hover */}
                <div className='absolute bottom-[-50px] left-0 right-0 transition-all duration-300 group-hover:bottom-0 opacity-0 group-hover:opacity-100'>
                    <Button 
                        className='!w-full !bg-primary !text-white !py-2 !rounded-t-none hover:!bg-primary-dark transition-colors'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            context.addToCart && context.addToCart(product, 1);
                        }}
                        disabled={product.countInStock <= 0}
                    >
                        {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </div>
            </div>

            <div className='info p-4 bg-white'>
                {/* Category/Brand */}
                <div className='flex justify-between items-center mb-1'>
                    <h6 className='text-[11px] !font-[400] text-gray-500 uppercase tracking-wide'>
                        {product.brand || product.catName || 'Generic'}
                    </h6>
                    {product.isFeatured && (
                        <span className='text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold'>
                            Featured
                        </span>
                    )}
                </div>

                {/* Product Name */}
                <h3 className='text-[14px] font-[500] mb-2 text-gray-800 line-clamp-2 h-10 leading-5'>
                    <Link 
                        to={`/product/${product._id}`} 
                        className='hover:text-primary transition-colors'
                        title={product.name}
                    >
                        {product.name || 'Unnamed Product'}
                    </Link>
                </h3>

                {/* Rating */}
                <div className='flex items-center gap-1 mb-2'>
                    <Rating 
                        name="product-rating" 
                        value={product.rating || 0} 
                        size="small" 
                        readOnly 
                        precision={0.5}
                    />
                    <span className='text-[11px] text-gray-500'>
                        ({product.rating || 0})
                    </span>
                </div>

                {/* Price */}
                <div className='flex items-center gap-3'>
                    {product.oldePrice && product.oldePrice > product.price ? (
                        <>
                            <span className='oldPrice line-through text-gray-400 text-[14px] font-[500]'>
                                Rs.{product.oldePrice.toFixed(2)}
                            </span>
                            <span className='Price !text-primary font-[600] text-[16px]'>
                                Rs.{product.price?.toFixed(2) || '0.00'}
                            </span>
                        </>
                    ) : (
                        <span className='Price !text-primary font-[600] text-[16px]'>
                            Rs.{product.price?.toFixed(2) || '0.00'}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className='mt-2'>
                    <span className={`text-[11px] px-2 py-1 rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ProductItem;