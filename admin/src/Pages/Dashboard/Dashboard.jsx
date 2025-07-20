import React, { useState } from 'react'
import DashboardBoxes from '../../components/DashboardBoxes/DashboardBoxes'
import Button from '@mui/material/Button'
import { FaPlus } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Badge from '../../components/Badge/Badge';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { FiEdit } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';




import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { BiExport } from "react-icons/bi";



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

const Dashboard = () => {

  const [isOpenOrderedProduct, setIsOpenProduct] = useState(null);

  const isShowOrderedProduct = (index) => {
    if (isOpenOrderedProduct === index) {
      setIsOpenProduct(null);
    } else {
      setIsOpenProduct(index);
    }
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [categoryFilterVal, setCategoryFilterVal] = useState('');

  const handleChangeCatFilter = (event) => {
    setCategoryFilterVal(event.target.value);
  };


  return (
    <div >
      <div className='w-full py-2 px-5 border border-[rgba(0,0,0,0.1)] flex items-center justify-between mb-5 gap-8 rounded-md bg-[#f1faff] '>
        <div className='info'>
          <h1 className='text-[35px] font-bold leading-10 mb-3 '>Good Morning,<br /> admin <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" class="inline-flex h-8 w-8"><path fill="#fac036" d="M39.11 79.56c-1.1 1.03-2.21-.2-2.21-.2S18.42 59.78 17.22 58.9c-1.69-1.23-5.31-3.16-8.93.57-1.51 1.55-3.97 5 .6 10.56.99 1.2 29.78 31.54 31.46 33.18 0 0 13.3 12.94 21.35 17.81 2.23 1.35 4.74 2.78 7.67 3.78 2.92 1 6.22 1.69 9.7 1.69 3.48.04 7.09-.63 10.5-1.88 3.41-1.26 6.59-3.09 9.48-5.2.71-.54 1.43-1.08 2.1-1.66l1.94-1.6a58.67 58.67 0 0 0 3.82-3.53c2.43-2.42 4.62-5.01 6.55-7.66 1.92-2.66 3.55-5.41 4.85-8.15 1.3-2.74 2.21-5.49 2.76-8.09.58-2.59.74-5.04.65-7.18-.02-2.14-.45-3.97-.8-5.43-.4-1.46-.83-2.55-1.17-3.27-.33-.72-.51-1.1-.51-1.1-.46-1.29-.9-2.52-1.29-3.63a889.622 889.622 0 0 0-4.51-12.47l.01.03c-4.85-13.17-10.06-26.74-10.06-26.74-.79-2.39-3.7-3.22-5.84-1.68-6.18 4.44-8.07 10.92-5.89 17.83l5.59 15.32c.79 1.71-1.39 3.69-2.85 2.5-4.59-3.74-14.3-14.05-14.3-14.05-4.34-4.16-28.83-29.27-30.47-30.8-3.3-3.07-7.46-4.65-10.63-2.32-3.24 2.38-4.14 6.06-1.01 10.08.85 1.09 25.6 27.24 25.6 27.24 1.44 1.51-.26 3.65-1.85 2.18 0 0-30.79-32.12-32.18-33.62-3.15-3.42-8.21-4.17-11.21-1.35-2.93 2.75-2.86 7.26.34 10.8 1.02 1.12 22.71 24.02 31.39 33.4.58.63 1.03 1.47.17 2.26-.01.01-.88.95-2-.25-2.36-2.52-25.93-27.08-27.24-28.41-3.01-3.06-7.05-4.51-10.3-1.53-2.96 2.71-3.44 7.44-.04 10.78l28.55 30.18s.93 1.1-.11 2.07z"></path><path fill="#e48c15" d="m85.46 54.4 2.41 2.58s-13.79 13.31-4.39 33.75c0 0 1.22 2.59-.38 3.02 0 0-1.4.78-3-3.2 0-.01-9.49-19.42 5.36-36.15z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4" opacity="0.5" d="M63.28 10.2s5.81.88 11.19 6.64c5.38 5.77 7.87 13.18 7.87 13.18M77.44 3.5s4.87 2.45 8.63 8.5c3.76 6.05 4.67 13.05 4.67 13.05m-55.03 85.68s-5.86.39-12.35-4.09-10.52-11.18-10.52-11.18m18.69 25.1s-5.44.23-11.68-3.22-10.44-9.12-10.44-9.12"></path></svg></h1>
          <p>Here’s What happening on your store today. See the statistics at once.</p>
          <br />

          <Button className='btn-blue !capitalize flex gap-1'> <FaPlus />  Add Product</Button>

        </div>
        <img src='/shop-illustration.webp' className='w-[300px] h-[300px]' alt="Dashboard Illustration" />

      </div>
      <DashboardBoxes />


      <div className="card my-4 shadow-md bg-white p-5 rounded-md">
        <div className='flex items-center justify-between px-5 py-5'>
          <h2 className='text-[18px] font-bold  '>Products <span>Tailwind css table</span></h2>
        </div>

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
          <div className='col w-[25%] ml-auto flex items-center gap-3 '>
         < Button className='btn !bg-green-600 btn-sm '>Export</Button>
         < Button className='btn-blue btn-sm '>Add product</Button>
          </div>

        </div>

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-900 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3 align-middle">
                  <Checkbox {...label} size='small' className='!p-0 !m-0' />
                </th>
                <th className="px-6 py-3 whitespace-nowrap align-middle">Products</th>
                <th className="px-6 py-3 whitespace-nowrap align-middle">Category</th>
                <th className="px-6 py-3 whitespace-nowrap align-middle">Sub Category</th>
                <th className="px-6 py-3 whitespace-nowrap align-middle">Price</th>
                <th className="px-6 py-3 whitespace-nowrap align-middle">Sales</th>
                <th className="px-6 py-3 whitespace-nowrap align-middle">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className='odd:bg-white even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200'>
                <td className="px-6 py-2 align-middle">
                  <Checkbox {...label} size='small' className='!p-0 !m-0' />
                </td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className="img group">
                      <Link to='/product/8753984'>
                        <img src='https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=' className='w-[50px] h-[50px] object-cover rounded-md group-hover:scale-105 transition-all' alt='product' />
                      </Link>
                    </div>
                    <div className="info w-[75%]">
                      <h3 className='text-[12px] font-[600] leading-4 hover:text-primary'>Explore the metrics to understand trends and drive.</h3>
                      <span className='text-[12px] text-[rgba(0,0,0,0.7)]'>Books</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-2 align-middle whitespace-nowrap">Electronics</td>
                <td className="px-6 py-2 align-middle whitespace-nowrap">Women</td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex flex-col gap-2'>
                    <span className='text-[12px] text-[rgba(0,0,0,0.7)] line-through'>Rs.100</span>
                    <span className='text-[12px] text-primary font-[600]'>Rs.100</span>
                  </div>
                </td>
                <td className="px-6 py-2 align-middle">
                  <p className='text-[14px] w-[150px]'><span className='text-primary font-[600]'>234</span> sales</p>
                  <ProgressBar value={40} status='error' />
                </td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex items-center gap-3'>
                  <Tooltip title="Edit Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FiEdit className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FaRegEye className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FaRegTrashCan className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr className='odd:bg-white even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200'>
                <td className="px-6 py-2 align-middle">
                  <Checkbox {...label} size='small' className='!p-0 !m-0' />
                </td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className="img group">
                      <Link to='/product/8753984'>
                        <img src='https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=' className='w-[50px] h-[50px] object-cover rounded-md group-hover:scale-105 transition-all' alt='product' />
                      </Link>
                    </div>
                    <div className="info w-[75%]">
                      <h3 className='text-[12px] font-[600] leading-4 hover:text-primary'>Explore the metrics to understand trends and drive.</h3>
                      <span className='text-[12px] text-[rgba(0,0,0,0.7)]'>Books</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-2 align-middle whitespace-nowrap">Electronics</td>
                <td className="px-6 py-2 align-middle whitespace-nowrap">Women</td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex flex-col gap-2'>
                    <span className='text-[12px] text-[rgba(0,0,0,0.7)] line-through'>Rs.100</span>
                    <span className='text-[12px] text-primary font-[600]'>Rs.100</span>
                  </div>
                </td>
                <td className="px-6 py-2 align-middle">
                  <p className='text-[14px] w-[150px]'><span className='text-primary font-[600]'>234</span> sales</p>
                  <ProgressBar value={40} status='info' />
                </td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex items-center gap-3'>
                  <Tooltip title="Edit Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FiEdit className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FaRegEye className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FaRegTrashCan className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr className='odd:bg-white even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200'>
                <td className="px-6 py-2 align-middle">
                  <Checkbox {...label} size='small' className='!p-0 !m-0' />
                </td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className="img group">
                      <Link to='/product/8753984'>
                        <img src='https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=' className='w-[50px] h-[50px] object-cover rounded-md group-hover:scale-105 transition-all' alt='product' />
                      </Link>
                    </div>
                    <div className="info w-[75%]">
                      <h3 className='text-[12px] font-[600] leading-4 hover:text-primary'>Explore the metrics to understand trends and drive.</h3>
                      <span className='text-[12px] text-[rgba(0,0,0,0.7)]'>Books</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-2 align-middle whitespace-nowrap">Electronics</td>
                <td className="px-6 py-2 align-middle whitespace-nowrap">Women</td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex flex-col gap-2'>
                    <span className='text-[12px] text-[rgba(0,0,0,0.7)] line-through'>Rs.100</span>
                    <span className='text-[12px] text-primary font-[600]'>Rs.100</span>
                  </div>
                </td>
                <td className="px-6 py-2 align-middle">
                  <p className='text-[14px] w-[150px]'><span className='text-primary font-[600]'>234</span> sales</p>
                  <ProgressBar value={40} status='sucess' />
                </td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex items-center gap-3'>
                  <Tooltip title="Edit Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FiEdit className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FaRegEye className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FaRegTrashCan className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr className='odd:bg-white even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200'>
                <td className="px-6 py-2 align-middle">
                  <Checkbox {...label} size='small' className='!p-0 !m-0' />
                </td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className="img group">
                      <Link to='/product/8753984'>
                        <img src='https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=' className='w-[50px] h-[50px] object-cover rounded-md group-hover:scale-105 transition-all' alt='product' />
                      </Link>
                    </div>
                    <div className="info w-[75%]">
                      <h3 className='text-[12px] font-[600] leading-4 hover:text-primary'>Explore the metrics to understand trends and drive.</h3>
                      <span className='text-[12px] text-[rgba(0,0,0,0.7)]'>Books</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-2 align-middle whitespace-nowrap">Electronics</td>
                <td className="px-6 py-2 align-middle whitespace-nowrap">Women</td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex flex-col gap-2'>
                    <span className='text-[12px] text-[rgba(0,0,0,0.7)] line-through'>Rs.100</span>
                    <span className='text-[12px] text-primary font-[600]'>Rs.100</span>
                  </div>
                </td>
                <td className="px-6 py-2 align-middle">
                  <p className='text-[14px] w-[150px]'><span className='text-primary font-[600]'>234</span> sales</p>
                  <ProgressBar value={40} status='warning' />
                </td>
                <td className="px-6 py-2 align-middle">
                  <div className='flex items-center gap-3'>
                  <Tooltip title="Edit Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FiEdit className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FaRegEye className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" placement='top'>
                    <Button className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !bg-[#f1f1f1]'><FaRegTrashCan className='text-[20px] !text-[rgba(0,0,0,0.8)]' /></Button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='flex items-center justify-center mt-5'>
        <Pagination count={10} color="primary" />
        </div>
        
        

      </div>

      <div className="card my-4 shadow-md bg-white p-5 rounded-md">
        <div className='flex items-center justify-between px-5 py-5'>
          <h2 className='text-[18px] font-bold  '>Products <span>Material UI Table</span></h2>
        </div>

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
          <div className='col w-[25%] ml-auto flex items-center gap-3 '>
         < Button className='btn !bg-green-600 btn-sm '>Export</Button>
         < Button className='btn-blue btn-sm '>Add product</Button>
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
              {[1,2,3,4].map((row, idx) => (
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
                        <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#f1f1f1', p: 0 }}><FiEdit style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} /></Button>
                      </Tooltip>
                      <Tooltip title="View Product" placement='top'>
                        <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#f1f1f1', p: 0 }}><FaRegEye style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} /></Button>
                      </Tooltip>
                      <Tooltip title="Delete Product" placement='top'>
                        <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#f1f1f1', p: 0 }}><FaRegTrashCan style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} /></Button>
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


      <div className="card my-4 shadow-md bg-white p-5 rounded-md">
        <div className='flex items-center justify-between px-5 py-5'>
          <h2 className='text-[18px] font-bold  '>Recent Orders</h2>
        </div>

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-900 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">
                 
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
                <td className="px-6 py-4"><span className='text-primary font-[600] '>okaerhgiouero</span></td>
                <td className="px-6 py-4"><span className='text-primary font-[600]'>okaerhgiouero</span></td>
                <td className="px-6 py-4">$2999</td>
                <td className="px-6 py-4 whitespace-nowrap">Roshan Chawal</td>
                <td className="px-6 py-4">kjfegnjio</td>
                <td className="px-6 py-4">kjfegnjio</td>
                <td className="px-6 py-4">kjfegnjio</td>
                <td className="px-6 py-4">kjfegnjio</td>
                <td className="px-6 py-4">kjfegnjio</td>
                <td className="px-6 py-4"><span className='text-primary font-[600]'>okaerhgiouero</span></td>
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
                            <td className="px-6 py-4"><span className='text-primary font-[600]'>okaerhgiouero</span></td>
                            <td className="px-6 py-4"><span className='text-primary font-[600]'>okaerhgiouero</span></td>
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
  )
}

export default Dashboard
