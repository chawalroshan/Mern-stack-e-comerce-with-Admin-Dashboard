import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';
import Search from '../Search/Search';
import Navigation from '../Navigation/Navigation';
import { MyContext } from '../../App';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {

const context = useContext(MyContext);

    return (
        <header>
            {/* Fixed top strip with proper padding */}
            <div className='top-strip py-2 border-t border-gray-200 border-b'>
                <div className='container mx-auto px-4'>
                    <div className='flex items-center justify-between'>
                        <div className='col1 w-[50%]'>
                            <p className='text-[14px] font-[500] mb-0'> 
                                Get upto 50% off new season styles, limited time only
                            </p>
                        </div>
                        <div className='col2 flex items-center justify-end'>
                            <ul className='flex items-center gap-3 mb-0'>
                                <li className='list-none'>
                                    <Link to='/help-center' className='text-[13px] font-[500] no-underline transition hover:text-blue-600'>
                                        Help center
                                    </Link>
                                    <span className='mx-2'>|</span>
                                    <Link to='/order-tracking' className='text-[13px] font-[500] no-underline transition hover:text-blue-600'>
                                        Order tracking
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed main header with proper padding */}
            <div className='header py-4 border-b border-gray-200'>
                <div className='container mx-auto px-4 flex items-center justify-between'>
                    <div className='col1 w-[25%]'>
                        <Link to={'/'} className='logo block'>
                            <img src="logo.jpg" alt="logo" className='max-h-10' />
                        </Link>
                    </div>
                    
                    <div className="col2 w-[45%]"> 
                        <Search/> 
                    </div>
                    
                    <div className="col3 w-[30%] flex items-center justify-end pl-7">
                        <ul className="flex items-center gap-3 mb-0">
                            <li className='list-none'>   
                                <Link to='/login' className='text-[15px] font-[500] text-black no-underline transition hover:text-blue-600'>
                                    Login
                                </Link> 
                                <span className='mx-2 text-gray-400'>|</span>
                                <Link to='/register' className='text-[15px] font-[500] no-underline transition hover:text-blue-600'>
                                    Register
                                </Link>
                            </li>

                            <li className='list-none'>
                                <Tooltip title="Compare">
                                    <IconButton aria-label="compare">
                                        <StyledBadge badgeContent={4} color="secondary">
                                            <IoIosGitCompare />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>

                            <li className='list-none'>
                                <Tooltip title="Wishlist">
                                    <IconButton aria-label="wishlist">
                                        <StyledBadge badgeContent={4} color="secondary">
                                            <FaRegHeart />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>

                            <li className='list-none'>
                                <Tooltip title="Cart">
                                    <IconButton aria-label="cart" onClick={() => context.setOpenCartPanel(true)}>
                                        <StyledBadge badgeContent={4} color="secondary">
                                            <MdOutlineShoppingCart/>
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Navigation/>
        </header>
    )
}

export default Header;