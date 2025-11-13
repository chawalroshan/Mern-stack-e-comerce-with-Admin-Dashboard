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
import { FiEdit } from "react-icons/fi";
import { FaRegEye, FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData } from '../../utils/api';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const SubCategoryList = () => {
  const context = useContext(MyContext);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchDataFromApi('/api/subcategory');
      if (res?.success) {
        setSubCategories(res.subcategories || []);
      } else {
        context.openAlertBox({
          type: 'error',
          msg: res?.message || 'Failed to fetch subcategories'
        });
      }
    } catch (err) {
      console.error(err);
      context.openAlertBox({
        type: 'error',
        msg: 'Error fetching subcategories'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const res = await deleteData(`/api/subcategory/delete/${id}`);
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
      console.error(err);
      context.openAlertBox({
        type: 'error',
        msg: 'Error deleting subcategory'
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Pagination logic
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubCategories = subCategories.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-[16px] text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <section className='p-5 bg-gray-50'>
      <div className='form py-3 px-8'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-[18px] font-[700] text-black'>Sub Category List</h3>
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

        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          <TableContainer className='shadow-md bg-white rounded-md'>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox {...label} />
                  </TableCell>
                  <TableCell className='text-[14px] font-[500] text-black'>Image</TableCell>
                  <TableCell className='text-[14px] font-[500] text-black'>Category Name</TableCell>
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
                        <Link to={`/sub-category/${sub._id}`}>
                          <img
                            src={sub.images?.[0] || '/no-image.jpg'}
                            alt={sub.name}
                            className="w-[120px] h-[60px] object-cover rounded-md border border-[rgba(0,0,0,0.2)]"
                          />
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={sub.parentId?.name || 'N/A'}
                          variant="outlined"
                          className='text-sm'
                        />
                      </TableCell>

                      <TableCell className='text-[14px] text-black'>
                        {sub.name}
                      </TableCell>

                      <TableCell>
                        <div className='flex gap-2'>
                          <Tooltip title="Edit">
                            <Link to={`/sub-category/edit/${sub._id}`}>
                              <Button className='min-w-[40px]'>
                                <FiEdit className='text-[18px]' />
                              </Button>
                            </Link>
                          </Tooltip>
                          <Tooltip title="View">
                            <Link to={`/sub-category/${sub._id}`}>
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
                    <TableCell colSpan={5} align="center" className='text-[14px] text-gray-600'>
                      No subcategories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className='flex justify-center items-center mt-5'>
            <Pagination
              count={totalPages || 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubCategoryList;