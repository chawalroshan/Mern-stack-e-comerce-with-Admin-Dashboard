import React, { useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom'
import ProductZoom from '../../components/ProductZoom/ProductZoom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import QuantityBox from '../../components/QuantityBox/QuantityBox';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGitCompare } from "react-icons/io";
import TextField from '@mui/material/TextField';
import ProductSlider from '../../components/ProductSlider/ProductSlider';

const ProductDetails = () => {

  const [productActionIndex, setProductActionIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <div className='py-5'>
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/" className='link transition'>
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/material-ui/getting-started/installation/"
              className='link transition'
            >
              Fashion
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/material-ui/getting-started/installation/"
              className='link transition'
            >
              Brown jacket
            </Link>

          </Breadcrumbs>
        </div>

        <section className='bg-white py-5 mt-4'>
          <div className="container flex items-center gap-8">
            <div className="productZoomContainer w-[40%] ">
              <ProductZoom />
            </div>

            <div className="productContent w-[60%] pr-10 pl-10">
              <h1 className='text-[24px] font-[600] mb-2'>Brown Bear Printed Sweater</h1>
              <div className='flex items-center gap-2 '>
                <span className='text-gray-400 text-[13px]'>Brands:<span className='font-[500] text-black opacity75'> Game of thrones</span>

                </span>
                <Rating name="size-small" defaultValue={4} size="small" readOnly />
                <span className='text-[13px] cursor-pointer'>Review</span>
              </div>
              <div className='flex items-center gap-4'>
                <span className='oldPrice line-through text-gray-500 text-[20px] font-[500]'>
                  $58.00
                </span>

                <span className='Price !text-primary font-[600] text-[20px]'>
                  $50.00
                </span>
                <span className='text-[14px]'>Avilable In Stock:<span className='text-green-600 font-bold'>147 Items</span></span>
              </div>

              <p className='mt-3 pr-10 mb-5'>The sublimation textile printing process provides an exceptional color rendering and a color, guaranteed overtime praesentium voluptatum deleniti atque corrupti quos dolores.</p>

              <div className='flex items-center gap-3 mb-5'>
                <span className='text-[16px]'>Size:</span>
                <div className='flex items-center gap-1 actions'>
                  <Button className={`${productActionIndex === 0 ? '!bg-primary !text-white' : ''}`} onClick={() => setProductActionIndex(0)}>S</Button>
                  <Button className={`${productActionIndex === 1 ? '!bg-primary !text-white' : ''}`} onClick={() => setProductActionIndex(1)}>M</Button>
                  <Button className={`${productActionIndex === 2 ? '!bg-primary !text-white' : ''}`} onClick={() => setProductActionIndex(2)}>L</Button>
                  <Button className={`${productActionIndex === 3 ? '!bg-primary !text-white' : ''}`} onClick={() => setProductActionIndex(3)}>Xl</Button>

                </div>
                {/* Separated group below */}
                <p className='text-[14px] mt-5 mb-4 text-black'>Free Shipping (Est. Delivery Time 2-3 Days)</p>

                <div className='flex items-center gap-4 py-4'>
                  <div className='qtyboxWrapper w-[70px]'>
                    <QuantityBox />
                  </div>

                  <Button className='btn-org flex gap-2'>
                    Add to cart <MdOutlineShoppingCart className='text-[22px]' />
                  </Button>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <span className='flex items-center gap-2 text-[15px] link cursor-pointer font-[500]'>Add to Wishlist <FaRegHeart className='text-[18px]' /></span>
                  <span className='flex items-center gap-2 text-[15px] link cursor-pointer font-[500]'>Add to Compare <IoIosGitCompare className='text-[18px]' /></span>

                </div>


              </div>
            </div>
          </div>

          <div className="container pt-10">
            <div className='flex items-center gap-8'>
              <span className={`link text-[17px] cursor-pointer font-[500] ${activeTab === 0 && 'text-primary'}`} onClick={() => setActiveTab(0)}>Descriiption</span>
              <span className={`link text-[17px] cursor-pointer font-[500] ${activeTab === 1 && 'text-primary'}`} onClick={() => setActiveTab(1)}>Product Details</span>
              <span className={`link text-[17px] cursor-pointer font-[500] ${activeTab === 2 && 'text-primary'}`} onClick={() => setActiveTab(2)}>Reviews (5)</span>

            </div>

            {
              activeTab === 0 && (

                <div className='shadow-md w-full px-5 py-8 rounded-md '>
                  <p>Studio Design' PolyFaune collection features classic products with colorful patterns, inspired by the traditional japanese origamis. To wear with a chino or jeans. The sublimation textile printing process provides an exceptional color rendering and a color, guaranteed overtime.</p>
                  <h4>Packaging & Delivery</h4>
                  <p>Less lion goodness that euphemistically robin expeditiously bluebird smugly scratched far while thus cackled sheepishly rigid after due one assenting regarding censorious while occasional or this more crane went more as this less much amid overhung anathematic because much held one exuberantly sheep goodness so where rat wry well concomitantly.</p>
                  <h4>Suggested Use</h4>
                  <p>Less lion goodness that euphemistically robin expeditiously bluebird smugly scratched far while thus cackled sheepishly rigid after due one assenting regarding censorious while occasional or this more crane went more as this less much amid overhung anathematic because much held one exuberantly sheep goodness so where rat wry well concomitantly.</p>
                  <h4>Suggested Use</h4>
                  <p>Studio Design' PolyFaune collection features classic products with colorful patterns, inspired by the traditional japanese origamis. </p>

                </div>
              )
            }

            {
              activeTab === 1 && (

                <div className='shadow-md w-full px-5 py-8 rounded-md '>
                  <div class="relative overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                      <thead class="text-xs text-gray-900 uppercase bg-gray-100">
                        <tr>
                          <th scope="col" class="px-6 py-3">
                            Product name
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Color
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Category
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="bg-white">
                          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Apple MacBook Pro 17"
                          </th>
                          <td class="px-6 py-4">Silver</td>
                          <td class="px-6 py-4">Laptop</td>
                          <td class="px-6 py-4">$2999</td>
                        </tr>
                        <tr class="bg-white">
                          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Microsoft Surface Pro
                          </th>
                          <td class="px-6 py-4">White</td>
                          <td class="px-6 py-4">Laptop PC</td>
                          <td class="px-6 py-4">$1999</td>
                        </tr>
                        <tr class="bg-white">
                          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Magic Mouse 2
                          </th>
                          <td class="px-6 py-4">Black</td>
                          <td class="px-6 py-4">Accessories</td>
                          <td class="px-6 py-4">$99</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              )
            }

            {
              activeTab === 2 && (
                <div className='shadow-md w-full px-5 py-8 rounded-md '>
                  <div className='w-full productReviewContainer'>
                    <h2 className='text-[18px]'>Customer Questions and answers</h2>
                    <div className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden mt-5 pr-5">
                      <div className="review pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between ">
                        <div className="info w-[60%] flex items-center gap-2">
                          <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                            <img src='data:image/png;base64,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' alt='User Avatar' className='w-full' />
                          </div>

                          <div className='w-[80%]'>
                            <h4 className='text-[16px]'>John Doe</h4>
                            <h5 className='text-[13px] mb-0'>2022-4-8</h5>

                            <p className='text-gray-500 text-[14px] mt-0 mb-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                          </div>

                          <Rating name="size-small" defaultValue={4} readOnly />

                        </div>
                      </div>

                      <div className="review pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between ">
                        <div className="info w-[60%] flex items-center gap-2">
                          <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                            <img src='data:image/png;base64,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' alt='User Avatar' className='w-full' />
                          </div>

                          <div className='w-[80%]'>
                            <h4 className='text-[16px]'>John Doe</h4>
                            <h5 className='text-[13px] mb-0'>2022-4-8</h5>

                            <p className='text-gray-500 text-[14px] mt-0 mb-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                          </div>

                          <Rating name="size-small" defaultValue={4} readOnly />

                        </div>
                      </div>

                      <div className="review pt-5 border-b border-[rgba(0,0,0,0.1)] w-full flex items-center justify-between ">
                        <div className="info w-[60%] flex items-center gap-2">
                          <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                            <img src='data:image/png;base64,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' alt='User Avatar' className='w-full' />
                          </div>

                          <div className='w-[80%]'>
                            <h4 className='text-[16px]'>John Doe</h4>
                            <h5 className='text-[13px] mb-0'>2022-4-8</h5>

                            <p className='text-gray-500 text-[14px] mt-0 mb-0'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                          </div>

                          <Rating name="size-small" defaultValue={4} readOnly />

                        </div>

                      </div>

                      <br />

                      <div className="reviewForm bg-[#fafafa] p-5 rounded-lg">
                        <h2>Add a Review</h2>
                        <form className='flex flex-col gap-3 mt-3'>
                          <TextField
                            id="outlined-multiline-flexible"
                            label="Write a review..."
                            multiline
                            rows={5}
                            className='w-full'
                          />
                          <Rating name="size-small" defaultValue={4}  />

                          <div className="flex items-center gap-3 mt-3">
                          <Button className='btn-org'>Submit review</Button>
                          </div>
                        </form>
                      </div>

                    </div>

                  </div>
                </div>
              )}


          </div>

          <div className="container pt-5">
             <h3 className='text-[20px] font-[600] pb-0'>Related Products</h3>
              <ProductSlider items={5}/>
          </div>
        </section>


      </div>
    </>
  )
}

export default ProductDetails
