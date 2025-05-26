import { Button } from '@mui/material'
import { RiMenu2Line } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';
import { GoRocket } from "react-icons/go";
import CategoryPanel from './Categorypanel';
import React, { useState } from 'react';
import './style.css'; 


const Navigation = () => {

  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(true);
  }

  return (
    <>
      <nav className='py-2 nav'>
        <div className='container flex items-center'>
          <div className='col_1 w-[20%]'>
            <Button className='!text-black gap-2 w-full' onClick={openCategoryPanel}><RiMenu2Line className='text-[18px]' />Shop By catagories <LiaAngleDownSolid className='text-[14px]' /></Button>

          </div>
          <div className="col_2 w-[60%]">
            <ul className='flex items center gap-4'>
              <li className='list-none '>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Home</Button></Link>
              </li>
              <li className='list-none relative'>
                <Link to='/' className='link transition text-[14px] font-[500]'><Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Fashion </Button></Link>
              <div className="submenu absolute top-[100%] left-[0%] min-w-[300px] bg-white shadow-md opacity-0 tansition-all">
                <ul> 
                  <li className='list-none w-full'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Men
                       <ul> 
                  <li className='list-none w-full'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Men</Button> 
                    </Link>
                  </li>
                  <li className='list-none'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Women</Button>
                    </Link> 
                  </li>
                  <li className='list-none'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Kids</Button> 
                    </Link>
                  </li>
                  <li className='list-none'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Girls</Button> 
                    </Link>
                  </li>
                  <li className='list-none'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Boys </Button> 
                    </Link>
                  </li>
                  
                </ul>
                      </Button> 
                    </Link>
                  </li>
                  <li className='list-none'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Women</Button>
                    </Link> 
                  </li>
                  <li className='list-none'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Kids</Button> 
                    </Link>
                  </li>
                  <li className='list-none'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Girls</Button> 
                    </Link>
                  </li>
                  <li className='list-none'>
                    <Link to='/' className='w-full'>
                    <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none'> Boys </Button> 
                    </Link>
                  </li>
                  
                </ul>
              </div>
              </li>
              <li className='list-none '>
                <Link to='/' className='link transition text-[14px] font-[500]'><Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Electronics </Button></Link>
              </li>
              <li className='list-none '>
                <Link to='/' className='link transition text-[14px] font-[500]'><Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Bags</Button></Link>
              </li>
              <li className='list-none '>
                <Link to='/' className='link transition text-[14px] font-[500]'><Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Footwear</Button></Link>
              </li>
              <li className='list-none '>
                <Link to='/' className='link transition text-[14px] font-[500]'><Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Groceries</Button></Link>
              </li>
              <li className='list-none '>
                <Link to='/' className='link transition text-[14px] font-[500]'><Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Beauty</Button></Link>
              </li>
              <li className='list-none '>
                <Link to='/' className='link transition text-[14px] font-[500]'><Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Wellness</Button></Link>
              </li>
              <li className='list-none '>
                <Link to='/' className='link transition text-[14px] font-[500]'><Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252]'>Jewellery</Button></Link>
              </li>
            </ul>
          </div>

          <div className="col_3 w-[20%] flex justify-end">
            <p className='text-[14px] font-[500] flex items-center gap-3 mb-0 mt-0'> <GoRocket className='text-[18px]' />Free International Delivery </p>
          </div>

        </div>
      </nav>

      <CategoryPanel openCategoryPanel={openCategoryPanel} isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel} />

    </>
  )
}

export default Navigation
