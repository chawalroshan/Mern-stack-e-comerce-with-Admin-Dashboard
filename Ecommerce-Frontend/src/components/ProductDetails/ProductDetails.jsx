import React, { useState } from 'react'
import QuantityBox from '../QuantityBox/QuantityBox';
import { Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";

const ProductDetailsComponent = () => {

    const [productActionIndex, setProductActionIndex] = useState(null);
    
  return (
    <>
      <h1 className="text-[24px] font-[600] mb-2">Brown Bear Printed Sweater</h1>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-[13px]">
                  Brands:
                  <span className="font-[500] text-black opacity-75"> Game of Thrones</span>
                </span>
                <Rating name="size-small" defaultValue={4} size="small" readOnly />
                <span className="text-[13px] cursor-pointer">Review</span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">$58.00</span>
                <span className="Price !text-primary font-[600] text-[20px]">$50.00</span>
                <span className="text-[14px]">
                  Available In Stock: <span className="text-green-600 font-bold">147 Items</span>
                </span>
              </div>

              <p className="mt-3 pr-10 mb-5">
                The sublimation textile printing process provides an exceptional color rendering and a color,
                guaranteed overtime praesentium voluptatum deleniti atque corrupti quos dolores.
              </p>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-[16px]">Size:</span>
                <div className="flex items-center gap-1 actions">
                  <Button className={productActionIndex === 0 ? '!bg-primary !text-white' : ''} onClick={() => setProductActionIndex(0)}>S</Button>
                  <Button className={productActionIndex === 1 ? '!bg-primary !text-white' : ''} onClick={() => setProductActionIndex(1)}>M</Button>
                  <Button className={productActionIndex === 2 ? '!bg-primary !text-white' : ''} onClick={() => setProductActionIndex(2)}>L</Button>
                  <Button className={productActionIndex === 3 ? '!bg-primary !text-white' : ''} onClick={() => setProductActionIndex(3)}>XL</Button>
                </div>
              </div>

              <p className="text-[14px] mb-4 text-black">Free Shipping (Est. Delivery Time 2-3 Days)</p>

              <div className="flex items-center gap-4 py-4">
                <div className="qtyboxWrapper w-[70px]">
                  <QuantityBox />
                </div>

                <Button className="btn-org flex gap-2">
                  Add to cart <MdOutlineShoppingCart className="text-[22px]" />
                </Button>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-[500]">
                  Add to Wishlist <FaRegHeart className="text-[18px]" />
                </span>
                <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-[500]">
                  Add to Compare <IoIosGitCompare className="text-[18px]" />
                </span>
              </div>
    </>
  )
}

export default ProductDetailsComponent
