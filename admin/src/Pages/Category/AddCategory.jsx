import React from 'react';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";

const AddCategory = () => {
  return (
    <section className='p-5 bg-gray-50'>
      <form className='form py-3 px-8'>
        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          
          <div className='col w-full p-5 px-0'>
           
            
            <div className="grid grid-cols-1 mb-3 ">
          <div className="col w-[25%]">
            <h3 className='text-[14px] font-[500] mb-1 text-black '>Category Name </h3>
            <input type='text' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>
        </div>

        <br/>


        <h3 className='text-[18px] font-[700] mb-1 text-black '>Category Image </h3>
        <br/>
            <div className="grid grid-cols-7 gap-4">
              
              <div className='uploadboxWrapper relative'>
                <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer'>
                  <IoMdClose className='text-white text-[17px]' />
                </span>

                <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                  <LazyLoadImage
                    className='w-full h-full object-cover'
                    alt='image'
                    effect='blur'
                    wrapperProps={{
                      style: { transitionDelay: "0.5s" },
                    }}
                    src='https://dotm.gov.np/content/img/gov-logo.png'
                  />
                </div>
              </div>

              <UploadBox multiple={true} />
            </div>
          </div>
        </div>

        <hr className='my-5' />

        <Button type='button' className='btn-blue btn-lg w-full gap-2'>
          Publish and View <MdCloudUpload className='text-[18px]' />
        </Button>
      </form>
    </section>
  );
};

export default AddCategory;
