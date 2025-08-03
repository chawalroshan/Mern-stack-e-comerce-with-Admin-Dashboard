import React, { useState } from 'react';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const AddSubCategory = () => {

  const [productCat, setProductCat] = useState('');

  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
  };


  return (
    <section className='p-5 bg-gray-50'>
      <form className='form py-3 px-8'>
        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          
          <div className='col w-full p-5 px-0'>
           
            
            <div className="grid grid-cols-4 mb-3 gap-5">
            <div className="col ">
            <h3 className='text-[14px] font-[500] mb-1 '>Product Category </h3>
            <Select
              labelId="demo-simple-select-label"
              id="productCatDrop"
              className='w-full'
              size='small'
              value={productCat}
              label="Category"
              onChange={handleChangeProductCat}
            >
              <MenuItem value={10}>Fashion</MenuItem>
              <MenuItem value={20}>Beauty</MenuItem>
              <MenuItem value={30}>Wellness</MenuItem>
            </Select>
          </div>

          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1 text-black '>Sub category Name </h3>
            <input type='text' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>
        </div>

        
          </div>
        </div>


        <Button type='button' className='btn-blue btn-lg w-full gap-2'>
          Publish and View <MdCloudUpload className='text-[18px]' />
        </Button>
      </form>
    </section>
  );
};

export default AddSubCategory;
