import Button from '@mui/material/Button';
import React, { useContext, useState, useEffect } from 'react'; // ✅ Added useEffect
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
import { fetchDataFromApi, deleteData } from '../../utils/api';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Category = () => {
  const [categoryFilterVal, setCategoryFilterVal] = useState('');
  const [catData, setCatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(MyContext);

  const handleChangeCatFilter = (event) => {
    setCategoryFilterVal(event.target.value);
  };

  // ✅ Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi('/api/category');
      if (res && res.success) {
        // ✅ Filter top-level categories only
        const topCategories = (res.categories || []).filter(cat => !cat.parentId);
        setCatData(topCategories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Handle category deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await deleteData(`/api/category/deleteCategory/${id}`);
        if (res && res.success) {
          alert('Category deleted successfully');
          fetchCategories(); // Refresh the list
        } else {
          alert('Failed to delete category');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Error deleting category');
      }
    }
  };

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
                <TableCell>Category Name</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : catData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                catData.map((cat) => ( // ✅ Map actual category data
                  <TableRow hover key={cat._id}>
                    <TableCell padding="checkbox">
                      <Checkbox {...label} size='small' />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Link to={`/category/${cat._id}`}>
                          <img
                            src={cat.images?.[0] || 'https://via.placeholder.com/150'} // ✅ Use actual image
                            alt={cat.name}
                            className="w-[100px] h-[50px] object-cover rounded-md hover:scale-105 transition"
                          />
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>{cat.name}</TableCell> {/* ✅ Show actual category name */}
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip title="Edit Category">
                          <Link to={`/category/edit/${cat._id}`}>
                            <Button 
                            // onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Edit Category' })}
                             sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                              <FiEdit className='text-[18px] text-gray-800' />
                            </Button>
                          </Link>
                        </Tooltip>
                        <Tooltip title="View Category">
                          <Link to={`/category/${cat._id}`}>
                            <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                              <FaRegEye className='text-[18px] text-gray-800' />
                            </Button>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Delete Category">
                          <Button 
                            onClick={() => handleDelete(cat._id)}
                            sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}
                          >
                            <FaRegTrashCan className='text-[18px] text-red-600' />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className='flex items-center justify-center mt-5'>
          <Pagination count={Math.ceil(catData.length / 10)} color="primary" />
        </div>
      </div>
    </>
  );
}

export default Category;