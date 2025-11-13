import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import { deleteImages, editData, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';

const EditSubCategory = () => {
  const context = useContext(MyContext);
  const { id: paramId } = useParams();

  // Subcategory ID: either from fullscreen panel context or route param
  const subCatId = context.isOpenFullScreenPanel?.subCatId || paramId;

  const [formFields, setFormFields] = useState({
    name: '',
    categoryId: '',
    categoryName: '',
    images: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // ✅ Load subcategory and all categories
  useEffect(() => {
    if (subCatId) fetchSubCategoryData();
    else setLoading(false);
    fetchCategories();
  }, [subCatId]);

  // Fetch single subcategory data
  const fetchSubCategoryData = async () => {
    try {
      setLoading(true);
      const res = await fetchDataFromApi(`/api/subcategory/${subCatId}`);
      if (res && res.success) {
        const subCat = res.subCategory; // ✅ corrected
        setFormFields({
          name: subCat.name || '',
          categoryId: subCat.parentId?._id || '', // parentId from populate
          categoryName: subCat.parentId?.name || '',
          images: subCat.images || [],
        });
      } else {
        context.openAlertBox({ type: 'error', msg: res?.message || 'Failed to fetch subcategory data' });
      }
    } catch (err) {
      console.error('Error fetching subcategory:', err);
      context.openAlertBox({ type: 'error', msg: 'Error loading subcategory' });
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch all categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await fetchDataFromApi('/api/category');
      console.log('Categories response:', res); // 👈 Add this
      if (res && res.success) {
        setCategories(res.categories || res.data || []); // ✅ fallback for both keys
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };
  

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.name.trim()) return;

    try {
      setSubmitting(true);
      const res = await editData(`/api/subcategory/update/${subCatId}`, {
        name: formFields.name.trim(),
        parentId: formFields.categoryId,
        images: formFields.images,
      });

      if (res && res.success) {
        context.openAlertBox({ type: 'success', msg: 'Subcategory updated successfully!' });
        context.setIsOpenFullScreenPanel({ open: false });
        window.location.reload();
      } else {
        context.openAlertBox({ type: 'error', msg: res.message || 'Failed to update subcategory' });
      }
    } catch (err) {
      console.error('Error updating subcategory:', err);
      context.openAlertBox({ type: 'error', msg: 'Error updating subcategory' });
    } finally {
      setSubmitting(false);
    }
  };

  // Remove uploaded image
  const removeImage = async (index) => {
    const image = formFields.images?.[index];
    if (!image) return;

    try {
      const res = await deleteImages('/api/subcategory/deleteImage', { image });
      console.log('Image deleted:', res);
    } catch (err) {
      console.error('Failed to delete image:', err);
    }

    setFormFields((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // UI: loading state
  if (loading) {
    return (
      <section className='p-5 bg-gray-50'>
        <div className='flex items-center justify-center h-[70vh]'>
          <p className='text-lg'>Loading subcategory data...</p>
        </div>
      </section>
    );
  }

  if (!subCatId) {
    return (
      <section className='p-5 bg-gray-50'>
        <div className='flex items-center justify-center h-[70vh]'>
          <p className='text-lg text-red-500'>No subcategory selected</p>
        </div>
      </section>
    );
  }

  // UI: main form
  return (
    <section className='p-5 bg-gray-50'>
      <div className='mb-4'>
        <h2 className='text-[24px] font-bold'>Edit Subcategory</h2>
        <p className='text-gray-600 text-sm'>Update subcategory name, category, and images</p>
      </div>

      <form className='form py-3 px-8 bg-white rounded-lg shadow-md' onSubmit={handleSubmit}>
        <div className='scroll max-h-[65vh] overflow-y-scroll pr-4'>
          <div className='col w-full p-5 px-0'>
            
            {/* Subcategory Name */}
            <div className="grid grid-cols-1 mb-3">
              <div className="col w-full md:w-[50%]">
                <h3 className='text-[14px] font-[500] mb-1 text-black'>Subcategory Name</h3>
                <input
                  type='text'
                  name='name'
                  value={formFields.name}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                  placeholder='Enter subcategory name'
                  required
                />
              </div>
            </div>

            {/* Parent Category */}
            <div className="grid grid-cols-1 mb-5">
              <div className="col w-full md:w-[50%]">
                <h3 className='text-[14px] font-[500] mb-1 text-black'>Parent Category</h3>
                <select
                  name='categoryId'
                  value={formFields.categoryId}
                  onChange={handleChange}
                  className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-2 text-sm bg-white'
                >
                  <option value=''>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images */}
            <h3 className='text-[18px] font-[700] mb-1 text-black'>Subcategory Images</h3>
            <p className='text-sm text-gray-500 mb-3'>Upload or manage subcategory images</p>

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
                      alt={`Subcategory image ${index + 1}`}
                      effect='blur'
                      wrapperProps={{ style: { transitionDelay: "0.5s" } }}
                      src={img}
                    />
                  </div>
                </div>
              ))}

              {/* Upload new image */}
              <UploadBox
                multiple={true}
                url='/api/subcategory/uploadImage'
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
            {submitting ? 'Updating...' : 'Update Subcategory'} <MdCloudUpload className='text-[18px]' />
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditSubCategory;
