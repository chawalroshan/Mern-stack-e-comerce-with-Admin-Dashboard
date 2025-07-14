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
      <nav className='nav'>
        <div className='container flex items-center'>
          <div className='col_1 w-[20%]'>
            <Button className='!text-black gap-2 w-full' onClick={openCategoryPanel}>
              <RiMenu2Line className='text-[18px]' />
              Shop By catagories 
              <LiaAngleDownSolid className='text-[14px]' />
            </Button>
          </div>
          
          <div className="col_2 w-[60%]">
            <ul className='flex items-center gap-4'>
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Home
                  </Button>
                </Link>
              </li>
              
              {/* Fashion with Multi-level Dropdown */}
              <li className='list-none relative group'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Fashion
                  </Button>
                </Link>
                
                {/* Main Submenu */}
                <div className="submenu absolute top-full left-0 min-w-[200px] !bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 " style={{backgroundColor: 'white'}}>
                  <ul className='py-2'>
                    {/* Men with nested submenu */}
                    <li className='list-none w-full relative group/men'>
                      <Link to='/men' className='w-full block'>
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-3 !px-4 hover:!bg-gray-100 !normal-case'>
                          Men
                        </Button>
                      </Link>
                      
                      {/* Nested submenu for Men */}
                      <div className="absolute left-full top-0 min-w-[150px] !bg-white shadow-lg opacity-0 invisible group-hover/men:opacity-100 group-hover/men:visible transition-all duration-300 z-50 " style={{backgroundColor: 'white'}}>
                        <ul className='py-2'>
                          <li className='list-none w-full'>
                            <Link to='/men/jeans' className='w-full block'>
                              <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-2 !px-4 hover:!bg-gray-100 !normal-case'>
                                Jeans
                              </Button>
                            </Link>
                          </li>
                          <li className='list-none w-full'>
                            <Link to='/men/shirts' className='w-full block'>
                              <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-2 !px-4 hover:!bg-gray-100 !normal-case'>
                                Shirts
                              </Button>
                            </Link>
                          </li>
                          <li className='list-none w-full'>
                            <Link to='/men/formal' className='w-full block'>
                              <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-2 !px-4 hover:!bg-gray-100 !normal-case'>
                                Formal
                              </Button>
                            </Link>
                          </li>
                          <li className='list-none w-full'>
                            <Link to='/men/shoes' className='w-full block'>
                              <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-2 !px-4 hover:!bg-gray-100 !normal-case'>
                                Shoes
                              </Button>
                            </Link>
                          </li>
                          <li className='list-none w-full'>
                            <Link to='/men/accessories' className='w-full block'>
                              <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-2 !px-4 hover:!bg-gray-100 !normal-case'>
                                Accessories
                              </Button>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    
                    {/* Women */}
                    <li className='list-none w-full'>
                      <Link to='/women' className='w-full block'>
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-3 !px-4 hover:!bg-gray-100 !normal-case'>
                          Women
                        </Button>
                      </Link>
                    </li>
                    
                    {/* Kids */}
                    <li className='list-none w-full'>
                      <Link to='/kids' className='w-full block'>
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-3 !px-4 hover:!bg-gray-100 !normal-case'>
                          Kids
                        </Button>
                      </Link>
                    </li>
                    
                    {/* Girls */}
                    <li className='list-none w-full'>
                      <Link to='/girls' className='w-full block'>
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-3 !px-4 hover:!bg-gray-100 !normal-case'>
                          Girls
                        </Button>
                      </Link>
                    </li>
                    
                    {/* Boys */}
                    <li className='list-none w-full'>
                      <Link to='/boys' className='w-full block'>
                        <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-3 !px-4 hover:!bg-gray-100 !normal-case'>
                          Boys
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Electronics
                  </Button>
                </Link>
              </li>
              
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Bags
                  </Button>
                </Link>
              </li>
              
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Footwear
                  </Button>
                </Link>
              </li>
              
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Groceries
                  </Button>
                </Link>
              </li>
              
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Beauty
                  </Button>
                </Link>
              </li>
              
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Wellness
                  </Button>
                </Link>
              </li>
              
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Jewellery
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          <div className="col_3 w-[20%] flex justify-end">
            <p className='text-[14px] font-[500] flex items-center gap-3 mb-0 mt-0'>
              <GoRocket className='text-[18px]' />
              Free International Delivery
            </p>
          </div>
        </div>
      </nav>

      <CategoryPanel 
        openCategoryPanel={openCategoryPanel} 
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel} 
      />
    </>
  )
}

export default Navigation