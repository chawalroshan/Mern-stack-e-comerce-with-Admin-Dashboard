import Button from '@mui/material/Button'
import React, { useContext, useEffect, useState } from 'react'
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
import { fetchDataFromApi, deleteData, postData } from '../../utils/api';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };



const Products = () => {

  const [categoryFilterVal, setCategoryFilterVal] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const perPage = 10;

  const handleChangeCatFilter = (event) => {
    setCategoryFilterVal(event.target.value);
    // extend later to filter by category via API if needed
  };

  const filteredProducts = products.filter((product) => {
    if (!debouncedSearchTerm.trim()) return true;
    const term = debouncedSearchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term) ||
      product.category?.name?.toLowerCase().includes(term) ||
      product.subCat?.toLowerCase().includes(term) ||
      product.thirdsubCat?.toLowerCase().includes(term)
    );
  });
  const context = useContext(MyContext);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
  
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi('/api/product/getAllProducts', {
        page: currentPage,
        perPage,
      });

      if (res && res.success) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setSelectedIds([]);
      } else {
        context?.openAlertBox?.({
          type: 'error',
          msg: res?.message || 'Failed to fetch products',
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      context?.openAlertBox?.({
        type: 'error',
        msg: 'Error fetching products',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await deleteData(`/api/product/delete/${id}`);
      if (res && res.success) {
        context?.openAlertBox?.({
          type: 'success',
          msg: 'Product deleted successfully',
        });
        fetchProducts(page);
      } else {
        context?.openAlertBox?.({
          type: 'error',
          msg: res?.message || 'Failed to delete product',
        });
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      context?.openAlertBox?.({
        type: 'error',
        msg: 'Error deleting product',
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(filteredProducts.map((product) => product._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (productId) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected product(s)?`)) return;

    try {
      setBulkDeleting(true);
      const res = await postData('/api/product/deleteMany', {
        productIds: selectedIds
      });

      if (res && res.success) {
        context?.openAlertBox?.({
          type: 'success',
          msg: res?.message || 'Selected products deleted successfully',
        });
        setSelectedIds([]);
        fetchProducts(page);
      } else {
        context?.openAlertBox?.({
          type: 'error',
          msg: res?.message || 'Failed to delete selected products',
        });
      }
    } catch (error) {
      console.error('Failed to delete selected products:', error);
      context?.openAlertBox?.({
        type: 'error',
        msg: 'Error deleting selected products',
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => selectedIds.includes(product._id));
  const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

  return (
    <>
      <div className='flex items-center justify-between px-2 py-0 mt-3'>
        <h2 className='text-[18px] font-bold  '>Products <span>Material UI Table</span></h2>

        <div className='col w-[25%] ml-auto flex items-center justify-end gap-3 '>
          < Button className='btn !bg-green-600 btn-sm '>Export</Button>
          < Button className='btn-blue btn-sm ' onClick={() => context.setIsOpenFullScreenPanel({
            open: true,
            model: 'Add Product'
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

          <div className='cpl w-[20%] ml-auto flex items-center gap-3 justify-end'>
            <SearchBox
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
                setSelectedIds([]);
              }}
            />
            <Button
              variant='contained'
              color='error'
              size='small'
              disabled={selectedIds.length === 0 || bulkDeleting}
              onClick={handleBulkDelete}
              sx={{ textTransform: 'none', minWidth: 0, px: 1, py: 0.5, fontSize: 12 }}
            >
              {bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}
            </Button>
          </div>


        </div>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    {...label}
                    size='small'
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product, idx) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={product._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        {...label}
                        size='small'
                        checked={selectedIds.includes(product._id)}
                        onChange={() => handleSelectOne(product._id)}
                        disabled={bulkDeleting}
                      />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: 300 }}>
                        <div>
                          <Link to={`/product/${product._id}`}>
                            <img
                              src={product.images?.[0] || 'https://via.placeholder.com/80'}
                              alt={product.name}
                              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, transition: 'transform 0.2s' }}
                            />
                          </Link>
                        </div>
                        <div style={{ width: '75%' }}>
                          <h3 style={{ fontSize: 12, fontWeight: 600, lineHeight: '16px', cursor: 'pointer' }}>
                            {product.name}
                          </h3>
                          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.7)' }}>
                            {product.brand || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category?.name || product.catName || 'N/A'}
                    </TableCell>
                    <TableCell>{product.subCat || product.thirdsubCat || 'N/A'}</TableCell>
                    <TableCell align="right">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.7)', textDecoration: 'line-through' }}>
                          {product.oldePrice ? `Rs.${product.oldePrice}` : '-'}
                        </span>
                        <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
                          Rs.{product.price}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div style={{ width: 150 }}>
                        <span style={{ fontSize: 14, color: '#2563eb', fontWeight: 600 }}>
                          {product.countInStock || 0}
                        </span>{" "}
                        sales
                        <ProgressBar
                          value={Math.min(100, (product.countInStock || 0))}
                          status={idx === 0 ? 'error' : idx === 1 ? 'info' : idx === 2 ? 'success' : 'warning'}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Tooltip title="Edit Product" placement='top'>
                          <Link to={`/product/edit/${product._id}`}>
                            <Button sx={{ minWidth: 30, width: 20, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                              <FiEdit style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} />
                            </Button>
                          </Link>
                        </Tooltip>
                        <Tooltip title="View Product" placement='top'>
                          <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}><FaRegEye style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} /></Button>
                        </Tooltip>
                        <Tooltip title="Delete Product" placement='top'>
                          <Button
                            onClick={() => handleDelete(product._id)}
                            sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}
                          >
                            <FaRegTrashCan style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} />
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
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
    </>
  )
}

export default Products
