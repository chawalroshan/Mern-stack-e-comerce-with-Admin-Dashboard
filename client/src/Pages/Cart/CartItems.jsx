import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from "react-icons/go";
import Rating from '@mui/material/Rating';
import { IoCloseSharp } from "react-icons/io5";

const CartItems = ({ item, context }) => {
    const [sizeAnchorEl, setSizeAnchorEl] = useState(null);
    const [selectedSize, setSelectedSize] = useState(item.selectedSize || 'S');
    const openSize = Boolean(sizeAnchorEl);

    const [qtyAnchorEl, setQtyAnchorEl] = useState(null);
    const [selectedQty, setSelectedQty] = useState(item.quantity || 1);
    const openQty = Boolean(qtyAnchorEl);

    const handleClickSize = (event) => {
        setSizeAnchorEl(event.currentTarget);
    };

    const handleCloseSize = (value) => {
        setSizeAnchorEl(null);
        if (value) {
            setSelectedSize(value);
            // Update cart item size
            const updatedItem = { ...item, selectedSize: value };
            context.updateCartItemQuantity(item._id, item.quantity, updatedItem);
        }
    };

    const handleClickQty = (event) => {
        setQtyAnchorEl(event.currentTarget);
    };

    const handleCloseQty = (value) => {
        setQtyAnchorEl(null);
        if (value) {
            const newQty = parseInt(value);
            if (newQty >= 1 && newQty <= (item.countInStock || 10)) {
                setSelectedQty(newQty);
                context.updateCartItemQuantity(item._id, newQty);
            }
        }
    };

    const handleRemoveItem = () => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            context.removeFromCart(item._id);
        }
    };

    const calculateDiscount = () => {
        if (item.oldePrice && item.price && item.oldePrice > item.price) {
            const discount = ((item.oldePrice - item.price) / item.oldePrice) * 100;
            return Math.round(discount);
        }
        return 0;
    };

    const discount = calculateDiscount();
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    const mainImage = item.images && item.images[0] 
        ? item.images[0] 
        : 'https://via.placeholder.com/150x150?text=No+Image';

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const quantities = Array.from({ length: Math.min(item.countInStock || 10, 10) }, (_, i) => i + 1);

    return (
        <div className="cartItem w-full p-4 md:p-6 flex items-start gap-4 md:gap-6 hover:bg-gray-50 transition-colors">
            {/* Product Image */}
            <div className="img w-[25%] md:w-[15%] min-w-[80px] rounded-md overflow-hidden bg-gray-100">
                <Link 
                    to={`/product/${item._id}`} 
                    className='group block h-full'
                >
                    <img 
                        src={mainImage} 
                        alt={item.name}
                        className='w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                </Link>
            </div>

            {/* Product Info */}
            <div className="info flex-1 relative">
                {/* Remove Button */}
                <button 
                    onClick={handleRemoveItem}
                    className="absolute top-0 right-0 cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                >
                    <IoCloseSharp className='text-[20px] md:text-[22px]' />
                </button>

                {/* Brand */}
                {item.brand && (
                    <span className='text-[12px] text-gray-500 uppercase tracking-wide'>
                        {item.brand}
                    </span>
                )}

                {/* Product Name */}
                <h3 className='text-[14px] md:text-[16px] font-[600] text-gray-800 mt-1 mb-1'>
                    <Link 
                        to={`/product/${item._id}`}
                        className='hover:text-primary transition-colors line-clamp-2'
                    >
                        {item.name}
                    </Link>
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <Rating 
                        name="product-rating" 
                        value={item.rating || 0} 
                        size="small" 
                        readOnly 
                        precision={0.5}
                    />
                    <span className="text-[11px] text-gray-500">
                        ({item.rating || 0})
                    </span>
                </div>

                {/* Size and Quantity Selectors */}
                <div className='flex flex-wrap items-center gap-3 md:gap-4 mb-3'>
                    {/* Size Selector */}
                    <div className='relative'>
                        <span
                            className='flex items-center justify-center bg-gray-100 text-[11px] md:text-[12px] font-[600] py-2 px-3 rounded-md cursor-pointer gap-1 hover:bg-gray-200 transition-colors'
                            onClick={handleClickSize}
                        >
                            Size: {selectedSize} <GoTriangleDown className="ml-1" />
                        </span>
                        <Menu
                            id="size-menu"
                            anchorEl={sizeAnchorEl}
                            open={openSize}
                            onClose={() => handleCloseSize(null)}
                            slotProps={{
                                list: {
                                    'aria-labelledby': 'basic-button',
                                },
                            }}
                        >
                            {sizes.map((size) => (
                                <MenuItem 
                                    key={size}
                                    onClick={() => handleCloseSize(size)}
                                    selected={selectedSize === size}
                                >
                                    {size}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    {/* Quantity Selector */}
                    <div className='relative'>
                        <span
                            className='flex items-center justify-center bg-gray-100 text-[11px] md:text-[12px] font-[600] py-2 px-3 rounded-md cursor-pointer gap-1 hover:bg-gray-200 transition-colors'
                            onClick={handleClickQty}
                        >
                            Qty: {selectedQty} <GoTriangleDown className="ml-1" />
                        </span>
                        <Menu
                            id="qty-menu"
                            anchorEl={qtyAnchorEl}
                            open={openQty}
                            onClose={() => handleCloseQty(null)}
                            slotProps={{
                                list: {
                                    'aria-labelledby': 'basic-button',
                                },
                            }}
                        >
                            {quantities.map((qty) => (
                                <MenuItem 
                                    key={qty}
                                    onClick={() => handleCloseQty(qty.toString())}
                                    selected={selectedQty === qty}
                                >
                                    {qty}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>

                    {/* Stock Status */}
                    <span className={`text-[11px] px-2 py-1 rounded-full ${item.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.countInStock > 0 ? `Stock: ${item.countInStock}` : 'Out of Stock'}
                    </span>
                </div>

                {/* Price */}
                <div className='flex flex-wrap items-center gap-3 md:gap-4 mt-3'>
                    <span className='text-[16px] md:text-[18px] font-bold text-gray-800'>
                        Rs.{(item.price || 0).toFixed(2)}
                    </span>
                    
                    {item.oldePrice && item.oldePrice > item.price && (
                        <>
                            <span className='oldPrice line-through text-gray-500 text-[14px] font-[500]'>
                                Rs.{item.oldePrice.toFixed(2)}
                            </span>
                            {discount > 0 && (
                                <span className='text-[12px] bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold'>
                                    {discount}% OFF
                                </span>
                            )}
                        </>
                    )}

                    {/* Item Total */}
                    <div className="ml-auto">
                        <span className="text-[14px] text-gray-600">Total:</span>
                        <span className="ml-2 text-[16px] font-bold text-primary">
                            Rs.{itemTotal.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;