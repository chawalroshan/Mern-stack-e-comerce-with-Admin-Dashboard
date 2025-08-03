import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { FaPlus } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { FiEdit } from "react-icons/fi";
import { FaRegEye, FaRegTrashCan } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import Chip from '@mui/material/Chip';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { id: 'subCatImage', label: 'Sub Category Image', minWidth: 250 },
  { id: 'catName', label: 'Category Name', minWidth: 250 },
  { id: 'subCatName', label: 'Sub Category Name', minWidth: 250 },
  { id: 'action', label: 'Action', minWidth: 100 },
];

const SubCategoryList = () => {
  const context = useContext(MyContext);
  const [subCatFilterVal, setSubCatFilterVal] = useState('');

  const handleChangeSubCatFilter = (event) => {
    setSubCatFilterVal(event.target.value);
  };

  const rows = [
    {
      id: 1,
      subCatImage: 'https://img.freepik.com/premium-vector/shoe-vector-sneaker-shoe-vector-logo-design-icon_857171-1469.jpg',
      catName: 'Men’s Shoes',
      subCatName: 'Formal',
    },
    {
      id: 2,
      subCatImage: 'https://img.freepik.com/premium-vector/shoe-vector-sneaker-shoe-vector-logo-design-icon_857171-1469.jpg',
      catName: 'Women’s Shoes',
      subCatName: 'Heels',
    },
    {
      id: 3,
      subCatImage: 'https://img.freepik.com/premium-vector/shoe-vector-sneaker-shoe-vector-logo-design-icon_857171-1469.jpg',
      catName: 'Kids Shoes',
      subCatName: 'School Wear',
    },
  ];

  return (
    <>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between px-2 py-3 gap-3'>
        <h2 className='text-[18px] font-bold'>Sub Category List</h2>
        <div className='flex items-center gap-3 ml-auto'>
          <Button className='!bg-green-600 !text-white px-4 py-1 rounded'>Export</Button>
          <Button
            className='btn-blue btn-sm'
            onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Add New Sub Category' })}
          >
            <FaPlus className='mr-2' /> Add New Sub Category
          </Button>
        </div>
      </div>

      <div className="card my-4 shadow-md bg-white p-5 rounded-md">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" width={60}>
                  <Checkbox {...label} size="small" />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow hover key={idx}>
                  <TableCell padding="checkbox">
                    <Checkbox {...label} size="small" />
                  </TableCell>

                  {columns.map((column) => {
                    if (column.id === 'subCatImage') {
                      return (
                        <TableCell key={column.id}>
                          <Link to={`/sub-category/${row.id}`}>
                            <img
                              src={row.subCatImage}
                              alt='sub-category'
                              className="w-[120px] h-[60px] object-cover rounded-md hover:scale-105 transition"
                            />
                          </Link>
                        </TableCell>
                      );
                    }

                    if (column.id === 'catName') {
                      return (
                        <TableCell key={column.id}>
                          <Chip
                            label={row.catName}
                            color={
                              row.catName.includes("Men")
                                ? 'primary'
                                : row.catName.includes("Women")
                                ? 'secondary'
                                : 'success'
                            }
                            variant="outlined"
                          />
                        </TableCell>
                      );
                    }

                    if (column.id === 'subCatName') {
                      return (
                        <TableCell key={column.id}>
                          <h4 className='text-[14px] text-gray-700'>{row.subCatName}</h4>
                        </TableCell>
                      );
                    }

                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align="right">
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip title="Edit Sub Category">
                              <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                                <FiEdit className='text-[18px] text-gray-800' />
                              </Button>
                            </Tooltip>
                            <Tooltip title="View Sub Category">
                              <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                                <FaRegEye className='text-[18px] text-gray-800' />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete Sub Category">
                              <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                                <FaRegTrashCan className='text-[18px] text-gray-800' />
                              </Button>
                            </Tooltip>
                          </div>
                        </TableCell>
                      );
                    }

                    return <TableCell key={column.id}>-</TableCell>;
                  })}
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
};

export default SubCategoryList;
