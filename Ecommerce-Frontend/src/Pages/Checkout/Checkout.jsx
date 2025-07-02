import React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { BsFillBagCheckFill } from "react-icons/bs";

const Checkout = () => {
    return (
        <section className="py-10 bg-[#f9f9f9]">
            <div className="container mx-auto px-4 flex gap-5">

                <div className="w-[70%]">
                    <div className="bg-white shadow-md p-6 rounded-md w-full">
                        <h1 className="text-xl font-semibold mb-5">Billing Details</h1>

                        <form className="w-full">

                            <div className="flex gap-5 mb-5">
                                <div className="w-1/2">
                                    <TextField fullWidth label="Full Name" variant="outlined" size="small" />
                                </div>
                                <div className="w-1/2">
                                    <TextField fullWidth label="Email" variant="outlined" size="small" />
                                </div>
                            </div>


                            <h6 className="text-sm font-medium mb-2">Street Address *</h6>
                            <div className="mb-4">
                                <TextField fullWidth label="House No. & Street Name" variant="outlined" size="small" />
                            </div>
                            <div className="mb-5">
                                <TextField fullWidth label="Apartment" variant="outlined" size="small" />
                            </div>


                            <h6 className="text-sm font-medium mb-2">Town / City *</h6>
                            <div className="mb-5">
                                <TextField fullWidth label="City" variant="outlined" size="small" />
                            </div>


                            <h6 className="text-sm font-medium mb-2">County / State *</h6>
                            <div className="mb-5">
                                <TextField fullWidth label="State" variant="outlined" size="small" />
                            </div>


                            <h6 className="text-sm font-medium mb-2">Postal ZIP *</h6>
                            <div className="mb-5">
                                <TextField fullWidth label="ZIP code" variant="outlined" size="small" />
                            </div>


                            <div className="flex gap-5">
                                <div className="w-1/2">
                                    <TextField fullWidth label="Phone Number" variant="outlined" size="small" />
                                </div>
                                <div className="w-1/2">
                                    <TextField fullWidth label="Email Address" variant="outlined" size="small" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="roghtCol w-[30%]">
                    <div className='card bg-white shadow-md pb-5 rounded-md '>
                        <h2 className='mb-4'> Your Order</h2>

                        <div className="scroll max-h-[250px] overflow-y-scroll overflow-x-hidden pr-2 mb-5">
                            <div className='flex items-center justify-between py-3 px-1 border-t border-b border-[rgba(0,0,0,0.1)]'>
                                <span className='text-[14px] font-[600] '>Product</span>
                                <span className='text-[14px] font-[600]'>SubTotal</span>

                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                {/* Left Side: Image, Title, Qty */}
                                <div className="part1 flex items-center gap-3">
                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-md cursor-pointer group">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU7U2h0umyF0P6E_yhTX45sGgPEQAbGaJ4g&s"
                                            className="w-full h-full object-cover transition-all group-hover:scale-105"
                                            alt="Product"
                                        />
                                    </div>

                                    <div className="info">
                                        <h4 className="text-[14px] font-medium leading-[18px]">A-Line Kurti With sssh ... X!</h4>
                                        <span className="text-[13px] text-gray-600">Qty: 1</span>
                                    </div>
                                </div>

                                {/* Right Side: Price */}
                                <span className="text-[14px] text-primary font-semibold min-w-[70px] text-right">Rs. 1000</span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                {/* Left Side: Image, Title, Qty */}
                                <div className="part1 flex items-center gap-3">
                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-md cursor-pointer group">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU7U2h0umyF0P6E_yhTX45sGgPEQAbGaJ4g&s"
                                            className="w-full h-full object-cover transition-all group-hover:scale-105"
                                            alt="Product"
                                        />
                                    </div>

                                    <div className="info">
                                        <h4 className="text-[14px] font-medium leading-[18px]">A-Line Kurti With sssh ... X!</h4>
                                        <span className="text-[13px] text-gray-600">Qty: 1</span>
                                    </div>
                                </div>

                                {/* Right Side: Price */}
                                <span className="text-[14px] text-primary font-semibold min-w-[70px] text-right">Rs. 1000</span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                {/* Left Side: Image, Title, Qty */}
                                <div className="part1 flex items-center gap-3">
                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-md cursor-pointer group">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU7U2h0umyF0P6E_yhTX45sGgPEQAbGaJ4g&s"
                                            className="w-full h-full object-cover transition-all group-hover:scale-105"
                                            alt="Product"
                                        />
                                    </div>

                                    <div className="info">
                                        <h4 className="text-[14px] font-medium leading-[18px]">A-Line Kurti With sssh ... X!</h4>
                                        <span className="text-[13px] text-gray-600">Qty: 1</span>
                                    </div>
                                </div>

                                {/* Right Side: Price */}
                                <span className="text-[14px] text-primary font-semibold min-w-[70px] text-right">Rs. 1000</span>
                            </div>


                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                {/* Left Side: Image, Title, Qty */}
                                <div className="part1 flex items-center gap-3">
                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-md cursor-pointer group">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU7U2h0umyF0P6E_yhTX45sGgPEQAbGaJ4g&s"
                                            className="w-full h-full object-cover transition-all group-hover:scale-105"
                                            alt="Product"
                                        />
                                    </div>

                                    <div className="info">
                                        <h4 className="text-[14px] font-medium leading-[18px]">A-Line Kurti With sssh ... X!</h4>
                                        <span className="text-[13px] text-gray-600">Qty: 1</span>
                                    </div>
                                </div>

                                {/* Right Side: Price */}
                                <span className="text-[14px] text-primary font-semibold min-w-[70px] text-right">Rs. 1000</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                {/* Left Side: Image, Title, Qty */}
                                <div className="part1 flex items-center gap-3">
                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-md cursor-pointer group">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU7U2h0umyF0P6E_yhTX45sGgPEQAbGaJ4g&s"
                                            className="w-full h-full object-cover transition-all group-hover:scale-105"
                                            alt="Product"
                                        />
                                    </div>

                                    <div className="info">
                                        <h4 className="text-[14px] font-medium leading-[18px]">A-Line Kurti With sssh ... X!</h4>
                                        <span className="text-[13px] text-gray-600">Qty: 1</span>
                                    </div>
                                </div>

                                {/* Right Side: Price */}
                                <span className="text-[14px] text-primary font-semibold min-w-[70px] text-right">Rs. 1000</span>
                            </div> <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                {/* Left Side: Image, Title, Qty */}
                                <div className="part1 flex items-center gap-3">
                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-md cursor-pointer group">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU7U2h0umyF0P6E_yhTX45sGgPEQAbGaJ4g&s"
                                            className="w-full h-full object-cover transition-all group-hover:scale-105"
                                            alt="Product"
                                        />
                                    </div>

                                    <div className="info">
                                        <h4 className="text-[14px] font-medium leading-[18px]">A-Line Kurti With sssh ... X!</h4>
                                        <span className="text-[13px] text-gray-600">Qty: 1</span>
                                    </div>
                                </div>

                                {/* Right Side: Price */}
                                <span className="text-[14px] text-primary font-semibold min-w-[70px] text-right">Rs. 1000</span>
                            </div>

                        </div>

                        <div className='px-4'>
                        <Button className='btn-org btn-lg w-full flexitems-center gap-2'>Checkout <BsFillBagCheckFill className='text-[20px]' /></Button>
                        </div>


                    </div>
                </div>
            </div>
        </section>
    )
}

export default Checkout
