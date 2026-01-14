import React, { useContext } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MdZoomOutMap, MdOutlineShoppingCart } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { MyContext } from '../../App';

const ProductItemListView = ({ product }) => {
    const context = useContext(MyContext);

    if (!product) {
        console.warn('ProductItemListView: No product data provided');
        return null;
    }

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

    return (
        <div className='productItem shadow-lg rounded-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row'>
            <div className='group imageWrapper w-full md:w-[25%] h-[220px] md:h-auto overflow-hidden relative'>
                <Link to={`/product/${product._id}`}>
                    <div className='img h-full'>
                        <img 
                            src={mainImage} 
                            alt={product.name || 'Product'} 
                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                        />
                    </div>
                </Link>
                
                {discount > 0 && (
                    <span className='discount flex items-center justify-center absolute top-[10px] left-[10px] z-50 !bg-red-600 text-white rounded-full w-12 h-12 text-[13px] font-bold shadow-lg'>
                        -{discount}%
                    </span>
                )}
            </div>

            <div className='info p-5 md:w-[75%]'>
                <div className='flex justify-between items-start mb-2'>
                    <div>
                        <h6 className='text-[13px] !font-[400] text-gray-500 mb-1'>
                            {product.brand || product.catName || 'Generic'}
                        </h6>
                        <h3 className='text-[18px] font-[600] mb-2 text-gray-800'>
                            <Link to={`/product/${product._id}`} className='hover:text-primary transition-colors'>
                                {product.name || 'Unnamed Product'}
                            </Link>
                        </h3>
                    </div>
                    
                    {product.isFeatured && (
                        <span className='text-[11px] bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold'>
                            Featured
                        </span>
                    )}
                </div>

                <div className='flex items-center gap-2 mb-3'>
                    <Rating 
                        name="product-rating" 
                        value={product.rating || 0} 
                        size="small" 
                        readOnly 
                        precision={0.5}
                    />
                    <span className='text-[13px] text-gray-500'>
                        ({product.rating || 0} rating)
                    </span>
                </div>

                <p className='text-[14px] text-gray-600 mb-4 line-clamp-3'>
                    {product.description || 'No description available.'}
                </p>

                <div className='flex flex-wrap items-center justify-between'>
                    <div className='flex items-center gap-4 mb-3 md:mb-0'>
                        {product.oldePrice && product.oldePrice > product.price ? (
                            <>
                                <span className='oldPrice line-through text-gray-400 text-[16px] font-[500]'>
                                    Rs.{product.oldePrice.toFixed(2)}
                                </span>
                                <span className='Price !text-primary font-[700] text-[20px]'>
                                    Rs.{product.price?.toFixed(2) || '0.00'}
                                </span>
                            </>
                        ) : (
                            <span className='Price !text-primary font-[700] text-[20px]'>
                                Rs.{product.price?.toFixed(2) || '0.00'}
                            </span>
                        )}
                        
                        <span className={`text-[12px] px-3 py-1 rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.countInStock > 0 ? `In Stock: ${product.countInStock}` : 'Out of Stock'}
                        </span>
                    </div>

                    <div className='flex items-center gap-3'>
                        <Tooltip title="Quick View">
                            <Button 
                                className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-gray-100 !text-gray-700 hover:!bg-primary hover:!text-white'
                                onClick={() => context.openProductDetails(product._id)}
                            >
                                <MdZoomOutMap className='text-[18px]' />
                            </Button>
                        </Tooltip>
                        
                        <Tooltip title="Add to Compare">
                            <Button className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-gray-100 !text-gray-700 hover:!bg-primary hover:!text-white'>
                                <IoIosGitCompare className='text-[18px]' />
                            </Button>
                        </Tooltip>
                        
                        <Tooltip title="Add to Wishlist">
                            <Button className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-gray-100 !text-gray-700 hover:!bg-primary hover:!text-white'>
                                <FaRegHeart className='text-[18px]' />
                            </Button>
                        </Tooltip>
                        
                        <Button 
                            className='btn-org flex gap-2 !px-4 !py-2'
                            onClick={() => context.addToCart(product, 1)}
                            disabled={product.countInStock <= 0}
                        >
                            <MdOutlineShoppingCart className='text-[18px]' />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductItemListView;