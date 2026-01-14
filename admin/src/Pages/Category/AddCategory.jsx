import React, { useContext, useState, useEffect } from 'react';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { deleteImages, postData, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const AddCategory = () => {
  const context = useContext(MyContext);
  const [categories, setCategories] = useState([]);
  const [formFields, setFormFields] = useState({
    name: '',
    images: [],
    parentId: '',
    level: 1 // Default to top-level category
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchDataFromApi('/api/category/tree');
      if (res && res.success) {
        setCategories(res.categories || []);
      } else {
        context.openAlertBox({ type: 'error', msg: 'Failed to fetch categories' });
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      context.openAlertBox({ type: 'error', msg: 'Error loading categories' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'parentId') {
      const selectedCategory = categories.find(cat => cat._id === value);
      const newLevel = selectedCategory ? selectedCategory.level + 1 : 1;
      
      setFormFields(prev => ({
        ...prev,
        [name]: value,
        level: newLevel
      }));
    } else {
      setFormFields(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.name.trim()) return;
    
    try {
      setSubmitting(true);
      const res = await postData('/api/category/create', {
        name: formFields.name.trim(),
        images: formFields.images,
        parentId: formFields.parentId || null
      });
      
      if (res && res.success) {
        setFormFields({ 
          name: '', 
          images: [], 
          parentId: '', 
          level: 1 
        });
        context.openAlertBox({ 
          type: 'success', 
          msg: `${getCategoryLevelName(formFields.level)} created successfully!` 
        });
        context.setIsOpenFullScreenPanel({ open: false });
        // Instead of reloading, you might want to use a callback to refresh the parent component
        window.location.reload();
      } else {
        context.openAlertBox({ 
          type: 'error', 
          msg: res.message || 'Failed to create category' 
        });
      }
    } catch (err) {
      console.error('Error creating category:', err);
      context.openAlertBox({ 
        type: 'error', 
        msg: err.message || 'Error creating category' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = async (index) => {
    const image = formFields.images?.[index];
    if (!image) return;

    try {
      await deleteImages('/api/category/deleteImage', { image });
    } catch (err) {
      console.error('Failed to delete image:', err);
    }

    setFormFields((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const getCategoryLevelName = (level) => {
    const levelNames = {
      1: 'Category',
      2: 'Subcategory',
      3: 'Sub-subcategory',
      4: 'Child Category'
    };
    return levelNames[level] || `Level ${level} Category`;
  };

  const getAvailableParentCategories = () => {
    // Only show categories that are below level 4 (max nesting)
    return categories.filter(cat => cat.level < 4);
  };

  if (loading) {
    return (
      <section className='p-5 bg-gray-50'>
        <div className='flex items-center justify-center h-[70vh]'>
          <p className='text-lg'>Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className='p-5 bg-gray-50'>
      <div className='mb-4'>
        <h2 className='text-[24px] font-bold'>Add New Category</h2>
        <p className='text-gray-600 text-sm'>
          Create a new {getCategoryLevelName(formFields.level).toLowerCase()}
        </p>
      </div>

      <form className='form py-3 px-8 bg-white rounded-lg shadow-md' onSubmit={handleSubmit}>
        <div className='scroll max-h-[65vh] overflow-y-scroll pr-4'>
          <div className='col w-full p-5 px-0'>
            
            {/* Parent Category Selection */}
            <div className="grid grid-cols-1 mb-5">
              <div className="col w-full md:w-[50%]">
                <h3 className='text-[14px] font-[500] mb-1 text-black'>Parent Category (Optional)</h3>
                <Select
                  name='parentId'
                  className='w-full'
                  size='small'
                  value={formFields.parentId}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select a parent category (for top-level, leave empty)</em>
                  </MenuItem>
                  {getAvailableParentCategories().map(cat => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {'-'.repeat(cat.level - 1)} {cat.name} 
                      {cat.level > 1 && ` (Level ${cat.level})`}
                    </MenuItem>
                  ))}
                </Select>
                <p className='text-xs text-gray-500 mt-1'>
                  {formFields.parentId 
                    ? `Creating: ${getCategoryLevelName(formFields.level)}` 
                    : 'Creating: Top-level Category'
                  }
                </p>
              </div>
            </div>

            {/* Category Name */}
            <div className="grid grid-cols-1 mb-5">
              <div className="col w-full md:w-[50%]">
                <h3 className='text-[14px] font-[500] mb-1 text-black'>
                  {getCategoryLevelName(formFields.level)} Name *
                </h3>
                <input
                  type='text'
                  name='name'
                  value={formFields.name}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                  placeholder={`Enter ${getCategoryLevelName(formFields.level).toLowerCase()} name`}
                  required
                />
              </div>
            </div>

            {/* Category Images */}
            <h3 className='text-[18px] font-[700] mb-1 text-black'>
              {getCategoryLevelName(formFields.level)} Images
            </h3>
            <p className='text-sm text-gray-500 mb-3'>
              Upload images for this category (optional)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {formFields.images?.map((img, index) => (
                <div key={index} className='uploadboxWrapper relative'>
                  <span
                    onClick={() => removeImage(index)}
                    className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer hover:bg-red-700 transition'
                  >
                    <IoMdClose className='text-white text-[17px]' />
                  </span>
                  <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100'>
                    <LazyLoadImage
                      className='w-full h-full object-cover'
                      alt={`Category image ${index + 1}`}
                      effect='blur'
                      wrapperProps={{ style: { transitionDelay: "0.5s" } }}
                      src={img}
                    />
                  </div>
                </div>
              ))}

              <UploadBox
                multiple={true}
                url='/api/category/uploadImage'
                onChange={(images) =>
                  setFormFields(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...(images || []).flat()]
                  }))
                }
              />
            </div>
          </div>
        </div>

        <hr className='my-5' />
        
        <div className='flex gap-3'>
          <Button
            type='button'
            onClick={() => context.setIsOpenFullScreenPanel({ open: false })}
            className='btn-lg gap-2 !bg-gray-500 !text-white hover:!bg-gray-600'
          >
            Cancel
          </Button>
          <Button
            disabled={submitting || !formFields.name.trim()}
            type='submit'
            className='btn-blue btn-lg flex-1 gap-2'
          >
            {submitting ? 'Creating...' : `Create ${getCategoryLevelName(formFields.level)}`} 
            <MdCloudUpload className='text-[18px]' />
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddCategory;