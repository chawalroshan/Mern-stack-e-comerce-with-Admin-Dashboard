import React from 'react'
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




const Footer = () => {
  return (
    <>
    <footer className='py-6 bg-[#f1f1f1]'> 
      <div className='container'>
        <div className='flex items-center justify-center  gap-5 py-8 pb-5'>
            <div className='col flex items-center justify-center flex-col group w-[15%]'>
                <LiaShippingFastSolid className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1'/>
                <h3 className='text-[16px] font-[600]'>Free Shipping</h3>
                <p className='text-[12px] font-[500]'>For all orders over $100</p>
            </div>

            <div className='col flex items-center justify-center flex-col group w-[15%]'>
                <PiKeyReturnThin className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1'/>
                <h3 className='text-[16px] font-[600]'>30 Days Returns</h3>
                <p className='text-[12px] font-[500]'>For an Exchange Product</p>
            </div>

            <div className='col flex items-center justify-center flex-col group w-[15%]'>
                <LiaWalletSolid className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1'/>
                <h3 className='text-[16px] font-[600]'>Secured Payment</h3>
                <p className='text-[12px] font-[500]'>Payment Cards Accepted</p>
            </div>


            <div className='col flex items-center justify-center flex-col group w-[15%]'>
                <PiGiftLight className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1'/>
                <h3 className='text-[16px] font-[600]'>Special Gifts</h3>
                <p className='text-[12px] font-[500]'>Our First Product Order</p>
            </div>

            <div className='col flex items-center justify-center flex-col group w-[15%]'>
                < BiSupport className='text-[50px] transition-all duration-300 group-hover:text-primary group-hover:-translate-y-1'/>
                <h3 className='text-[16px] font-[600]'>Support 24/7</h3>
                <p className='text-[12px] font-[500]'>Contact us Anytime</p>
            </div>

          
        </div>

        <br/>

        <hr/>

        <div className='footer flex py-8 '>
            <div className='part1 w-[25%] border-r border-[#4c4c4c] '>
                <h2 className='text-[18px] font-[600] mb-4'>Contact us</h2>
                <p className='text-[13px] font-[400]'> Classyshop - Mega Super Store <br/> 507-Union Trade Centre France</p>
                <Link className='link text-[13px] text-black' to='mailto:someone@example.com'>sales@virtualcompany.com</Link>
                <span className='text-[22px] font-[600] block w-full'>(+977) 9843863054</span>
                <div className='flex items-center'>
                    <IoChatboxOutline className='text-[20px] text-primary mr-2' />
                    <span className='text-[16px] font-[600]'>Chat with us <br/>
                    Get Expert Help</span>
                </div>
            </div>
        

        <div className='part2 w-[40%] flex pl-5 '>
            <div className='part2_col1 w-[50%]'>
                <h2 className='text-[20px] font-[600] mb-4'>Products</h2>

                <ul className='list'>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Price drop</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> New Products</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Best sales</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> contact us</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Sitemap</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Stores</Link>
                    </li>
                </ul>

            </div>
        </div>

        <div className='part2 w-[35%] flex '>
            <div className='part2_col2 w-[50%]'>
                <h2 className='text-[18px] font-[600] mb-4'>Our Company</h2>

                <ul className='list'>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Delivery</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Legal notice</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Terms and conditions</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> About us</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Secure payment</Link>
                    </li>
                    <li className='list-none text-[14px] w-full mb-2'>
                        <Link to='/' className='link'> Login</Link>
                    </li>
                </ul>

            </div>
        </div>

        <div className='part2 w-[35%] flex '>
            <div className='part2_col2 w-[50%]'>
                <h2 className='text-[18px] font-[600] mb-4'>Subscribe to newsletter</h2>
                <p className='text-[13px] font-[400] mb-4'>Get E-mail updates about our latest shop and special offers.</p>
                <form className='mt-5'>
                    <input type='email' placeholder='Your Email Address' className='w-full h-[45px] border outline-none pl-4 pr-4 rounded-sm mb-4 focus:border-[rgba(0.0.0.9)]' />
                    <Button className='btn-org'>SUBSCRIBE</Button>

                    <FormControlLabel control={<Checkbox  />} label=" I agree to the terms and conditions and the privacy policy" />
                </form>
                

            </div>
        </div>

</div>
      </div>
    </footer>

    <div className='bottomStrip border-t border-[rgba(0,0,0,0.2)] py-3 bg-white'>
        <div className='container flex items-center justify-between'>
            <ul className='flex items-center gap-3'>
                <li className='list-none'>
                    <Link to='/' target='' className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center  group hover:bg-primary transition-all duration-300'>
                    <FaFacebookF className='text-[15px] group-hover:text-white '/>
                    </Link>
                </li>

                    <li className='list-none'>
                    <Link to='/' target='' className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center  group hover:bg-primary transition-all duration-300'>
                    < FaYoutube className='text-[15px] group-hover:text-white '/>
                    </Link>
                </li>

                <li className='list-none'>
                    <Link to='/' target='' className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center  group hover:bg-primary transition-all duration-300'>
                    <BsTwitterX className='text-[15px] group-hover:text-white '/>
                    </Link>
                </li>

                <li className='list-none'>
                    <Link to='/' target='' className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center  group hover:bg-primary transition-all duration-300'>
                    <FaInstagram className='text-[15px] group-hover:text-white '/>
                    </Link>
                </li>
                
                <li className='list-none'>
                    <Link to='/' target='_blank' className='w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center  group hover:bg-primary transition-all duration-300'>
                    <FaWhatsapp className='text-[15px] group-hover:text-white '/>
                    </Link>
                </li>
            </ul>

            <p className='text-[13px] text-center mb-0'>© 2024 - Ecommerce Template</p>

            <div className='paymentMethods flex items-center  gap-2'>
                <img src='https://ecommerce-frontend-view.netlify.app/carte_bleue.png' alt='Payment Methods' className='w-[50px]' /> 
                 <img src='https://ecommerce-frontend-view.netlify.app/visa.png' alt='Payment Methods' className='w-[50px]' /> 
                  <img src='https://ecommerce-frontend-view.netlify.app/master_card.png' alt='Payment Methods' className='w-[50px]' /> 
                   <img src='https://ecommerce-frontend-view.netlify.app/american_express.png' alt='Payment Methods' className='w-[50px]' /> 
                    <img src='https://ecommerce-frontend-view.netlify.app/paypal.png' alt='Payment Methods' className='w-[50px]' /> 

            </div>

        </div>

    </div>

    

    </>
  )
}

export default Footer;
