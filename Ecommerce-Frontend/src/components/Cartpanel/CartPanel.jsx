import React from 'react'
import { Link } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';

const CartPanel = () => {
  return (
    <>
      <div className="scroll w-full max-h-[300px] overflow-y-auto overflow-x-hidden py-3 px-4">
        <div className="cartItem w-full flex items-center gap-4 border-b-[1px] border-[#e5e5e5] pb-3 mb-3">
          <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
            <Link to='/product/45875' className='block group'><img src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/25-home_default/hummingbird-printed-t-shirt.jpg' className='w-full group-hover:scale-105' /></Link>
          </div>

          <div className="info w-[75%] pr-5 relative">
            <h4 className='text-[14px] font-[500] mb-1'>
              <Link to='/product/45875' className='link transition-all'>
              Apple AirPods Max Over-Ear Wireless Headphone
              </Link>
            </h4>
            <p className='flex items-center gap-5 mt-2 mb-2'>
              <span>Qty: <span>2</span></span>
              <span className='text-primary font-bold'> Price : $25</span>
            </p>
            <MdDeleteOutline className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
          </div>
        </div>

        <div className="cartItem w-full flex items-center gap-4 border-b-[1px] border-[#e5e5e5] pb-3 mb-3">
          <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
            <Link to='/product/45875' className='block group'><img src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/25-home_default/hummingbird-printed-t-shirt.jpg' className='w-full group-hover:scale-105' /></Link>
          </div>

          <div className="info w-[75%] pr-5 relative">
            <h4 className='text-[14px] font-[500] mb-1'>
              <Link to='/product/45875' className='link transition-all'>
              Apple AirPods Max Over-Ear Wireless Headphone
              </Link>
            </h4>
            <p className='flex items-center gap-5 mt-2 mb-2'>
              <span>Qty: <span>2</span></span>
              <span className='text-primary font-bold'> Price : $25</span>
            </p>
            <MdDeleteOutline className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
          </div>
        </div>


        <div className="cartItem w-full flex items-center gap-4 border-b-[1px] border-[#e5e5e5] pb-3 mb-3">
          <div className="img w-[25%] overflow-hidden h-[80px] rounded-md">
            <Link to='/product/45875' className='block group'><img src='https://demos.codezeel.com/prestashop/PRS21/PRS210502/25-home_default/hummingbird-printed-t-shirt.jpg' className='w-full group-hover:scale-105' /></Link>
          </div>

          <div className="info w-[75%] pr-5 relative">
            <h4 className='text-[14px] font-[500] mb-1'>
              <Link to='/product/45875' className='link transition-all'>
              Apple AirPods Max Over-Ear Wireless Headphone
              </Link>
            </h4>
            <p className='flex items-center gap-5 mt-2 mb-2'>
              <span>Qty: <span>2</span></span>
              <span className='text-primary font-bold'> Price : $25</span>
            </p>
            <MdDeleteOutline className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all' />
          </div>
        </div>

       

        
      </div>



      <div className="bottomSection absolute bottom-[10px]  left-[10px] w-full pr-5">
        <div className='bottomIngo py-3 w-full px-4 border-t-[1px] border-[#e5e5e5] flex items-center justify-between flex-col '>
          <div className='w-full flex items-center justify-between mb-3'>
            <span className='text-[14px] font-[600]'>1 item</span>
            <span className='text-primary font-bold'>Total: $25</span>

          </div>

          <div className='w-full flex items-center justify-between'>
            <span className='text-[14px] font-[600]'>Shipping</span>
            <span className='text-primary font-bold'>$5</span>

          </div>

        </div>
        <div className='bottomIngo py-3 w-full px-4 border-t-[1px] border-[#e5e5e5] flex items-center justify-between flex-col '>
          <div className='w-full flex items-center justify-between mb-3'>
            <span className='text-[14px] font-[600]'>1 item</span>
            <span className='text-primary font-bold'> $250</span>

          </div>

          <div className='w-full flex items-center justify-between'>
            <span className='text-[14px] font-[600]'>Total(tax excl.)</span>
            <span className='text-primary font-bold'>$225</span>

          </div>

          <div className='w-full flex items-center justify-center gap-5 mt-3'>
            <Link to='/cart' className='w-[50%] d-block'><Button className='btn-org btn-lg w-full'>View cart</Button></Link>
            <Link to='/checkout' className='w-[50%] d-block'><Button className='btn-org btn-lg w-full'>Checkout</Button></Link>
          </div>

        </div>
      </div>




    </>
  )
}

export default CartPanel
