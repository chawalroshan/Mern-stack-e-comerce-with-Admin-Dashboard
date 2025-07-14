import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from "react-icons/go";
import Rating from '@mui/material/Rating';
import { IoCloseSharp } from "react-icons/io5";
import { Button } from '@mui/material';

const MyListItems = () => {
  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]">
      <div className="img w-[15%] rounded-md overflow-hidden">
        <Link to='/product/78675' className='group'>
          <img
            src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/133-large_default/customizable-mug.jpg'
            className='w-full group-hover:scale-105 transition-all'
            alt="Product"
          />
        </Link>
      </div>

      <div className="info w-[85%] relative">
        <IoCloseSharp className='cursor-pointer absolute top-0 right-0 text-[20px] link transition-all' />

        <span className='text-[13px]'>Soylent Green</span>
        <h3 className='text-[16px]'>
          <Link className='link'>Plastic Bamboo Dustpan & Brush Black</Link>
        </h3>
        <Rating name="size-small" defaultValue={4} size="small" readOnly />

       

        <div className='flex items-center gap-4 mt-2 mb-2'>
          <span className='Price !text-black font-[600] text-[14px]'>$50.00</span>
          <span className='oldPrice line-through text-gray-500 text-[14px] font-[500]'>$58.00</span>
          <span className='Price !text-primary font-[600] text-[14px]'>55% OFF</span>
        </div>


        <Button className='btn-org btn-sm'>Add to cart</Button>
      </div>
    </div>
  );
};

export default MyListItems;
