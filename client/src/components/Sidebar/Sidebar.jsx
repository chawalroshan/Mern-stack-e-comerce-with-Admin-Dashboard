import React , {useState}from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Collapse} from 'react-collapse';
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import './style.css'; // Assuming you have a CSS file for styling
import Button from '@mui/material/Button';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';


const Sidebar = () => {

  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(false);
  const [isOpenAvailabilityFilter, setIsOpenAvailabilityFilter] = useState(false);
  const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(false);


  const [value, setValue] = useState([0, 3000]);


  return (
    <aside className='sidebar py-5'>
      <div className='box'>
        <h3 className='mb-3 text-[16px] font-[600] flex items-center pr-5'>Shop by category 
          <Button className='!w-[30px] ![30px] !min-w-[30px] !rounded-full !ml-auto !text-black' onClick={()=>setIsOpenCategoryFilter(!isOpenCategoryFilter)}>
            {
              isOpenCategoryFilter === true ? <FaAngleUp/> : <FaAngleDown />
            }
            
            
          
          </Button>
        </h3>
        <Collapse isOpened={isOpenCategoryFilter} className='mb-3'>
        <div className='scroll px-4 relative -left-[13px]'>
        <FormControlLabel control={<Checkbox size="small"/>} label="Fashion" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Electronics" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Bags" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Footwear" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Groceries" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Beauty" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Wellness" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="jwellery" className='w-full'/>
        </div>
        </Collapse>
        
      </div>

      <div className='box mt-3'>
        <h3 className='mb-3 text-[16px] font-[600] flex items-center pr-5'>Availability
          <Button className='!w-[30px] ![30px] !min-w-[30px] !rounded-full !ml-auto !text-black' onClick={()=>setIsOpenAvailabilityFilter(!isOpenAvailabilityFilter)}>
            {
              isOpenAvailabilityFilter === true ? <FaAngleUp/> : <FaAngleDown />
            }
            
            
          
          </Button>
        </h3>
        <Collapse isOpened={isOpenAvailabilityFilter} className='mb-3'>
        <div className='scroll px-4 relative -left-[13px]'>
        <FormControlLabel control={<Checkbox size="small"/>} label="Available (17)" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="In Stock (10)" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Not Available (1)" className='w-full'/>
        
        </div>
        </Collapse>
        
      </div>

      <div className='box mt-3'>
        <h3 className='mb-3 text-[16px] font-[600] flex items-center pr-5'> Size
          <Button className='!w-[30px] ![30px] !min-w-[30px] !rounded-full !ml-auto !text-black' onClick={()=>setIsOpenSizeFilter(!isOpenSizeFilter)}>
            {
              isOpenSizeFilter === true ? <FaAngleUp/> : <FaAngleDown />
            }
            
            
          
          </Button>
        </h3>
        <Collapse isOpened={isOpenSizeFilter} className='mb-3'>
        <div className='scroll px-4 relative -left-[13px]'>
        <FormControlLabel control={<Checkbox size="small"/>} label="Small" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Medium" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="Large" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="XL" className='w-full'/>
        <FormControlLabel control={<Checkbox size="small" />} label="XLL" className='w-full'/>
        </div>
        </Collapse>
        
      </div>


      <div className="box mt-4">
      <h3 className="mb-3 text-[16px] font-[600] flex items-center pr-5">Filter By Price</h3>

      {/* RangeSlider with lower thumb hidden */}
      <RangeSlider
        id="range-slider"
        min={0}
        max={10000}
        value={value}
        onInput={setValue}
        thumbsDisabled={[true, false]} // disable left thumb
        rangeSlideDisabled={true}
      />

      <div className="flex pt-2 pb-2 priceRange">
        <span className="text-[13px]">
          Max: <strong className="text-dark">Rs: {value[1]}</strong>
        </span>
      </div>
    </div>


    <div className="box mt-4">
      <h3 className="mb-3 text-[16px] font-[600] flex items-center pr-5">Filter By Rating</h3>

            <div className='w-full'>
            <Rating name="size-small" defaultValue={5} size="small" readOnly/>
            </div>
           <div className='w-full'>
            <Rating name="size-small" defaultValue={4} size="small" readOnly/>
            </div>
            <div className='w-full'>
            <Rating name="size-small" defaultValue={3} size="small" readOnly/>
            </div>
            <div className='w-full'>
            <Rating name="size-small" defaultValue={2} size="small" readOnly/>
            </div>
            <div className='w-full'>
            <Rating name="size-small" defaultValue={1} size="small" readOnly/>
            </div>
      
    </div>
      
    </aside>
  )
}

export default Sidebar
