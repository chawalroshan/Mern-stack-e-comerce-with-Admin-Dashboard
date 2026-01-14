import React, { useState, useContext, useEffect } from 'react'
import QuantityBox from '../QuantityBox/QuantityBox';
import { Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

const ProductDetailsComponent = ({ product }) => {
    const context = useContext(MyContext);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [availableSizes, setAvailableSizes] = useState(['S', 'M', 'L', 'XL']);
    
    useEffect(() => {
        // Initialize with first size
        if (availableSizes.length > 0) {
            setSelectedSize(0);
        }
    }, [availableSizes]);

    if (!product) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-3 text-gray-600">Loading product details...</p>
            </div>
        );
    }

    // Calculate discount
    const calculateDiscount = () => {
        if (product.oldePrice && product.price && product.oldePrice > product.price) {
            const discount = ((product.oldePrice - product.price) / product.oldePrice) * 100;
            return Math.round(discount);
        }
        return 0;
    };

    const discount = calculateDiscount();
    const inStock = product.countInStock > 0;
    const productPrice = product.price || 0;
    const oldPrice = product.oldePrice || 0;

    const handleAddToCart = () => {
        if (!inStock) {
            context.openAlertBox({ 
                type: 'error', 
                msg: 'This product is currently out of stock' 
            });
            return;
        }

        if (quantity < 1) {
            context.openAlertBox({ 
                type: 'error', 
                msg: 'Please select a valid quantity' 
            });
            return;
        }

        const productWithSize = {
            ...product,
            selectedSize: selectedSize !== null ? availableSizes[selectedSize] : 'Default'
        };

        context.addToCart(productWithSize, quantity);
        
        // Open cart panel after adding
        context.setOpenCartPanel(true);
    };

    const handleQuantityChange = (newQuantity) => {
        const maxQuantity = Math.min(product.countInStock, 10); // Limit to 10 or stock
        setQuantity(Math.min(newQuantity, maxQuantity));
    };

    return (
        <>
            {/* Product Header */}
            <div className="mb-3">
                {product.isFeatured && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold mb-2">
                        Featured Product
                    </span>
                )}
                {discount > 0 && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-semibold ml-2">
                        {discount}% OFF
                    </span>
                )}
            </div>

            <h1 className="text-[24px] md:text-[28px] font-[600] mb-2 text-gray-800 leading-tight">
                {product.name}
            </h1>

            {/* Brand and Rating */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {product.brand && (
                    <span className="text-gray-600 text-[14px]">
                        Brand: 
                        <span className="font-[500] text-black ml-1">{product.brand}</span>
                    </span>
                )}
                
                <div className="flex items-center gap-1">
                    <Rating 
                        name="product-rating" 
                        value={product.rating || 0} 
                        size="small" 
                        readOnly 
                        precision={0.5}
                    />
                    <span className="text-[13px] text-gray-500 ml-1">
                        ({product.rating || 0})
                    </span>
                </div>
                
                <Link 
                    to="#reviews" 
                    className="text-[13px] text-primary hover:underline cursor-pointer"
                >
                    {product.reviewCount || 0} Reviews
                </Link>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
                {oldPrice > productPrice ? (
                    <>
                        <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
                            Rs.{oldPrice.toFixed(2)}
                        </span>
                        <span className="Price !text-primary font-[700] text-[24px]">
                            Rs.{productPrice.toFixed(2)}
                        </span>
                    </>
                ) : (
                    <span className="Price !text-primary font-[700] text-[24px]">
                        Rs.{productPrice.toFixed(2)}
                    </span>
                )}
                
                <span className={`text-[14px] ${inStock ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                    {inStock ? `In Stock (${product.countInStock})` : 'Out of Stock'}
                </span>
            </div>

            {/* Description */}
            <p className="mt-3 mb-5 text-gray-700 leading-relaxed">
                {product.description || 'No description available for this product.'}
            </p>

            {/* Size Selection */}
            {product.size && (
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-[16px] font-[500]">Size:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                        {availableSizes.map((size, index) => (
                            <Button
                                key={size}
                                variant="outlined"
                                className={`!min-w-[45px] !h-[40px] !border !rounded-md ${
                                    selectedSize === index 
                                        ? '!bg-primary !text-white !border-primary' 
                                        : '!bg-white !text-gray-700 !border-gray-300 hover:!border-primary'
                                }`}
                                onClick={() => setSelectedSize(index)}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Info */}
            <div className="mb-5">
                <p className="text-[14px] text-gray-600 mb-1">
                    <span className="font-semibold">SKU:</span> {product._id?.slice(-8).toUpperCase()}
                </p>
                <p className="text-[14px] text-green-600 font-semibold">
                    ✓ Free Shipping (Est. Delivery 2-3 Days)
                </p>
                {product.category?.name && (
                    <p className="text-[14px] text-gray-600 mt-1">
                        <span className="font-semibold">Category:</span> {product.category.name}
                    </p>
                )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-t border-gray-200">
                <div className="qtyboxWrapper">
                    <QuantityBox 
                        value={quantity}
                        onChange={handleQuantityChange}
                        min={1}
                        max={Math.min(product.countInStock, 10)}
                    />
                </div>

                <Button 
                    className="btn-org flex gap-2 !px-6 !py-3"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    startIcon={<MdOutlineShoppingCart className="text-[20px]" />}
                >
                    Add to Cart
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 mt-2 pt-2 ">
                <button 
                    className="flex items-center gap-2 text-[14px] text-gray-700 hover:text-primary cursor-pointer font-[500] transition-colors"
                    onClick={() => context.openAlertBox({ 
                        type: 'success', 
                        msg: 'Added to wishlist!' 
                    })}
                >
                    <FaRegHeart className="text-[16px]" />
                    Add to Wishlist
                </button>
                
                <button 
                    className="flex items-center gap-2 text-[14px] text-gray-700 hover:text-primary cursor-pointer font-[500] transition-colors"
                    onClick={() => context.openAlertBox({ 
                        type: 'success', 
                        msg: 'Added to compare!' 
                    })}
                >
                    <IoIosGitCompare className="text-[16px]" />
                    Add to Compare
                </button>
            </div>

           
        </>
    );
}

export default ProductDetailsComponent;