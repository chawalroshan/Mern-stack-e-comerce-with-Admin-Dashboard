import React, { useContext, useState, useEffect } from 'react'
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturnThin } from "react-icons/pi";
import { LiaWalletSolid } from "react-icons/lia";
import { PiGiftLight } from "react-icons/pi";
import { BiSupport } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { IoChatboxOutline } from "react-icons/io5";
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import Drawer from '@mui/material/Drawer';
import CartPanel from '../Cartpanel/CartPanel'
import { MyContext } from '../../App';
import { IoClose } from "react-icons/io5"
import { fetchDataFromApi, postData } from '../../utils/api';
import toast from 'react-hot-toast';

const Footer = () => {
    const context = useContext(MyContext);
    const [email, setEmail] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [siteInfo, setSiteInfo] = useState(null);
    const [socialLinks, setSocialLinks] = useState({
        facebook: '#',
        youtube: '#',
        twitter: '#',
        instagram: '#',
        whatsapp: '#'
    });

    // Fetch site information on component mount
    useEffect(() => {
        fetchSiteInformation();
    }, []);

    const fetchSiteInformation = async () => {
        try {
            // You can create an API endpoint for site settings or use a default object
            const response = await fetchDataFromApi('/api/site/settings');
            if (response.success && response.data) {
                setSiteInfo(response.data);
                if (response.data.socialLinks) {
                    setSocialLinks(response.data.socialLinks);
                }
            } else {
                // Fallback to default info if API fails
                setSiteInfo({
                    storeName: "Classyshop - Mega Super Store",
                    address: "507-Union Trade Centre France",
                    email: "sales@virtualcompany.com",
                    phone: "(+977) 9843863054",
                    supportHours: "24/7",
                    copyright: `© ${new Date().getFullYear()} - Ecommerce Template`
                });
            }
        } catch (error) {
            console.error('Error fetching site info:', error);
            // Default info
            setSiteInfo({
                storeName: "Classyshop - Mega Super Store",
                address: "507-Union Trade Centre France",
                email: "sales@virtualcompany.com",
                phone: "(+977) 9843863054",
                supportHours: "24/7",
                copyright: `© ${new Date().getFullYear()} - Ecommerce Template`
            });
        }
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        if (!agreeTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            const response = await postData('/api/newsletter/subscribe', { email });

            if (response.success) {
                toast.success('Subscribed successfully!');
                setEmail('');
                setAgreeTerms(false);
            } else {
                toast.error(response.message || 'Failed to subscribe');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const supportFeatures = [
        {
            icon: <LiaShippingFastSolid className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1' />,
            title: "Free Shipping",
            description: "For all orders over $100"
        },
        {
            icon: <PiKeyReturnThin className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1' />,
            title: "30 Days Returns",
            description: "For an Exchange Product"
        },
        {
            icon: <LiaWalletSolid className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1' />,
            title: "Secured Payment",
            description: "Payment Cards Accepted"
        },
        {
            icon: <PiGiftLight className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1' />,
            title: "Special Gifts",
            description: "Our First Product Order"
        },
        {
            icon: <BiSupport className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1' />,
            title: "Support 24/7",
            description: "Contact us Anytime"
        }
    ];

    const productLinks = [
        { name: "Price Drop", path: "/products?sort=discount" },
        { name: "New Products", path: "/products?sort=newest" },
        { name: "Best Sales", path: "/products?sort=popular" },
        { name: "Featured Products", path: "/products?featured=true" },
        { name: "All Categories", path: "/categories" },
        { name: "Contact Us", path: "/contact" }
    ];

    const companyLinks = [
        { name: "Delivery Information", path: "/delivery" },
        { name: "Legal Notice", path: "/legal" },
        { name: "Terms & Conditions", path: "/terms" },
        { name: "About Us", path: "/about" },
        { name: "Secure Payment", path: "/payment-security" },
        { name: "Login / Register", path: context.isLogin ? "/my-account" : "/login" }
    ];

    const paymentMethods = [
        { name: "Visa", image: "https://ecommerce-frontend-view.netlify.app/visa.png" },
        { name: "Mastercard", image: "https://ecommerce-frontend-view.netlify.app/master_card.png" },
        { name: "American Express", image: "https://ecommerce-frontend-view.netlify.app/american_express.png" },
        { name: "PayPal", image: "https://ecommerce-frontend-view.netlify.app/paypal.png" },
        { name: "Carte Bleue", image: "https://ecommerce-frontend-view.netlify.app/carte_bleue.png" }
    ];

    const socialMedia = [
        { name: "Facebook", icon: <FaFacebookF className='text-[15px] group-hover:text-white' />, link: socialLinks.facebook },
        { name: "YouTube", icon: <FaYoutube className='text-[15px] group-hover:text-white' />, link: socialLinks.youtube },
        { name: "Twitter", icon: <BsTwitterX className='text-[15px] group-hover:text-white' />, link: socialLinks.twitter },
        { name: "Instagram", icon: <FaInstagram className='text-[15px] group-hover:text-white' />, link: socialLinks.instagram },
        { name: "WhatsApp", icon: <FaWhatsapp className='text-[15px] group-hover:text-white' />, link: socialLinks.whatsapp }
    ];

    // Calculate cart items count
    const cartItemCount = context.cart ? context.cart.reduce((total, item) => total + (item.quantity || 1), 0) : 0;

    return (
        <>
            <footer className='py-6 bg-[#f1f1f1]'>
                <div className='container'>
                    {/* Support Features Section */}
                    <div className='flex items-center justify-center gap-5 py-8 pb-5 '>
                        {supportFeatures.map((feature, index) => (
                            <div key={index} className='col flex items-center justify-center flex-col group w-full md:w-[19%] mb-4 md:mb-0'>
                                {feature.icon}
                                <h3 className='text-[16px] font-[600] mt-2'>{feature.title}</h3>
                                <p className='text-[12px] font-[500] text-center'>{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    <hr className='my-4' />

                    {/* Main Footer Content */}
                    <div className='footer flex flex-col md:flex-row py-8'>
                        {/* Contact Information */}
                        <div className='part1 w-full md:w-[25%] mb-6 md:mb-0 md:border-r border-[#4c4c4c] md:pr-6'>
                            <h2 className='text-[18px] font-[600] mb-4'>Contact us</h2>
                            <p className='text-[13px] font-[400] mb-2'>
                                {siteInfo?.storeName || "Classyshop - Mega Super Store"}
                                <br />
                                {siteInfo?.address || "507-Union Trade Centre France"}
                            </p>
                            <Link
                                className='link text-[13px] text-black hover:text-primary block mb-2'
                                to={`mailto:${siteInfo?.email || 'sales@virtualcompany.com'}`}
                            >
                                {siteInfo?.email || 'sales@virtualcompany.com'}
                            </Link>
                            <span className='text-[18px] font-[600] block w-full mb-4'>
                                {siteInfo?.phone || '(+977) 9843863054'}
                            </span>
                            <div className='flex items-center'>
                                <IoChatboxOutline className='text-[20px] text-primary mr-2' />
                                <span className='text-[14px] font-[600]'>
                                    Chat with us <br />
                                    <span className='text-[12px] font-normal'>Get Expert Help</span>
                                </span>
                            </div>
                        </div>

                        {/* Products Links */}
                        <div className='part2 w-full md:w-[20%] mb-6 md:mb-0 md:px-6'>
                            <h2 className='text-[18px] font-[600] mb-4'>Products</h2>
                            <ul className='list flex flex-col items-start'>
                                {productLinks.map((link, index) => (
                                    <li key={index} className='list-none text-[14px] w-full mb-2'>
                                        <Link
                                            to={link.path}
                                            className='link hover:text-primary transition-colors'
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div className='part2 w-full md:w-[20%] mb-6 md:mb-0 md:px-6'>
                            <h2 className='text-[18px] font-[600] mb-4'>Our Company</h2>
                            <ul className='list'>
                                {companyLinks.map((link, index) => (
                                    <li key={index} className='list-none text-[14px] w-full mb-2'>
                                        <Link
                                            to={link.path}
                                            className='link hover:text-primary transition-colors'
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter Subscription */}
                        <div className='part2 w-full md:w-[35%] md:px-6'>
                            <h2 className='text-[18px] font-[600] mb-4'>Subscribe to newsletter</h2>
                            <p className='text-[13px] font-[400] mb-4'>
                                Get E-mail updates about our latest shop and special offers.
                            </p>

                            <form onSubmit={handleSubscribe} className="text-left">
                                <input
                                    type='email'
                                    placeholder='Your Email Address'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full h-[45px] border outline-none pl-4 pr-4 rounded-sm mb-4 focus:border-primary'
                                    required
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={agreeTerms}
                                            onChange={(e) => setAgreeTerms(e.target.checked)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <span className='text-[12px]'>
                                            I agree to the
                                            <Link to="/terms" className='text-blue-600 hover:underline mx-1'>
                                                terms and conditions
                                            </Link>
                                            and the
                                            <Link to="/privacy" className='text-blue-600 hover:underline mx-1'>
                                                privacy policy
                                            </Link>
                                        </span>
                                    }
                                    className="mb-3"
                                />

                                <Button
                                    type='submit'
                                    className='btn-org'
                                    disabled={loading}
                                >
                                    {loading ? 'Subscribing...' : 'SUBSCRIBE'}
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </footer>

            {/* Bottom Strip */}
            <div className='bottomStrip border-t border-[rgba(0,0,0,0.2)] py-3 bg-white'>
                <div className='container flex flex-col md:flex-row items-center justify-between gap-4'>
                    {/* Social Media Links */}
                    <ul className='flex items-center gap-3'>
                        {socialMedia.map((social, index) => (
                            <li key={index} className='list-none'>
                                <Link
                                    to={social.link}
                                    target='_blank'
                                    className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center group hover:bg-primary transition-all duration-300'
                                >
                                    {social.icon}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Copyright */}
                    <p className='text-[13px] text-center mb-0'>
                        {siteInfo?.copyright || `© ${new Date().getFullYear()} - Ecommerce Template`}
                    </p>

                    {/* Payment Methods */}
                    <div className='paymentMethods flex items-center gap-2'>
                        {paymentMethods.map((method, index) => (
                            <img
                                key={index}
                                src={method.image}
                                alt={method.name}
                                className='w-[40px] md:w-[50px]'
                                title={method.name}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Drawer */}
            <Drawer
                open={context.openCartPanel}
                onClose={context.toggleCartPanel(false)}
                anchor='right'
                className='cartPanel'
                PaperProps={{
                    sx: { width: { xs: '100%', sm: 400 } }
                }}
            >
                <div className='flex items-center justify-between py-3 px-4 gap-3 border-b border-gray-200'>
                    <h4 className='font-semibold'>
                        Shopping Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
                    </h4>
                    <IoClose
                        className='text-[20px] cursor-pointer hover:text-red-500 transition-colors'
                        onClick={context.toggleCartPanel(false)}
                    />
                </div>

                <CartPanel />
            </Drawer>
        </>
    );
}

export default Footer;