import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { FiEdit, FiSearch } from "react-icons/fi";
import { FaRegEye, FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData } from '../../utils/api';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const SubCategoryList = () => {
  const context = useContext(MyContext);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Filter subcategories when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSubCategories(subCategories);
    } else {
      const filtered = subCategories.filter(sub => 
        sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.parentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubCategories(filtered);
    }
    setPage(1); // Reset to first page when search changes
  }, [searchTerm, subCategories]);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchDataFromApi('/api/category/subcategories');

      if (res?.success) {
        const subcats = res.subCategories || [];
        setSubCategories(subcats);
        setFilteredSubCategories(subcats);
      } else {
        context.openAlertBox({
          type: 'error',
          msg: res?.message || 'Failed to fetch subcategories'
        });
      }
    } catch (err) {
      context.openAlertBox({
        type: 'error',
        msg: 'Error fetching subcategories: ' + err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;

    try {
      const res = await deleteData(`/api/category/deleteCategory/${id}`);
      if (res?.success) {
        context.openAlertBox({
          type: 'success',
          msg: 'Subcategory deleted successfully!'
        });
        fetchSubCategories();
      } else {
        context.openAlertBox({
          type: 'error',
          msg: res?.message || 'Failed to delete subcategory'
        });
      }
    } catch (err) {
      context.openAlertBox({
        type: 'error',
        msg: 'Error deleting subcategory'
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Pagination logic - use filtered data
  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubCategories = filteredSubCategories.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-[16px] text-gray-600">Loading subcategories...</p>
      </div>
    );
  }

  return (
    <section className='p-5 bg-gray-50'>
      <div className='form py-3 px-8'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-[18px] font-[700] text-black'>Sub Category List</h3>
          <div className='flex gap-2'>
            <Button
              variant='outlined'
              color='primary'
              onClick={fetchSubCategories}
            >
              Refresh
            </Button>
            <Button
              variant='contained'
              color='primary'
              className='btn-blue'
              onClick={() => context.setIsOpenFullScreenPanel({
                open: true,
                model: 'Add New Sub Category'
              })}
            >
              <FaPlus className='mr-2' /> Add Subcategory
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className='mb-4'>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search subcategories by name, parent category, or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Button 
                    size="small" 
                    onClick={clearSearch}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </Button>
                </InputAdornment>
              ),
            }}
            className="bg-white"
          />
        </div>

        {/* Debug Info */}
        <div className='mb-4 p-3 bg-blue-50 rounded-md'>
          <p className='text-sm text-blue-700'>
            Total Subcategories: <strong>{subCategories.length}</strong>
            {searchTerm && (
              <span className='ml-2'>
                • Filtered: <strong>{filteredSubCategories.length}</strong>
              </span>
            )}
            {subCategories.length === 0 && ' - Check browser console for details'}
          </p>
        </div>

        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          <TableContainer className='shadow-md bg-white rounded-md'>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox {...label} />
                  </TableCell>
                  <TableCell className='text-[14px] font-[500] text-black'>Image</TableCell>
                  <TableCell className='text-[14px] font-[500] text-black'>Level</TableCell>
                  <TableCell className='text-[14px] font-[500] text-black'>Parent Category</TableCell>
                  <TableCell className='text-[14px] font-[500] text-black'>Subcategory Name</TableCell>
                  <TableCell className='text-[14px] font-[500] text-black'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSubCategories.length ? (
                  paginatedSubCategories.map((sub) => (
                    <TableRow key={sub._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox {...label} />
                      </TableCell>

                      <TableCell>
                        <img
                          src={sub.images?.[0] || '/no-image.jpg'}
                          alt={sub.name}
                          className="max-w-[80px] max-h-[60px] w-auto h-auto object-contain rounded-md border border-[rgba(0,0,0,0.2)]"
                          onError={(e) => {
                            e.target.src = '/no-image.jpg';
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`Level ${sub.level}`}
                          color={
                            sub.level === 2 ? 'primary' :
                              sub.level === 3 ? 'secondary' :
                                'default'
                          }
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={sub.parentId?.name || 'No Parent'}
                          variant="outlined"
                          className='text-sm'
                        />
                      </TableCell>

                      <TableCell className='text-[14px] text-black font-medium'>
                        {sub.name}
                      </TableCell>

                      <TableCell>
                        <div className='flex gap-2'>
                          <Tooltip title="Edit">
                            <Link to={`/category/edit/${sub._id}`}>
                              <Button className='min-w-[40px]'>
                                <FiEdit className='text-[18px]' />
                              </Button>
                            </Link>
                          </Tooltip>
                          <Tooltip title="View">
                            <Link to={`/category/${sub._id}`}>
                              <Button className='min-w-[40px]'>
                                <FaRegEye className='text-[18px]' />
                              </Button>
                            </Link>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              className='min-w-[40px]'
                              onClick={() => handleDelete(sub._id)}
                            >
                              <FaRegTrashCan className='text-[18px]' />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className='text-[14px] text-gray-600 py-8'>
                      <div className='flex flex-col items-center justify-center'>
                        <p className='text-lg mb-2'>
                          {searchTerm ? 'No matching subcategories found' : 'No subcategories found'}
                        </p>
                        <p className='text-sm text-gray-500 mb-4'>
                          {searchTerm && 'Try adjusting your search terms'}
                        </p>
                        {searchTerm ? (
                          <Button
                            variant='outlined'
                            onClick={clearSearch}
                          >
                            Clear Search
                          </Button>
                        ) : (
                          <Button
                            variant='contained'
                            onClick={() => context.setIsOpenFullScreenPanel({
                              open: true,
                              model: 'Add New Sub Category'
                            })}
                          >
                            Add Your First Subcategory
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredSubCategories.length > 0 && (
            <div className='flex justify-center items-center mt-5'>
              <Pagination
                count={totalPages || 1}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubCategoryList;