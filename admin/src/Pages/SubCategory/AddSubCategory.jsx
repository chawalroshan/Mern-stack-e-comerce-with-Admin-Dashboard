// Pages/SubCategory/AddSubCategory.jsx
import React, { useState, useEffect, useContext } from 'react';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { postData, deleteImages, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const AddSubCategory = () => {
  const context = useContext(MyContext);
  const [categories, setCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');
  const [formFields, setFormFields] = useState({
    categoryId: '',
    subCatName: '',
    images: [],
    level: 2 // Default to subcategory level
  });

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetchDataFromApi('/api/category');
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

  const handleParentChange = (e) => {
    const parentId = e.target.value;
    setSelectedParent(parentId);
    
    // Auto-calculate level based on parent
    const parentCategory = categories.find(cat => cat._id === parentId);
    const newLevel = parentCategory ? parentCategory.level + 1 : 2;
    
    setFormFields(prev => ({ 
      ...prev, 
      categoryId: parentId,
      level: newLevel
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const removeImage = async (index) => {
    const image = formFields.images[index];
    if (!image) return;
    try {
      await deleteImages('/api/category/deleteImage', { image });
    } catch (err) {
      console.error('Error deleting image:', err);
    }
    setFormFields(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.subCatName.trim() || !formFields.categoryId) return;

    try {
      setSubmitting(true);

      const res = await postData('/api/category/create', {
        parentId: formFields.categoryId,
        name: formFields.subCatName.trim(),
        images: formFields.images,
      });

      if (res && res.success) {
        context.openAlertBox({ type: 'success', msg: `${getCategoryLevelName(formFields.level)} created successfully!` });
        context.setIsOpenFullScreenPanel({ open: false });
        window.location.reload();
      } else {
        context.openAlertBox({ type: 'error', msg: res.message || 'Failed to create category' });
      }
    } catch (err) {
      console.error(err);
      context.openAlertBox({ type: 'error', msg: 'Error creating category' });
    } finally {
      setSubmitting(false);
    }
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

  const getParentOptions = () => {
    return categories.filter(cat => cat.level < 4); // Limit nesting to 4 levels max
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
      <form className='form py-3 px-8' onSubmit={handleSubmit}>
        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          <div className='col w-full p-5 px-0'>

            <div className="grid grid-cols-2 gap-5 mb-3">
              <div className="col">
                <h3 className='text-[14px] font-[500] mb-1'>Select Parent Category</h3>
                <Select
                  name='categoryId'
                  className='w-full'
                  size='small'
                  value={selectedParent}
                  onChange={handleParentChange}
                >
                  {getParentOptions().map(cat => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {'-'.repeat(cat.level - 1)} {cat.name} {cat.level > 1 && `(Level ${cat.level})`}
                    </MenuItem>
                  ))}
                </Select>
                <p className='text-xs text-gray-500 mt-1'>
                  Selected: {getCategoryLevelName(formFields.level)}
                </p>
              </div>

              <div className="col">
                <h3 className='text-[14px] font-[500] mb-1'>
                  {getCategoryLevelName(formFields.level)} Name
                </h3>
                <input
                  type='text'
                  name='subCatName'
                  value={formFields.subCatName}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                  placeholder={`Enter ${getCategoryLevelName(formFields.level).toLowerCase()} name`}
                />
              </div>
            </div>

            <h3 className='text-[16px] font-[700] mb-3 mt-4 text-black'>
              {getCategoryLevelName(formFields.level)} Image
            </h3>

            <div className="grid grid-cols-7 gap-4">
              {formFields.images.map((img, index) => (
                <div key={index} className='uploadboxWrapper relative'>
                  <span
                    onClick={() => removeImage(index)}
                    className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer'
                  >
                    <IoMdClose className='text-white text-[17px]' />
                  </span>
                  <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] bg-gray-100'>
                    <LazyLoadImage
                      className='w-full h-full object-cover'
                      alt='category'
                      effect='blur'
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

        <Button
          disabled={submitting || !formFields.subCatName.trim() || !formFields.categoryId}
          type='submit'
          className='btn-blue btn-lg w-full gap-2'
        >
          {submitting ? 'Publishing...' : `Publish ${getCategoryLevelName(formFields.level)}`} 
          <MdCloudUpload className='text-[18px]' />
        </Button>
      </form>
    </section>
  );
};

export default AddSubCategory;