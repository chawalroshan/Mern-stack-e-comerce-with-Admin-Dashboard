import Button from '@mui/material/Button'
import React, { useContext, useState, useEffect } from 'react'
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
import SearchBox from '../../components/SearchBox/SearchBox';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData } from '../../utils/api';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const HomeSliderBanners = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  const context = useContext(MyContext);

  // Fetch sliders data
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi('/api/sliders');
      if (res && res.success) {
        setSliders(res.sliders || []);
        setTotalPages(Math.ceil((res.sliders || []).length / perPage));
      } else {
        context?.openAlertBox?.({
          type: 'error',
          msg: res?.message || 'Failed to fetch sliders'
        });
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      context?.openAlertBox?.({
        type: 'error',
        msg: 'Error fetching sliders'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Filter sliders based on search
  const filteredSliders = sliders.filter((slider) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      slider.title?.toLowerCase().includes(term) ||
      slider.link?.toLowerCase().includes(term)
    );
  });

  // Pagination
  const paginatedSliders = filteredSliders.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Delete single slider
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) return;

    try {
      const res = await deleteData(`/api/sliders/${id}`);
      if (res && res.success) {
        context?.openAlertBox?.({
          type: 'success',
          msg: 'Slider deleted successfully'
        });
        fetchSliders();
      } else {
        context?.openAlertBox?.({
          type: 'error',
          msg: res?.message || 'Failed to delete slider'
        });
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      context?.openAlertBox?.({
        type: 'error',
        msg: 'Error deleting slider'
      });
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected slider(s)?`)) return;

    try {
      setBulkDeleting(true);
      // Delete each slider individually (or implement bulk delete in backend)
      for (const id of selectedIds) {
        await deleteData(`/api/sliders/${id}`);
      }
      context?.openAlertBox?.({
        type: 'success',
        msg: `${selectedIds.length} slider(s) deleted successfully`
      });
      setSelectedIds([]);
      fetchSliders();
    } catch (error) {
      console.error('Error deleting sliders:', error);
      context?.openAlertBox?.({
        type: 'error',
        msg: 'Error deleting sliders'
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  // Selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(paginatedSliders.map((slider) => slider._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (sliderId) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(sliderId)
        ? prevSelected.filter((id) => id !== sliderId)
        : [...prevSelected, sliderId]
    );
  };

  const isAllSelected = paginatedSliders.length > 0 && 
    paginatedSliders.every((slider) => selectedIds.includes(slider._id));
  const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

  // Edit slider - open in full screen panel
  const handleEdit = (slider) => {
    context?.setIsOpenFullScreenPanel({
      open: true,
      model: 'Edit Home Slide',
      data: slider // Pass slider data for editing
    });
  };

  return (
    <>
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between px-2 py-3 gap-3'>
        <h2 className='text-[18px] font-bold'>Home Slider Banners</h2>
        <div className='flex items-center gap-3 ml-auto'>
          <Button className='!bg-green-600 !text-white px-4 py-1 rounded'>Export</Button>
          <Button
            className='btn-blue btn-sm'
            onClick={() => context.setIsOpenFullScreenPanel({ open: true, model: 'Add Home Slide' })}
          >
            <FaPlus className='mr-2' /> Add Home Slide
          </Button>
        </div>
      </div>

      <div className="card my-4 shadow-md bg-white p-5 rounded-md">
        {/* Search and Bulk Actions */}
        <div className='flex items-center justify-between mb-4'>
          <div className="w-[30%]">
            <SearchBox
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search sliders..."
            />
          </div>
          
          <div className='flex items-center gap-3'>
            <Button
              variant='contained'
              color='error'
              size='small'
              disabled={selectedIds.length === 0 || bulkDeleting}
              onClick={handleBulkDelete}
              sx={{ 
                textTransform: 'none', 
                minWidth: 'auto', 
                px: 1.5, 
                py: 0.25, 
                fontSize: 11,
                height: 28
              }}
            >
              {bulkDeleting ? 'Deleting...' : `Delete (${selectedIds.length})`}
            </Button>
          </div>
        </div>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" width={60}>
                  <Checkbox
                    {...label}
                    size='small'
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading sliders...
                  </TableCell>
                </TableRow>
              ) : paginatedSliders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {searchTerm ? 'No sliders match your search' : 'No sliders found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSliders.map((slider) => (
                  <TableRow hover key={slider._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        {...label}
                        size='small'
                        checked={selectedIds.includes(slider._id)}
                        onChange={() => handleSelectOne(slider._id)}
                        disabled={bulkDeleting}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <img
                          src={`/uploads/${slider.image}`} // Adjust path based on your backend
                          alt={slider.title || 'Slider image'}
                          className="w-[200px] h-[80px] object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x80?text=No+Image';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {slider.title || 'No Title'}
                    </TableCell>
                    <TableCell>
                      {slider.link ? (
                        <a 
                          href={slider.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {slider.link.length > 30 ? `${slider.link.substring(0, 30)}...` : slider.link}
                        </a>
                      ) : (
                        'No Link'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        slider.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {slider.status ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip title="Edit Slider">
                          <Button 
                            sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}
                            onClick={() => handleEdit(slider)}
                          >
                            <FiEdit className='text-[18px] text-gray-800' />
                          </Button>
                        </Tooltip>
                        <Tooltip title="View Slider">
                          <Button 
                            sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}
                            onClick={() => {
                              // Implement view functionality or preview
                              window.open(`/uploads/${slider.image}`, '_blank');
                            }}
                          >
                            <FaRegEye className='text-[18px] text-gray-800' />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete Slider">
                          <Button
                            sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}
                            onClick={() => handleDelete(slider._id)}
                          >
                            <FaRegTrashCan className='text-[18px] text-gray-800' />
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

        {/* Pagination */}
        {filteredSliders.length > 0 && (
          <div className='flex items-center justify-center mt-5'>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </div>
        )}
      </div>
    </>
  )
}

export default HomeSliderBanners;