import React, { useContext, useState } from 'react'
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
import { FaRegUser } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { MyContext } from '../../App';


import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';



const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {

     const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
                    
                    <div className="col2 w-[40%]"> 
                        <Search/> 
                    </div>
                    
                    <div className="col3 w-[35%] flex items-center justify-end pl-7">
                        
                        <ul className="flex items-center gap-3 mb-0 w-full">
                            {
                            context.isLogin === false ?  <li className='list-none'>   
                                <Link to='/login' className='text-[15px] font-[500] text-black no-underline transition hover:text-blue-600'>
                                    Login
                                </Link> 
                                <span className='mx-2 text-gray-400'>|</span>
                                <Link to='/register' className='text-[15px] font-[500] no-underline transition hover:text-blue-600'>
                                    Register
                                </Link>
                            </li>

                            :

                            (
                                <>
                                <Button className='myAccountWrap flex items-center gap-3 cursor-pointer !text-[#000]' onClick={handleClick}>
                                    <Button className='!w-[40] !h-[40px] !min-w-[40px] !rounded-full !bg-white '><FaRegUser className='text-[16px] text-[rgba(0,0,0,0.7)]'/></Button>

                                    <div className='info flex flex-col'>
                                        <h4 className='leading-3 text-[14px] !mb-0 !font-[500] text-left justify-start capitalize'>Roshan Chawal</h4>
                                        <span className='text-[13px] !font-[400] capitalize'>chawalroshan@gmail.com</span>

                                    </div>

                                </Button>

                                <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link to='/my-account' className='w-full block'>
        <MenuItem onClick={handleClose} className='flex gap-2 !py-2'>
          <FaRegUser className='text-[18px]'/> <span className='text-[14px]'>My Account</span>
        </MenuItem>
        </Link>
        <Link to='/orders' className='w-full block'>
        <MenuItem onClick={handleClose} className='flex gap-2 !py-2'>
          <IoBagCheckOutline className='text-[18px]'/> <span className='text-[14px]'>Orders</span>
        </MenuItem>
        </Link>
        <Link to='/my-list' className='w-full block'>
        <MenuItem onClick={handleClose} className='flex gap-2 !py-2'>
          <FaRegHeart className='text-[18px]'/><span className='text-[14px]'>My List</span>
        </MenuItem>
        </Link>
        
        <MenuItem onClick={handleClose} className='flex gap-2 !py-2'>
          <IoIosLogOut className='text-[18px]'/> <span className='text-[14px]'>Logout</span>
        </MenuItem>
       
       
      </Menu>
                                </>
                            )
                        }
                           

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