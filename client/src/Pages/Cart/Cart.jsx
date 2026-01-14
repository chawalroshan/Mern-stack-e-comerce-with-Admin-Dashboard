import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdShoppingCart } from "react-icons/md";
import CartItems from './CartItems';
import { MyContext } from '../../App';

const Cart = () => {
    const context = useContext(MyContext);
    const cart = context.cart || [];
    const cartItemCount = context.getCartItemCount();
    const cartTotal = context.getCartTotal();
    const shippingCost = cartTotal > 1000 ? 0 : 50;
    const grandTotal = cartTotal + shippingCost;

    if (cart.length === 0) {
        return (
            <section className='section py-8 pb-16 bg-gray-50 min-h-[60vh]'>
                <div className='container'>
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <MdShoppingCart className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any items to your cart yet. 
                            Start shopping to discover amazing products!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/">
                                <Button className="btn-org !px-8 !py-3 flex items-center gap-2">
                                    Start Shopping
                                </Button>
                            </Link>
                            <Link to="/productListing">
                                <Button 
                                    variant="outlined" 
                                    className="!px-8 !py-3 !border-primary !text-primary hover:!bg-primary hover:!text-white"
                                >
                                    Browse Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='section py-5 pb-10 bg-gray-50'>
            <div className='container'>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">
                        You have <span className="font-bold text-primary">{cartItemCount}</span> item{cartItemCount !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Left Part - Cart Items */}
                    <div className='leftPart w-full lg:w-[70%]'>
                        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                            <div className='p-6 border-b border-gray-200'>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Cart Items</h2>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Total: <span className="font-semibold text-primary">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</span>
                                        </p>
                                    </div>
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={context.clearCart}
                                        className="!border-red-500 !text-red-500 hover:!bg-red-50"
                                    >
                                        Clear Cart
                                    </Button>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {cart.map((item) => (
                                    <CartItems 
                                        key={item._id} 
                                        item={item} 
                                        context={context}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Part - Order Summary */}
                    <div className="rightPart w-full lg:w-[30%]">
                        <div className='bg-white rounded-lg shadow-md p-6 sticky top-6'>
                            <h3 className='text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200'>Order Summary</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-600'>Subtotal ({cartItemCount} items)</span>
                                    <span className='font-semibold'>Rs.{cartTotal.toFixed(2)}</span>
                                </div>
                                
                                <div className='flex items-center justify-between'>
                                    <span className='text-gray-600'>Shipping</span>
                                    <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                        {shippingCost === 0 ? 'FREE' : `Rs.${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                
                                
                                <div className='pt-4 border-t border-gray-200'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-lg font-bold text-gray-800'>Total</span>
                                        <span className='text-xl font-bold text-primary'>Rs.{grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Free Shipping Progress */}
                            {cartTotal < 1000 && (
                                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-blue-700">Free shipping on orders over Rs.1000</span>
                                        <span className="font-semibold">Rs.{cartTotal.toFixed(2)} / Rs.1000</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${Math.min((cartTotal / 1000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Add Rs.{(1000 - cartTotal).toFixed(2)} more for free shipping
                                    </p>
                                </div>
                            )}

                            {/* Checkout Button */}
                            <Link to="/checkout" className="block w-full">
                                <Button 
                                    className="btn-org !w-full !py-3 !text-lg flex items-center justify-center gap-2 hover:!bg-primary-dark"
                                    startIcon={<BsFillBagCheckFill className="text-xl" />}
                                >
                                    Proceed to Checkout
                                </Button>
                            </Link>

                            {/* Continue Shopping */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <Link to="/">
                                    <Button 
                                        variant="outlined" 
                                        className="!w-full !py-2 !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                                    >
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </div>

                            {/* Payment Methods */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">We accept:</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                        Visa
                                    </div>
                                    <div className="w-10 h-6 bg-blue-900 rounded flex items-center justify-center text-white text-xs font-bold">
                                        MC
                                    </div>
                                    <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                        Pay
                                    </div>
                                    <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                        COD
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Cart;