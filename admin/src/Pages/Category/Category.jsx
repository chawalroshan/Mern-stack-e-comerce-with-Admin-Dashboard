import Button from '@mui/material/Button';
import React, { useContext, useState } from 'react';
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
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { FiEdit } from "react-icons/fi";
import { FaRegEye, FaRegTrashCan } from "react-icons/fa6";
import SearchBox from '../../components/SearchBox/SearchBox';
import { MyContext } from '../../App';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { id: 'catimage', label: 'Category Image', minWidth: 250 },
  { id: 'catName', label: 'Category Name', minWidth: 150 },
  { id: 'action', label: 'Action', minWidth: 100 },
];

const Category = () => {
  const [categoryFilterVal, setCategoryFilterVal] = useState('');
  const handleChangeCatFilter = (event) => {
    setCategoryFilterVal(event.target.value);
  };
  const context = useContext(MyContext);

  return (
    <>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between px-2 py-3 gap-3'>
        <h2 className='text-[18px] font-bold'>Category List</h2>
        <div className='flex items-center gap-3 ml-auto'>
          <Button className='!bg-green-600 !text-white px-4 py-1 rounded'>Export</Button>
          <Button
            className='btn-blue btn-sm'
            onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Add New Category' })}
          >
            <FaPlus className='mr-2' /> Add New Category
          </Button>
        </div>
      </div>

      <div className="card my-4 shadow-md bg-white p-5 rounded-md">

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" width={60}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category Name</TableCell> {/* Added this line */}
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((row, idx) => (
                <TableRow hover key={idx}>
                  <TableCell padding="checkbox">
                    <Checkbox {...label} size='small' />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Link to='/product/8753984'>
                        <img
                          src='https://img.freepik.com/premium-vector/shoe-vector-sneaker-shoe-vector-logo-design-icon_857171-1469.jpg'
                          alt='product'
                          className="w-[100px] h-[50px] object-cover rounded-md hover:scale-105 transition"
                        />
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>Shoes</TableCell> {/* Example Category Name */}
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip title="Edit Product">
                        <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                          <FiEdit className='text-[18px] text-gray-800' />
                        </Button>
                      </Tooltip>
                      <Tooltip title="View Product">
                        <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                          <FaRegEye className='text-[18px] text-gray-800' />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete Product">
                        <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                          <FaRegTrashCan className='text-[18px] text-gray-800' />
                        </Button>
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
  );
}

export default Category;
