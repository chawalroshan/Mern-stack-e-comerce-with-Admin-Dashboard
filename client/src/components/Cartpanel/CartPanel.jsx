import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';
import { MyContext } from '../../App';

const CartPanel = () => {
    const context = useContext(MyContext);
    const cart = context.cart || [];
    const cartItemCount = context.getCartItemCount();
    const cartTotal = context.getCartTotal();
    const shippingCost = cartTotal > 1000 ? 0 : 50; // Free shipping over 1000
    const grandTotal = cartTotal + shippingCost;

    const handleRemoveItem = (productId, e) => {
        e.preventDefault();
        e.stopPropagation();
        context.removeFromCart(productId);
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        context.updateCartItemQuantity(productId, newQuantity);
    };

    if (cart.length === 0) {
        return (
            <>
                <div className="scroll w-full max-h-[300px] overflow-y-auto overflow-x-hidden py-3 px-4">
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
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
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-600 mb-4">Your cart is empty</p>
                        <Button 
                            className="btn-org"
                            onClick={() => context.setOpenCartPanel(false)}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </div>

                <div className="bottomSection absolute bottom-[10px] left-[10px] w-full pr-5">
                    <div className='bottomInfo py-3 w-full px-4 border-t-[1px] border-[#e5e5e5]'>
                        <div className='w-full flex items-center justify-between mb-3'>
                            <span className='text-[14px] font-[600]'>Items</span>
                            <span className='text-gray-600'>0</span>
                        </div>
                        <div className='w-full flex items-center justify-between mb-3'>
                            <span className='text-[14px] font-[600]'>Subtotal</span>
                            <span className='text-gray-600'>Rs.0.00</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="scroll w-full max-h-[300px] overflow-y-auto overflow-x-hidden py-3 px-4">
                {cart.map((item) => (
                    <div 
                        key={item._id} 
                        className="cartItem w-full flex items-center gap-4 border-b-[1px] border-[#e5e5e5] pb-3 mb-3 hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                        {/* Product Image */}
                        <div className="img w-[25%] min-w-[70px] overflow-hidden h-[80px] rounded-md bg-gray-100">
                            <Link 
                                to={`/product/${item._id}`} 
                                className='block group h-full'
                                onClick={() => context.setOpenCartPanel(false)}
                            >
                                {item.images && item.images[0] ? (
                                    <img 
                                        src={item.images[0]} 
                                        alt={item.name}
                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <span className="text-gray-500 text-xs">No Image</span>
                                    </div>
                                )}
                            </Link>
                        </div>

                        {/* Product Info */}
                        <div className="info w-[75%] pr-5 relative">
                            <h4 className='text-[14px] font-[500] mb-1 line-clamp-2'>
                                <Link 
                                    to={`/product/${item._id}`}
                                    className='text-gray-800 hover:text-primary transition-colors'
                                    onClick={() => context.setOpenCartPanel(false)}
                                >
                                    {item.name}
                                </Link>
                            </h4>
                            
                            {item.selectedSize && (
                                <p className="text-xs text-gray-600 mb-1">
                                    Size: {item.selectedSize}
                                </p>
                            )}
                            
                            <div className='flex items-center justify-between mt-2'>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                        onClick={(e) => handleUpdateQuantity(item._id, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-medium min-w-[20px] text-center">
                                        {item.quantity}
                                    </span>
                                    <button 
                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                        onClick={(e) => handleUpdateQuantity(item._id, item.quantity + 1)}
                                        disabled={item.quantity >= (item.countInStock || 10)}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <span className='text-primary font-bold text-sm'>
                                    Rs.{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                            
                            {/* Remove Button */}
                            <MdDeleteOutline 
                                className='absolute top-0 right-0 cursor-pointer text-[18px] text-gray-400 hover:text-red-500 transition-colors'
                                onClick={(e) => handleRemoveItem(item._id, e)}
                                title="Remove item"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Summary */}
            <div className="bottomSection absolute bottom-0 left-0 w-full bg-white border-t border-gray-200">
                <div className='bottomInfo py-3 w-full px-4'>
                    {/* Subtotal */}
                    <div className='w-full flex items-center justify-between mb-2'>
                        <span className='text-[14px] text-gray-600'>Subtotal ({cartItemCount} items)</span>
                        <span className='text-primary font-bold'>Rs.{cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping */}
                    <div className='w-full flex items-center justify-between mb-2'>
                        <span className='text-[14px] text-gray-600'>Shipping</span>
                        <span className={`font-bold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                            {shippingCost === 0 ? 'FREE' : `Rs.${shippingCost.toFixed(2)}`}
                        </span>
                    </div>


                    {/* Total */}
                    <div className='w-full flex items-center justify-between mb-3 pt-3 border-t border-gray-200'>
                        <span className='text-[16px] font-[600] text-gray-800'>Total</span>
                        <span className='text-[18px] text-primary font-bold'>Rs.{grandTotal.toFixed(2)}</span>
                    </div>

                    {/* Buttons */}
                    <div className='w-full flex items-center gap-2 mt-4'>
                        <Link 
                            to='/cart' 
                            className='w-1/2'
                            onClick={() => context.setOpenCartPanel(false)}
                        >
                            <Button 
                                className='w-full !bg-gray-100 !text-gray-800 hover:!bg-gray-200 !rounded-md !py-2'
                                variant="outlined"
                            >
                                View Cart
                            </Button>
                        </Link>
                        <Link 
                            to='/checkout' 
                            className='w-1/2'
                            onClick={() => context.setOpenCartPanel(false)}
                        >
                            <Button 
                                className='btn-org w-full !rounded-md !py-2'
                            >
                                Checkout
                            </Button>
                        </Link>
                    </div>

                    {/* Free Shipping Message */}
                    {cartTotal < 1000 && (
                        <div className="mt-3 text-center">
                            <p className="text-xs text-gray-600">
                                Add Rs.{(1000 - cartTotal).toFixed(2)} more for <span className="text-green-600 font-semibold">FREE shipping</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CartPanel;