import React, { useContext, useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import UploadBox from '../../components/UploadBox/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MdCloudUpload } from "react-icons/md";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';

const AddProduct = () => {
  const context = useContext(MyContext);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    price: '',
    oldPrice: '',
    isFeatured: false,
    stock: '',
    brand: '',
    discount: '',
    productRam: '',
    productWeight: '',
    size: '',
    rating: 0,
    images: [],
  });

  const [ramOptions, setRamOptions] = useState(['4GB', '6GB', '8GB', '12GB']);
  const [sizeOptions, setSizeOptions] = useState(['S', 'M', 'L', 'XL']);
  const [weightOptions, setWeightOptions] = useState(['1kg', '2kg', '5kg']);
  const [newOption, setNewOption] = useState({
    ram: '',
    size: '',
    weight: '',
  });
  const [addMode, setAddMode] = useState({
    ram: false,
    size: false,
    weight: false,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetchDataFromApi('/api/category');
      if (res && res.success && Array.isArray(res.categories)) {
        const topCategories = res.categories.filter(cat => !cat.parentId);
        setCategories(topCategories);
      } else {
        context?.openAlertBox?.({ type: 'error', msg: res?.message || 'Failed to fetch categories' });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      context?.openAlertBox?.({ type: 'error', msg: 'Error fetching categories' });
    }
  };

  const fetchSubCategories = async () => {
    try {
      let res;
      
      try {
        res = await fetchDataFromApi('/api/category/subcategories');
      } catch (error) {
        try {
          res = await fetchDataFromApi('/api/subcategories');
        } catch (secondError) {
          setSubCategories([]);
          setFilteredSubCategories([]);
          return;
        }
      }

      if (res && res.success) {
        const subcats = res.subCategories || res.subcategories || res.data || [];
        setSubCategories(subcats);
        setFilteredSubCategories(subcats);
      } else {
        context?.openAlertBox?.({ type: 'error', msg: res?.message || 'Failed to fetch subcategories' });
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      context?.openAlertBox?.({ type: 'error', msg: 'Error fetching subcategories' });
      setSubCategories([]);
      setFilteredSubCategories([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setFormFields(prev => ({
      ...prev,
      categoryId: categoryId,
      subCategoryId: '',
    }));

    if (categoryId && subCategories.length > 0) {
      const filtered = subCategories.filter(sub => {
        const parentId = sub.parentId?._id || sub.parentId;
        return parentId === categoryId;
      });
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories(subCategories);
    }
  };

  const handleSubCategoryChange = (event) => {
    const value = event.target.value;
    setFormFields(prev => ({
      ...prev,
      subCategoryId: value,
    }));
  };

  const handleFeaturedChange = (event) => {
    const value = event.target.value === 'true';
    setFormFields(prev => ({
      ...prev,
      isFeatured: value,
    }));
  };

  const handleRamChange = (event) => {
    setFormFields(prev => ({
      ...prev,
      productRam: event.target.value,
    }));
  };

  const handleWeightChange = (event) => {
    setFormFields(prev => ({
      ...prev,
      productWeight: event.target.value,
    }));
  };

  const handleSizeChange = (event) => {
    setFormFields(prev => ({
      ...prev,
      size: event.target.value,
    }));
  };

  const toggleAddMode = (type) => {
    setAddMode(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
    setNewOption(prev => ({
      ...prev,
      [type]: '',
    }));
  };

  const handleNewOptionChange = (type, value) => {
    setNewOption(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddOption = (type) => {
    const value = (newOption[type] || '').trim();
    if (!value) return;

    const formatValue = type === 'size' ? value.toUpperCase() : value;

    const updaterMap = {
      ram: setRamOptions,
      size: setSizeOptions,
      weight: setWeightOptions,
    };

    updaterMap[type](prev => (prev.includes(formatValue) ? prev : [...prev, formatValue]));

    setFormFields(prev => ({
      ...prev,
      ...(type === 'ram' && { productRam: formatValue }),
      ...(type === 'size' && { size: formatValue }),
      ...(type === 'weight' && { productWeight: formatValue }),
    }));

    setNewOption(prev => ({
      ...prev,
      [type]: '',
    }));
    setAddMode(prev => ({
      ...prev,
      [type]: false,
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFormFields(prev => ({
      ...prev,
      rating: newValue || 0,
    }));
  };

  const handleRemoveImageLocal = (index) => {
    setFormFields(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.name.trim() || !formFields.categoryId || !formFields.price) {
      context?.openAlertBox?.({ 
        type: 'error', 
        msg: 'Please fill in all required fields: Name, Category, and Price' 
      });
      return;
    }

    if (formFields.images.length === 0) {
      context?.openAlertBox?.({ 
        type: 'error', 
        msg: 'Please upload at least one product image' 
      });
      return;
    }

    try {
      setSubmitting(true);

      const selectedCategory = categories.find(cat => cat._id === formFields.categoryId);
      const selectedSubCat = filteredSubCategories.find(sub => sub._id === formFields.subCategoryId);

      const payload = {
        name: formFields.name.trim(),
        description: formFields.description.trim(),
        brand: formFields.brand.trim(),
        price: Number(formFields.price) || 0,
        oldePrice: Number(formFields.oldPrice) || 0,
        catName: selectedCategory?.name || '',
        catId: formFields.categoryId,
        subCatId: formFields.subCategoryId || '',
        subCat: selectedSubCat?.name || '',
        category: formFields.categoryId,
        countInStock: Number(formFields.stock) || 0,
        rating: formFields.rating || 0,
        isFeatured: formFields.isFeatured,
        discount: Number(formFields.discount) || 0,
        productRam: formFields.productRam,
        size: formFields.size,
        productWeight: formFields.productWeight ? [formFields.productWeight] : [],
        dateCreated: new Date(),
        images: formFields.images,
      };

      const res = await postData('/api/product/create-product', payload);

      if (res && res.success) {
        context?.openAlertBox?.({ type: 'success', msg: 'Product created successfully!' });
        context?.setIsOpenFullScreenPanel?.({ open: false });
        
        setFormFields({
          name: '',
          description: '',
          categoryId: '',
          subCategoryId: '',
          price: '',
          oldPrice: '',
          isFeatured: false,
          stock: '',
          brand: '',
          discount: '',
          productRam: '',
          productWeight: '',
          size: '',
          rating: 0,
          images: [],
        });
        
      } else {
        context?.openAlertBox?.({ type: 'error', msg: res?.message || 'Failed to create product' });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      context?.openAlertBox?.({ type: 'error', msg: 'Error creating product: ' + error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className='p-5 bg-gray-50'>
      <form className='form py-3 px-8' onSubmit={handleSubmit}>
        <div className='scroll max-h-[75vh] overflow-y-scroll pr-4'>
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Name *</h3>
              <input
                type='text'
                name='name'
                value={formFields.name}
                onChange={handleInputChange}
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Description</h3>
              <textarea
                name='description'
                value={formFields.description}
                onChange={handleInputChange}
                className='w-full h-[140px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
              />
            </div>
          </div>

          <div className="grid grid-cols-4 mb-3 gap-5 text-black">
            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1'>Product Category *</h3>
              <Select
                labelId="product-category-label"
                id="productCatDrop"
                className='w-full'
                size='small'
                value={formFields.categoryId}
                onChange={handleCategoryChange}
                required
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </div>

            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Sub Category</h3>
              <Select
                labelId="product-subcategory-label"
                id="productSubCatDrop"
                className='w-full'
                size='small'
                value={formFields.subCategoryId}
                onChange={handleSubCategoryChange}
                disabled={!formFields.categoryId || filteredSubCategories.length === 0}
              >
                <MenuItem value="">
                  {formFields.categoryId && filteredSubCategories.length === 0 
                    ? 'No subcategories available' 
                    : 'Select Sub Category'
                  }
                </MenuItem>
                {filteredSubCategories.map(sub => (
                  <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                ))}
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {filteredSubCategories.length} subcategories available
                {formFields.categoryId && ` for ${categories.find(cat => cat._id === formFields.categoryId)?.name}`}
              </p>
            </div>

            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Price *</h3>
              <input
                type='number'
                name='price'
                value={formFields.price}
                onChange={handleInputChange}
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Product's Old Price</h3>
              <input
                type='number'
                name='oldPrice'
                value={formFields.oldPrice}
                onChange={handleInputChange}
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* ADD THIS SECTION - Brand and Stock Fields */}
          <div className="grid grid-cols-4 mb-3 gap-5 text-black">
            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1'>Is Featured</h3>
              <Select
                labelId="product-featured-label"
                id="productFeatured"
                className='w-full'
                size='small'
                value={String(formFields.isFeatured)}
                onChange={handleFeaturedChange}
              >
                <MenuItem value={'true'}>True</MenuItem>
                <MenuItem value={'false'}>False</MenuItem>
              </Select>
            </div>

            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Stocks</h3>
              <input
                type='number'
                name='stock'
                value={formFields.stock}
                onChange={handleInputChange}
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                min="0"
              />
            </div>

            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Brand</h3>
              <input
                type='text'
                name='brand'
                value={formFields.brand}
                onChange={handleInputChange}
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
              />
            </div>

            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Discount</h3>
              <input
                type='number'
                name='discount'
                value={formFields.discount}
                onChange={handleInputChange}
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 mb-3 gap-5 text-black">
            <div className="col">
              <div className='flex items-center justify-between'>
                <h3 className='text-[14px] font-[500] mb-1'>Product RAM</h3>
                <Button size='small' variant='text' onClick={() => toggleAddMode('ram')}>
                  {addMode.ram ? 'Cancel' : 'Enable Add'}
                </Button>
              </div>
              <Select
                labelId="product-ram-label"
                id="productRam"
                className='w-full'
                size='small'
                value={formFields.productRam}
                onChange={handleRamChange}
              >
                <MenuItem value="">Select RAM</MenuItem>
                {ramOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
              {addMode.ram && (
                <Stack direction="row" spacing={1} className='mt-2'>
                  <TextField
                    size='small'
                    label='Add RAM'
                    value={newOption.ram}
                    onChange={(e) => handleNewOptionChange('ram', e.target.value)}
                  />
                  <Button variant='contained' size='small' onClick={() => handleAddOption('ram')}>
                    Add
                  </Button>
                </Stack>
              )}
            </div>

            <div className="col">
              <div className='flex items-center justify-between'>
                <h3 className='text-[14px] font-[500] mb-1'>Product Weight</h3>
                <Button size='small' variant='text' onClick={() => toggleAddMode('weight')}>
                  {addMode.weight ? 'Cancel' : 'Enable Add'}
                </Button>
              </div>
              <Select
                labelId="product-weight-label"
                id="productWeight"
                className='w-full'
                size='small'
                value={formFields.productWeight}
                onChange={handleWeightChange}
              >
                <MenuItem value="">Select Weight</MenuItem>
                {weightOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
              {addMode.weight && (
                <Stack direction="row" spacing={1} className='mt-2'>
                  <TextField
                    size='small'
                    label='Add Weight'
                    value={newOption.weight}
                    onChange={(e) => handleNewOptionChange('weight', e.target.value)}
                  />
                  <Button variant='contained' size='small' onClick={() => handleAddOption('weight')}>
                    Add
                  </Button>
                </Stack>
              )}
            </div>

            <div className="col">
              <div className='flex items-center justify-between'>
                <h3 className='text-[14px] font-[500] mb-1'>Product Size</h3>
                <Button size='small' variant='text' onClick={() => toggleAddMode('size')}>
                  {addMode.size ? 'Cancel' : 'Enable Add'}
                </Button>
              </div>
              <Select
                labelId="product-size-label"
                id="productSize"
                className='w-full'
                size='small'
                value={formFields.size}
                onChange={handleSizeChange}
              >
                <MenuItem value="">Select Size</MenuItem>
                {sizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
              {addMode.size && (
                <Stack direction="row" spacing={1} className='mt-2'>
                  <TextField
                    size='small'
                    label='Add Size'
                    value={newOption.size}
                    onChange={(e) => handleNewOptionChange('size', e.target.value)}
                  />
                  <Button variant='contained' size='small' onClick={() => handleAddOption('size')}>
                    Add
                  </Button>
                </Stack>
              )}
            </div>

            <div className="col">
              <h3 className='text-[14px] font-[500] mb-1 text-black'>Rating</h3>
              <Rating
                name="half-rating"
                value={formFields.rating}
                precision={0.5}
                onChange={handleRatingChange}
              />
            </div>
          </div>

          <div className='col w-full p-5 px-0'>
            <h3 className='text-[18px] font-[700] mb-3 text-black'>Media & Image *</h3>
            
            <div className="mb-3 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                Uploaded Images: <strong>{formFields.images.length}</strong>
                {formFields.images.length === 0 && ' - Please upload at least one image'}
              </p>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {formFields.images.map((img, index) => (
                <div key={index} className='uploadboxWrapper relative'>
                  <span
                    className='absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[10px] -right-[10px] flex items-center justify-center z-50 cursor-pointer'
                    onClick={() => handleRemoveImageLocal(index)}
                  >
                    <IoMdClose className='text-white text-[17px]'/>
                  </span>

                  <div className='uploadbox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
                    <LazyLoadImage
                      className='w-full h-full object-cover'
                      alt={'product-image'}
                      effect='blur'
                      wrapperProps={{
                        style: {transitionDelay: "0.5s"},
                      }}
                      src={img}
                    />
                  </div>
                </div>
              ))}

              <UploadBox
                multiple={true}
                url='/api/product/uploadImages'
                onChange={(images) => {
                  setFormFields(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...(images || []).flat()],
                  }));
                }}
              />
            </div>
          </div>

        </div>
        <hr/>
        <br/>

        <Button
          type='submit'
          disabled={submitting || !formFields.name.trim() || !formFields.categoryId || !formFields.price || formFields.images.length === 0}
          className='btn-blue btn-lg w-full gap-2'
        >
          {submitting ? 'Publishing...' : 'Publish and View'} <MdCloudUpload className='text-[18px]' />
        </Button>
      </form>
    </section>
  );
};

export default AddProduct;