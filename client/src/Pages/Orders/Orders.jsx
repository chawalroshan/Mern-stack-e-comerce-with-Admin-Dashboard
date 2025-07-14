import React, { useState } from 'react';
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Button } from '@mui/material';
import Badge from '../../components/Badge/Badge';

const Orders = () => {
  const [isOpenOrderedProduct, setIsOpenProduct] = useState(null);

  const isShowOrderedProduct = (index) => {
    if (isOpenOrderedProduct === index) {
      setIsOpenProduct(null);
    } else {
      setIsOpenProduct(index);
    }
  };

  return (
    <section className='py-10 w-full'>
      <div className='container flex gap-5'>
        <div className='col1 w-[20%]'>
          <AccountSidebar />
        </div>

        <div className="col2 w-[80%]">
          <div className='shadow-md rounded-md p-1 bg-white mt-3'>
            <div className='py-2 px-3 border-b border-[rgba(0,0,0,0.1)]'>
              <h2>My Orders</h2>
              <p className='mt-0'>There are <span className='font-bold text-primary'>2</span> orders in your List.</p>

              <div className="relative overflow-x-auto mt-5">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-900 uppercase bg-gray-100">
                    <tr>
                      <th className="px-6 py-3">
                        {/* <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]'><FaAngleDown className='text-[16px] !text-[rgba(0,0,0,0.8)]' /></Button> */}
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">Order Id</th>
                      <th className="px-6 py-3 whitespace-nowrap">Payment Id</th>
                      <th className="px-6 py-3 whitespace-nowrap">Products</th>
                      <th className="px-6 py-3 whitespace-nowrap">Name</th>
                      <th className="px-6 py-3 whitespace-nowrap">Phone Number</th>
                      <th className="px-6 py-3 whitespace-nowrap">Address</th>
                      <th className="px-6 py-3 whitespace-nowrap">Pincode</th>
                      <th className="px-6 py-3 whitespace-nowrap">Total Amount</th>
                      <th className="px-6 py-3 whitespace-nowrap">Email Id</th>
                      <th className="px-6 py-3 whitespace-nowrap">User Id</th>
                      <th className="px-6 py-3 whitespace-nowrap">Order status</th>
                      <th className="px-6 py-3 whitespace-nowrap">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-6 py-3">
                        <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]' onClick={() => isShowOrderedProduct(0)}>
                          {isOpenOrderedProduct === 0 ? <FaAngleUp className='text-[16px] !text-[rgba(0,0,0,0.8)]' /> : <FaAngleDown className='text-[16px] !text-[rgba(0,0,0,0.8)]' />}
                        </Button>
                      </td>
                      <td className="px-6 py-4"><span className='text-primary'>okaerhgiouero</span></td>
                      <td className="px-6 py-4"><span className='text-primary'>okaerhgiouero</span></td>
                      <td className="px-6 py-4">$2999</td>
                      <td className="px-6 py-4 whitespace-nowrap">Roshan Chawal</td>
                      <td className="px-6 py-4">kjfegnjio</td>
                      <td className="px-6 py-4">kjfegnjio</td>
                      <td className="px-6 py-4">kjfegnjio</td>
                      <td className="px-6 py-4">kjfegnjio</td>
                      <td className="px-6 py-4">kjfegnjio</td>
                      <td className="px-6 py-4"><span className='text-primary'>okaerhgiouero</span></td>
                      <td className="px-6 py-4"><Badge status='pending' /></td>
                      <td className="px-6 py-4">kjfegnjio</td>
                    </tr>

                    {isOpenOrderedProduct === 0 && (
                      <tr>
                        <td colSpan='13' className='bg-[#f9f9f9] px-6 py-4'>
                          <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700">
                              <thead className="text-xs text-gray-900 uppercase bg-gray-100">
                                <tr>
                                  <th className="px-6 py-3">Product Id</th>
                                  <th className="px-6 py-3 whitespace-nowrap">Product Title</th>
                                  <th className="px-6 py-3 whitespace-nowrap">Image</th>
                                  <th className="px-6 py-3 whitespace-nowrap">Quantity</th>
                                  <th className="px-6 py-3 whitespace-nowrap">Price</th>
                                  <th className="px-6 py-3 whitespace-nowrap">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-white">
                                  <td className="px-6 py-4"><span className='text-primary'>okaerhgiouero</span></td>
                                  <td className="px-6 py-4"><span className='text-primary'>okaerhgiouero</span></td>
                                  <td className="px-6 py-4">
                                    <img src='https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=' className='w-[40px] h-[40px] object-cover rounded-md' alt='product' />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">1</td>
                                  <td className="px-6 py-4">$999</td>
                                  <td className="px-6 py-4">$999</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;