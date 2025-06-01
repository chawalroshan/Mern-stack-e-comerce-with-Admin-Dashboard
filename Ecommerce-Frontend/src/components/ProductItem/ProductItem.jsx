import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';

const ProductItem = () => {
    return (
        <div className='productItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)]'>
            <div className='group imageWrapper w-[100%] h-[220px] overflow-hidden rounded-md relative '>
                <Link to='/'>
                <div className='img h-[220px] overflow-hidden'>
                <img src='https://serviceapi.spicezgold.com/download/1742439426968_modestouze-attires-women-s-mukaish-worked-ethnic-jacket-with-top-and-pant-set-product-images-rvziicqwq6-2-202403231855.jpg' alt='Product' className='w-full' />

                <img src='https://serviceapi.spicezgold.com/download/1742439426966_modestouze-attires-women-s-mukaish-worked-ethnic-jacket-with-top-and-pant-set-product-images-rvziicqwq6-0-202403231855.jpg' alt='Product' className='w-full absolute top-0 left-0 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105' />
                </div>
                </Link>
                
                {/* ✅ FIXED: left[10px] → left-[10px], text[12px] → text-[12px] */}
                <span className='discount flex items-center absolute top-[10px] left-[10px] z-50 !bg-primary text-white rounded-md p-2 text-[12px] font-[500]'> 
                    -5%
                </span>

                {/* ✅ FIXED: h[35px] → h-[35px] */}
                <div className='actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[10px] opacity-0 group-hover:opacity-100'>
                     <Tooltip title="View Product Details" placement="left-start">
                    <Button className='!w-[35px] !h-[35px] !min-w-[45px] !rounded-full !bg-white text-black hover:bg-primary hover:text-white group '> 
                        <MdZoomOutMap className='text-[18px] text-black group-hover:text-white hover:!text-white'/> 
                    </Button></Tooltip>
                    <Button className='!w-[35px] !h-[35px] !min-w-[45px] !rounded-full !bg-white text-black hover:bg-primary hover:text-white group '> 
                        <IoIosGitCompare className='text-[18px] text-black group-hover:text-white  hover:!text-white'/> 
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[45px] !rounded-full !bg-white text-black hover:bg-primary hover:text-white group '> 
                        <FaRegHeart className='text-[18px] text-black group-hover:text-white  hover:!text-white'/> 
                    </Button>
                </div>
            </div>

            <div className='info p-5 bg-[rgba(237,237,237,0.9)] shadow-md'>
                <h6 className='text-[13px] font'> 
                    <Link to='/' className='link transition-all'>Soylent Green</Link>
                </h6>

                {/* ✅ FIXED: font-500] → font-[500] */}
                <h3 className='text-[13px] title mt-1 font-[500] mb-1 text-[#000]'> 
                    <Link to='/' className='link transition-all'>
                        Cotton Co Ord Set-Tie & Dye Tracksuit with Insert Pockets-Women Tie & Dye 2-Piece Co-Ord Set-1PAIR (Size-XL)
                    </Link>
                </h3>

                <Rating name="size-small" defaultValue={4} size="small" readOnly />

                <div className='flex items-center'>
                    <span className='oldPrice line-through text-gray-500 text-[15px] font-[500]'> 
                        $58.00
                    </span>
                    
                    <span className='Price !text-primary font-[600] text-[15px]'> 
                        $50.00
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductItem;
