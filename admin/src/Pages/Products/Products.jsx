import Button from '@mui/material/Button'
import React, {useContext, useState}  from 'react'
import { FaPlus } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';


import { FiEdit } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import SearchBox from '../../components/SearchBox/SearchBox';
import { MyContext } from '../../App';






const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { id: 'id', label: 'ID', minWidth: 80 },
  { id: 'product', label: 'Product', minWidth: 150 },
  { id: 'category', label: 'Category', minWidth: 170 },

  {
    id: 'subcategory',
    label: 'SUB CATEGORY',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'price',
    label: 'Price',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
    {
      id: 'sales',
      label: 'Sales',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toFixed(2),
    },
    {
      id: 'action',
      label: 'Action',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toFixed(2),
    }
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];



const Products = () => {

  const [categoryFilterVal, setCategoryFilterVal] = useState('');

  const handleChangeCatFilter = (event) => {
    setCategoryFilterVal(event.target.value);
  };

  const context = useContext(MyContext);


  return (
    <>
    <div className='flex items-center justify-between px-2 py-0 mt-3'>
          <h2 className='text-[18px] font-bold  '>Products <span>Material UI Table</span></h2>

          <div className='col w-[25%] ml-auto flex items-center justify-end gap-3 '>
         < Button className='btn !bg-green-600 btn-sm '>Export</Button>
         < Button className='btn-blue btn-sm ' onClick={()=> context.setIsOpenFullScreenPanel({
          open:true,
          model:'Add product'
         })}>Add product</Button>
          </div>
        </div>



    <div className="card my-4 shadow-md bg-white p-5 rounded-md">
        
        <div className='flex items-center w-full pl-5 justify-between pr-5'>
          <div className="col w-[20%]">
            
            <h4 className='font-[600] text-[15px] mb-2 '>Category By</h4>
            <Select
            className='w-full '
            size='small'
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={categoryFilterVal}
          onChange={handleChangeCatFilter}
          label="category"
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value={10}>Men</MenuItem>
          <MenuItem value={20}>Women</MenuItem>
          <MenuItem value={30}>Kids</MenuItem>
        </Select>
          </div>
          
        <div className='cpl w-[20%] ml-auto  '>
          <SearchBox/>
        </div>


        </div>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Sub Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Sales</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1,2,3,4,5,6,7].map((row, idx) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                  <TableCell padding="checkbox">
                    <Checkbox {...label} size='small' />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: 300 }}>
                      <div>
                        <Link to='/product/8753984'>
                          <img src='https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=' alt='product' style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, transition: 'transform 0.2s' }} />
                        </Link>
                      </div>
                      <div style={{ width: '75%' }}>
                        <h3 style={{ fontSize: 12, fontWeight: 600, lineHeight: '16px', cursor: 'pointer' }}>Explore the metrics to understand trends and drive.</h3>
                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.7)' }}>Books</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Electronics</TableCell>
                  <TableCell>Women</TableCell>
                  <TableCell align="right">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.7)', textDecoration: 'line-through' }}>Rs.100</span>
                      <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>Rs.100</span>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <div style={{ width: 150 }}>
                      <span style={{ fontSize: 14, color: '#2563eb', fontWeight: 600 }}>234</span> sales
                      <ProgressBar value={40} status={idx === 0 ? 'error' : idx === 1 ? 'info' : idx === 2 ? 'sucess' : 'warning'} />
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Tooltip title="Edit Product" placement='top'>
                        <Button sx={{ minWidth: 30, width: 20, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}><FiEdit style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} /></Button>
                      </Tooltip>
                      <Tooltip title="View Product" placement='top'>
                        <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}><FaRegEye style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} /></Button>
                      </Tooltip>
                      <Tooltip title="Delete Product" placement='top'>
                        <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}><FaRegTrashCan style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} /></Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className='flex items-center justify-center mt-5'>
          <Pagination count={10} color="primary" />
        </div>
      </div>
    </>
  )
}

export default Products
