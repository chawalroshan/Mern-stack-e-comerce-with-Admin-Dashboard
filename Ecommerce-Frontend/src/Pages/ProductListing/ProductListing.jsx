import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from '../../components/ProductItem/ProductItem';
import ProductItemListView from '../../components/ProductItemListView/ProductItemListView';
import { Button } from '@mui/material';
import { IoGridSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';


const ProductListing = () => {

  const [itemView, SetItemView] = useState('grid');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <section className='py-5'>
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

        </Breadcrumbs>
      </div>


      <div className='bg-white py-2 mt-4'>
        <div className='container flex gap-3'>

          <div className='sidebarWrapper w-[200px] h-full bg-white p-3'>
            <Sidebar />
          </div>

          <div className='rightContent w-[80%] py-3'>

            <div className='bg-[#f1f1f1] p-2 w-full mb-4 rounded flex items-center justify-between'>
              <div className='col1 flex items-center itemViewActions'>
                <Button className={`'!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000]' ${itemView==='list' && 'active'}`} onClick={() => SetItemView('list')}>
                  <LuMenu className='!text-[rgba(0,0,0,0.7)] ' />
                </Button>
                <Button className={`'!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000]' ${itemView==='grid' && 'active'}`}  onClick={() => SetItemView('grid')}>
                  <IoGridSharp className='!text-[rgba(0,0,0,0.7)] ' />
                </Button>

                <span className='text-[rgba(0,0,0,0.7)] text-[14px] font-[500] pl-3'>There are 27 products.</span>

              </div>

              <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                <span className='text-[rgba(0,0,0,0.7)] text-[14px] font-[500] pl-3'>Short By:</span>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  className='!bg-white !text-[12px] !text-[#000] !capitalize !border-2 !border-[#000]'
                >
                  Slaes, High to Low
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      'aria-labelledby': 'basic-button',
                    },
                  }}
                >
                  <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Sales, High to Low</MenuItem>
                  <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Relevance</MenuItem>
                  <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Name, A to Z</MenuItem>
                  <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Name, Z to A</MenuItem>
                  <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Price, High to Low</MenuItem>
                  <MenuItem onClick={handleClose} className='!text-[13px] !text-[#000] !capitalize'>Price, Low to High</MenuItem>
                </Menu>
              </div>

            </div>


            <div className={`grid ${itemView==='grid' ? "grid grid-cols-4 md:grid-cols-4 gap-4" : "grid grid-cols-4 md:grid-cols-1"} gap-1`}>
              {
                itemView === 'grid' ? (
                  <>
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                  </>
                ) : (
                  <>
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                    <ProductItemListView />
                  </>
                )
              }
            </div>
              <div className='flex items-center justify-center mt-5'>
                <Pagination count={10} showFirstButton showLastButton />
              </div>

          </div>




        </div>
      </div>

    </section>
  )
}

export default ProductListing
