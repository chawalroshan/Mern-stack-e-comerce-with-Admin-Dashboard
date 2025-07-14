import React from 'react';
import { Link } from 'react-router-dom';



import Button from '@mui/material/Button';
import { BsFillBagCheckFill } from "react-icons/bs";
import CartItems from './cartitems';


const Cart = () => {



    return (

        <section className='section py-5 pb-10'>
            <div className='container w-[80%]max-w-[80%] flex relative'>
                <div className='leftPart w-[70%]'>


                    <div className='shadow-md rounded-md p-1 bg-white mt-3'>
                        <div className='py-2 px-3 border-b border-[rgba(0,0,0,0.1)]'>
                            <h2>Your Cart</h2>
                            <p className='mt-0'>There are <span className='font-bold text-primary'>2</span> products in your cart.</p>
                        </div>

                        <CartItems size='s' qty={1} />
                        <CartItems size='s' qty={1} />
                        <CartItems size='s' qty={1} />
                        <CartItems size='s' qty={1} />



                    </div>

                </div>

                <div className="rightPart w-[30%] pl-10">
                    <div className='shadow-md rounded-md bg-white p-5'>
                        <h3 className='pb-3'>Cart Totals</h3>
                        <hr />

                        <p className='flex items-center justify-between'>
                            <span className='text-[14px] font-[500]'>Subtotal</span>
                            <span className='text-primary font-bold'>$1,3330</span>

                        </p>
                        <p className='flex items-center justify-between'>
                            <span className='text-[14px] font-[500]'>Shipping</span>
                            <span className=' font-bold'>Free</span>

                        </p>
                        <p className='flex items-center justify-between'>
                            <span className='text-[14px] font-[500]'>Estimate for</span>
                            <span className=' font-bold'>USA</span>

                        </p>
                        <p className='flex items-center justify-between'>
                            <span className='text-[14px] font-[500]'>Total</span>
                            <span className='text-primary font-bold'>$1555</span>

                        </p>
                        <Button className='btn-org btn-lg flex gap-2'>Checkout<BsFillBagCheckFill className='text-[18px]' /></Button>
                    </div>

                </div>

            </div>

        </section>
    )

}

export default Cart;