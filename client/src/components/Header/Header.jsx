import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';
import Search from '../Search/Search';
import Navigation from '../Navigation/Navigation';
import { FaRegUser } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { MyContext } from '../../App';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { fetchDataFromApi } from '../../utils/api';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
        padding: '0 4px',
        fontSize: '10px',
        height: '16px',
        minWidth: '16px',
    },
}));

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const context = useContext(MyContext);
    const navigate = useNavigate();

    // Get cart data from context
    const cartItemCount = context.getCartItemCount ? context.getCartItemCount() : 0;
    const cartTotal = context.getCartTotal ? context.getCartTotal() : 0;
    
    // Get wishlist data from context
    const wishlistCount = context.myList ? context.myList.length : 0;
    const hasWishlistItems = wishlistCount > 0;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleWishlistClick = () => {
        if (context.isLogin) {
            navigate('/my-list');
        } else {
            context.openAlertBox && context.openAlertBox({ 
                type: 'error', 
                msg: 'Please login to view your wishlist' 
            });
        }
    };

    const logout = () => {
        handleClose(); // Close menu first

        // Call logout API
        fetchDataFromApi('/api/user/logout', { withCredentials: true })
            .then((res) => {
                console.log('Logout response:', res);
                if (res?.success === true || res?.error === false) {
                    // Clear user data
                    context.setIsLogin && context.setIsLogin(false);
                    context.setUserData && context.setUserData(null);
                    
                    // Clear tokens from localStorage
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    
                    // Clear cart
                    context.clearCart && context.clearCart();
                    
                    // Clear wishlist
                    if (context.setMyList) {
                        context.setMyList([]);
                    }
                    
                    // Show success message
                    context.openAlertBox && context.openAlertBox({ 
                        type: 'success', 
                        msg: 'Logged out successfully!' 
                    });
                    
                    // Redirect to home
                    navigate('/');
                } else {
                    context.openAlertBox && context.openAlertBox({ 
                        type: 'error', 
                        msg: res?.message || 'Logout failed' 
                    });
                }
            })
            .catch(err => {
                console.error('Logout error:', err);
                // Still logout locally even if API fails
                context.setIsLogin && context.setIsLogin(false);
                context.setUserData && context.setUserData(null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                context.clearCart && context.clearCart();
                
                // Clear wishlist
                if (context.setMyList) {
                    context.setMyList([]);
                }
                
                context.openAlertBox && context.openAlertBox({ 
                    type: 'error', 
                    msg: 'Logged out (network error)' 
                });
                navigate('/');
            });
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `Rs.${amount ? amount.toFixed(2) : '0.00'}`;
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!context.userData?.name) return 'U';
        return context.userData.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Strip */}
            <div className='top-strip py-2 bg-gray-100 text-gray-600'>
                <div className='container mx-auto px-4'>
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0'>
                        <div className='col1 text-center sm:text-left'>
                            <p className='text-[13px] sm:text-[14px] font-[500] mb-0'>
                                🚚 Free shipping on orders over {formatCurrency(1000)}
                            </p>
                        </div>
                        <div className='col2'>
                            <ul className='flex items-center gap-3 mb-0 text-sm'>
                                <li className='list-none'>
                                    <Link 
                                        to='/help-center' 
                                        className='hover:text-gray-200 transition-colors text-[12px] sm:text-[13px]'
                                    >
                                        Help Center
                                    </Link>
                                    <span className='mx-2 opacity-70'>|</span>
                                    <Link 
                                        to='/order-tracking' 
                                        className='hover:text-gray-200 transition-colors text-[12px] sm:text-[13px]'
                                    >
                                        Order Tracking
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className='header py-3 sm:py-4'>
                <div className='container mx-auto px-4'>
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0'>
                        {/* Logo */}
                        <div className='col1 w-full sm:w-[25%] order-1 sm:order-1'>
                            <Link to={'/'} className='logo block'>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg sm:text-xl">M</span>
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">MannerStyle</h1>
                                        <p className="text-xs text-gray-500 hidden sm:block">Premium Shopping</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Search */}
                        <div className="col2 w-full sm:w-[40%] order-3 sm:order-2 mt-4 sm:mt-0">
                            <Search />
                        </div>

                        {/* User Actions */}
                        <div className="col3 w-full sm:w-[35%] order-2 sm:order-3">
                            <div className="flex items-center justify-end">
                                <ul className="flex items-center gap-2 sm:gap-3 mb-0">
                                    {/* Auth Links / User Menu */}
                                    {!context.isLogin ? (
                                        <li className='list-none'>
                                            <div className="flex items-center gap-2">
                                                <Link to='/login'>
                                                    <Button 
                                                        variant="outlined" 
                                                        size="small"
                                                        className="!border-primary !text-primary hover:!bg-primary hover:!text-white !text-xs sm:!text-sm"
                                                    >
                                                        Login
                                                    </Button>
                                                </Link>
                                                <Link to='/register'>
                                                    <Button 
                                                        variant="contained" 
                                                        size="small"
                                                        className="btn-org !text-xs sm:!text-sm"
                                                    >
                                                        Register
                                                    </Button>
                                                </Link>
                                            </div>
                                        </li>
                                    ) : (
                                        <>
                                            <li className='list-none'>
                                                <Button 
                                                    className='myAccountWrap flex items-center gap-2 !p-1 sm:!p-2 !rounded-full hover:!bg-gray-100'
                                                    onClick={handleClick}
                                                >
                                                    {/* User Avatar */}
                                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                                        {getUserInitials()}
                                                    </div>
                                                    
                                                    {/* Desktop Info */}
                                                    <div className='hidden sm:flex flex-col text-left'>
                                                        <h4 className='leading-3 text-[13px] !mb-0 !font-[500] capitalize truncate max-w-[120px]'>
                                                            {context?.userData?.name || 'User'}
                                                        </h4>
                                                        <span className='text-[11px] !font-[400] text-gray-500 truncate max-w-[120px]'>
                                                            {context?.userData?.email || ''}
                                                        </span>
                                                    </div>
                                                </Button>

                                                {/* User Dropdown Menu */}
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    id="account-menu"
                                                    open={open}
                                                    onClose={handleClose}
                                                    slotProps={{
                                                        paper: {
                                                            sx: {
                                                                width: 220,
                                                                mt: 1.5,
                                                            },
                                                        },
                                                    }}
                                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                                >
                                                    {/* User Info */}
                                                    <div className="px-3 py-2 border-b">
                                                        <p className="font-semibold text-sm truncate">
                                                            {context?.userData?.name || 'User'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {context?.userData?.email || ''}
                                                        </p>
                                                    </div>

                                                    {/* Menu Items */}
                                                    <Link to='/my-account' className='w-full block'>
                                                        <MenuItem onClick={handleClose} className='flex gap-3 !py-2'>
                                                            <FaRegUser className='text-[16px]' />
                                                            <span className='text-[14px]'>My Account</span>
                                                        </MenuItem>
                                                    </Link>
                                                    
                                                    <Link to='/orders' className='w-full block'>
                                                        <MenuItem onClick={handleClose} className='flex gap-3 !py-2'>
                                                            <IoBagCheckOutline className='text-[16px]' />
                                                            <span className='text-[14px]'>My Orders</span>
                                                        </MenuItem>
                                                    </Link>
                                                    
                                                    <Link to='/my-list' className='w-full block'>
                                                        <MenuItem onClick={handleClose} className='flex gap-3 !py-2'>
                                                            <FaRegHeart className='text-[16px]' />
                                                            <span className='text-[14px]'>
                                                                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                                                            </span>
                                                        </MenuItem>
                                                    </Link>

                                                    <MenuItem 
                                                        onClick={logout} 
                                                        className='flex gap-3 !py-2 !text-red-600 hover:!bg-red-50'
                                                    >
                                                        <IoIosLogOut className='text-[16px]' />
                                                        <span className='text-[14px]'>Logout</span>
                                                    </MenuItem>
                                                </Menu>
                                            </li>
                                        </>
                                    )}

                                    {/* Compare */}
                                    <li className='list-none'>
                                        <Tooltip title="Compare Products">
                                            <IconButton 
                                                aria-label="compare"
                                                size="small"
                                                className="!p-1 sm:!p-2"
                                            >
                                                <StyledBadge badgeContent={0} color="secondary">
                                                    <IoIosGitCompare className="text-lg sm:text-xl" />
                                                </StyledBadge>
                                            </IconButton>
                                        </Tooltip>
                                    </li>

                                    {/* Wishlist */}
                                    <li className='list-none'>
                                        <Tooltip title={context.isLogin ? "My Wishlist" : "Login to use wishlist"}>
                                            <IconButton 
                                                aria-label="wishlist"
                                                size="small"
                                                className="!p-1 sm:!p-2"
                                                onClick={handleWishlistClick}
                                            >
                                                <StyledBadge badgeContent={wishlistCount} color="secondary">
                                                    {hasWishlistItems ? (
                                                        <FaHeart className="text-lg sm:text-xl text-red-500" />
                                                    ) : (
                                                        <FaRegHeart className="text-lg sm:text-xl" />
                                                    )}
                                                </StyledBadge>
                                            </IconButton>
                                        </Tooltip>
                                    </li>

                                    {/* Cart */}
                                    <li className='list-none'>
                                        <Tooltip title={`Cart: ${formatCurrency(cartTotal)}`}>
                                            <IconButton 
                                                aria-label="cart" 
                                                onClick={() => context.setOpenCartPanel && context.setOpenCartPanel(true)}
                                                size="small"
                                                className="!p-1 sm:!p-2 relative"
                                            >
                                                <StyledBadge badgeContent={cartItemCount} color="secondary">
                                                    <MdOutlineShoppingCart className="text-lg sm:text-xl" />
                                                </StyledBadge>
                                                
                                                {/* Cart Total on Desktop */}
                                                {/* <div className="hidden sm:block ml-2">
                                                    <div className="text-right">
                                                        <div className="text-xs font-semibold text-gray-800">
                                                            {formatCurrency(cartTotal)}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500">
                                                            {cartItemCount} item{cartItemCount !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </IconButton>
                                        </Tooltip>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <Navigation />
        </header>
    )
}

export default Header;