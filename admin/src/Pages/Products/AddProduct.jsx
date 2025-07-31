import React, { useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";

const AddProduct = () => {

  const [productCat, setProductCat] = useState('');
  const [productSubCat, setProductSubCat] = useState('');
  const [productFeatured, setProductFeatured] = useState('');
  const [productRams, setProductRams] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [productSize, setProductSize] = useState('');

  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
  };

  const handleChangeProductSubCat = (event) => {
    setProductSubCat(event.target.value);
  };

  const handleChangeProductFeatured = (event) => {
    setProductFeatured(event.target.value);
  };

  const handleChangeProductRams = (event) => {
    setProductRams(event.target.value);
  };

  const handleChangeProductWeight = (event) => {
    setProductWeight(event.target.value);
  };

  const handleChangeProductSize = (event) => {
    setProductSize(event.target.value);
  };

  return (
    <section className='p-5 bg-gray-50'>
      <form className='form py-3 px-8  '>
        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4 '>
        <div className="grid grid-cols-1 mb-3 ">
          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1 text-black '>Product Name </h3>
            <input type='text' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>
        </div>
        <div className="grid grid-cols-1 mb-3 ">
          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1  text-black '>Product Description </h3>
            <input type='text' className='w-full h-[140px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>
        </div>

        <div className="grid grid-cols-4 mb-3 gap-5  text-black ">
          <div className="col">
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
            <h3 className='text-[14px] font-[500] mb-1  text-black '> Product Sub Category </h3>
            <Select
              labelId="demo-simple-select-label"
              id="productSubCatDrop"
              className='w-full'
              size='small'
              value={productSubCat}
              label="Category"
              onChange={handleChangeProductSubCat}
            >
              <MenuItem value={10}>Men</MenuItem>
              <MenuItem value={20}>Women</MenuItem>
              <MenuItem value={30}>kids</MenuItem>
            </Select>
          </div>

          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1  text-black '>Produt Price </h3>
            <input type='number' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>

          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1  text-black '>Produt's Old Price </h3>
            <input type='number' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>



        </div>

        <div className="grid grid-cols-4 mb-3 gap-5  text-black ">
          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1 '>Is Feature </h3>
            <Select
              labelId="demo-simple-select-label"
              id="productFeatured"
              className='w-full'
              size='small'
              value={productFeatured}
              label="Category"
              onChange={handleChangeProductFeatured}
            >
              <MenuItem value={10}>True</MenuItem>
              <MenuItem value={20}>False</MenuItem>

            </Select>
          </div>



          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1  text-black '>Produt Stocks</h3>
            <input type='number' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>

          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1  text-black '>Produt Brand </h3>
            <input type='text' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>

          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1  text-black '>Discount</h3>
            <input type='number' className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' />
          </div>



        </div>

        <div className="grid grid-cols-4 mb-3 gap-5  text-black ">
          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1 '>Product Rams </h3>
            <Select
              labelId="demo-simple-select-label"
              id="productFeatured"
              className='w-full'
              size='small'
              value={productRams}
              label="Category"
              onChange={handleChangeProductRams}
            >
              <MenuItem value={10}>4GB</MenuItem>
              <MenuItem value={20}>8GB</MenuItem>

            </Select>
          </div>



          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1 '>Product Weight </h3>
            <Select
              labelId="product-weight-label"
              id="productWeight"
              className='w-full'
              size='small'
              value={productWeight}
              label="Weight"
              onChange={handleChangeProductWeight}
            >
              <MenuItem value={1}>1kg</MenuItem>
              <MenuItem value={2}>2kg</MenuItem>
              <MenuItem value={5}>5kg</MenuItem>
            </Select>
          </div>


          <div className="col">
  <h3 className='text-[14px] font-[500] mb-1 '>Product Size </h3>
  <Select
    labelId="product-size-label"
    id="productSize"
    className='w-full'
    size='small'
    value={productSize}
    label="Size"
    onChange={handleChangeProductSize}
  >
    <MenuItem value={'S'}>Small</MenuItem>
    <MenuItem value={'M'}>Medium</MenuItem>
    <MenuItem value={'L'}>Large</MenuItem>
  </Select>
</div>


          <div className="col">
            <h3 className='text-[14px] font-[500] mb-1  text-black '>Rating</h3>
            <Rating name="half-rating" defaultValue={2.5} precision={0.5}  />
          </div>



        </div>

        <div className='col w-full p-5 px-0'>
          <h3 className='text-[18px] font-[700] mb-3  text-black '>Media & Image</h3>

          

          <div className="grid grid-cols-7 gap-4">
            <div className='uploadboxWrapper relative'>
              <span className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer'><IoMdClose className='text-white text-[17px] '/></span>

            

          <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)]  h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative  '>
            
          <LazyLoadImage
          className='w-full h-full object-cover'
      alt={'image'}
      effect='blur'
      wrapperProps={{
        // If you need to, you can tweak the effect transition using the wrapper style.
        style: {transitionDelay: "0.5s"},
    }}
      src={'https://dotm.gov.np/content/img/gov-logo.png'} />
     
   
        
      
        </div>
        </div>

            <UploadBox multiple={true} />
          </div>
        </div>

        </div>
        <hr/>
        <br/>

    <Button type='button' className='btn-blue btn-lg w-full gap-2 ' >Publish and View <MdCloudUpload className='text-[18px]' /></Button>
      </form>

    </section>
  )
}

export default AddProduct
