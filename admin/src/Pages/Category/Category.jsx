// Pages/Category/Category.jsx
import Button from '@mui/material/Button';
import React, { useContext, useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { FiEdit } from "react-icons/fi";
import { FaRegEye, FaRegTrashCan, FaChevronRight } from "react-icons/fa6";
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData } from '../../utils/api';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Category = () => {
  const [catData, setCatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const context = useContext(MyContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi('/api/category');
      if (res && res.success) {
        setCatData(res.data || []); // Use nested data structure
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All subcategories will also be deleted.')) {
      try {
        const res = await deleteData(`/api/category/deleteCategory/${id}`);
        if (res && res.success) {
          alert('Category deleted successfully');
          fetchCategories();
        } else {
          alert('Failed to delete category');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Error deleting category');
      }
    }
  };

  const renderCategoryRow = (category, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category._id];

    return (
      <React.Fragment key={category._id}>
        <TableRow hover>
          <TableCell padding="checkbox">
            <Checkbox {...label} size='small' />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 20}px` }}>
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(category._id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FaChevronRight 
                    className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                  />
                </button>
              )}
              {!hasChildren && <div className="w-4" />}
              <Link to={`/category/${category._id}`}>
                <img
                  src={category.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={category.name}
                  className="w-[100px] h-[50px] object-contain rounded-md hover:scale-105 transition"
                />
              </Link>
            </div>
          </TableCell>
          <TableCell>
            <div style={{ paddingLeft: `${depth * 20}px` }}>
              {category.name}
              <span className="text-xs text-gray-500 ml-2">
                (Level {category.level})
              </span>
            </div>
          </TableCell>
          <TableCell align="right">
            <div className="flex items-center justify-end gap-2">
              <Tooltip title={`Add ${getNextLevelName(category.level)}`}>
                <Button 
                  onClick={() => context.setIsOpenFullScreenPanel({ 
                    open: true, 
                    model: `Add New Sub Category`,
                    parentId: category._id 
                  })}
                  sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#f0f8ff', p: 0 }}
                >
                  <FaPlus className='text-[14px] text-blue-600' />
                </Button>
              </Tooltip>
              <Tooltip title="Edit Category">
                <Link to={`/category/edit/${category._id}`}>
                  <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                    <FiEdit className='text-[18px] text-gray-800' />
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip title="View Category">
                <Link to={`/category/${category._id}`}>
                  <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                    <FaRegEye className='text-[18px] text-gray-800' />
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip title="Delete Category">
                <Button 
                  onClick={() => handleDelete(category._id)}
                  sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}
                >
                  <FaRegTrashCan className='text-[18px] text-red-600' />
                </Button>
              </Tooltip>
            </div>
          </TableCell>
        </TableRow>
        
        {/* Render children if expanded */}
        {hasChildren && isExpanded && category.children.map(child => 
          renderCategoryRow(child, depth + 1)
        )}
      </React.Fragment>
    );
  };

  const getNextLevelName = (currentLevel) => {
    const levelNames = {
      1: 'Subcategory',
      2: 'Sub-subcategory',
      3: 'Child Category',
      4: 'Child Category'
    };
    return levelNames[currentLevel] || 'Child Category';
  };

  return (
    <>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between px-2 py-3 gap-3'>
        <h2 className='text-[18px] font-bold'>Category List</h2>
        <div className='flex items-center gap-3 ml-auto'>
          <Button className='!bg-green-600 !text-white px-4 py-1 rounded'>Export</Button>
          <Button
            className='btn-blue btn-sm'
            onClick={() => context.setIsOpenFullScreenPanel({ 
              open: true, 
              model: 'Add New Category',
              level: 1 
            })}
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
                catData.map(category => renderCategoryRow(category))
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