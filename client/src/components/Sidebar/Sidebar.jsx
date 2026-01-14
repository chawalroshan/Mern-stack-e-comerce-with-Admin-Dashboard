import React, { useState, useEffect } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Collapse } from 'react-collapse';
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import './style.css';
import Button from '@mui/material/Button';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import { fetchDataFromApi } from '../../utils/api';

const Sidebar = ({ onFilterChange, currentFilters, onClearFilters }) => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenPriceFilter, setIsOpenPriceFilter] = useState(true);
  const [isOpenRatingFilter, setIsOpenRatingFilter] = useState(true);
  const [isOpenAvailabilityFilter, setIsOpenAvailabilityFilter] = useState(false);
  const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize price range from filters or default
  const [priceRange, setPriceRange] = useState([
    parseInt(currentFilters.minPrice) || 0,
    parseInt(currentFilters.maxPrice) || 1000000
  ]);

  // Initialize selected categories from filters
  const [selectedCategories, setSelectedCategories] = useState(
    currentFilters.category ? [currentFilters.category] : []
  );

  // Initialize selected availability
  const [selectedAvailability, setSelectedAvailability] = useState(
    currentFilters.availability ? [currentFilters.availability] : []
  );

  // Initialize selected sizes
  const [selectedSizes, setSelectedSizes] = useState(
    currentFilters.size ? [currentFilters.size] : []
  );

  // Initialize selected rating
  const [selectedRating, setSelectedRating] = useState(
    parseInt(currentFilters.rating) || 0
  );

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update local state when parent filters change
  useEffect(() => {
    if (currentFilters.minPrice || currentFilters.maxPrice) {
      setPriceRange([
        parseInt(currentFilters.minPrice) || 0,
        parseInt(currentFilters.maxPrice) || 1000000
      ]);
    }
    
    if (currentFilters.category) {
      setSelectedCategories([currentFilters.category]);
    } else {
      setSelectedCategories([]);
    }
    
    if (currentFilters.availability) {
      setSelectedAvailability([currentFilters.availability]);
    }
    
    if (currentFilters.size) {
      setSelectedSizes([currentFilters.size]);
    }
    
    if (currentFilters.rating) {
      setSelectedRating(parseInt(currentFilters.rating));
    }
  }, [currentFilters]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchDataFromApi('/api/category');
      
      if (response.success && response.categories) {
        // Filter to get only parent categories (no parentId)
        const parentCategories = response.categories.filter(
          cat => !cat.parentId || cat.parentId === ''
        );
        setCategories(parentCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    let newCategories;
    
    if (selectedCategories.includes(categoryId)) {
      // Remove category if already selected
      newCategories = selectedCategories.filter(id => id !== categoryId);
    } else {
      // Add category (single selection for now, can change to multi)
      newCategories = [categoryId];
    }
    
    setSelectedCategories(newCategories);
    
    if (newCategories.length > 0) {
      onFilterChange({ category: newCategories[0] });
    } else {
      // If no categories selected, remove category filter
      const { category, ...restFilters } = currentFilters;
      onFilterChange(restFilters);
    }
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handlePriceChangeCommitted = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    onFilterChange({ rating });
  };

  const handleAvailabilityChange = (availability) => {
    let newAvailability;
    
    if (selectedAvailability.includes(availability)) {
      newAvailability = selectedAvailability.filter(item => item !== availability);
    } else {
      newAvailability = [availability];
    }
    
    setSelectedAvailability(newAvailability);
    
    if (newAvailability.length > 0) {
      onFilterChange({ availability: newAvailability[0] });
    } else {
      const { availability, ...restFilters } = currentFilters;
      onFilterChange(restFilters);
    }
  };

  const handleSizeChange = (size) => {
    let newSizes;
    
    if (selectedSizes.includes(size)) {
      newSizes = selectedSizes.filter(item => item !== size);
    } else {
      newSizes = [size];
    }
    
    setSelectedSizes(newSizes);
    
    if (newSizes.length > 0) {
      onFilterChange({ size: newSizes[0] });
    } else {
      const { size, ...restFilters } = currentFilters;
      onFilterChange(restFilters);
    }
  };

  const handleClearAllFilters = () => {
    // Reset all local states
    setPriceRange([0, 1000000]);
    setSelectedCategories([]);
    setSelectedAvailability([]);
    setSelectedSizes([]);
    setSelectedRating(0);
    
    // Call parent's clear function
    onClearFilters();
  };

  const formatPrice = (price) => {
    return `Rs: ${price.toLocaleString()}`;
  };

  // Check if any filter is active
  const isAnyFilterActive = () => {
    return (
      priceRange[0] > 0 ||
      priceRange[1] < 1000000 ||
      selectedCategories.length > 0 ||
      selectedAvailability.length > 0 ||
      selectedSizes.length > 0 ||
      selectedRating > 0
    );
  };

  return (
    <aside className='sidebar py-5'>
      {/* Clear Filters Button */}
      {isAnyFilterActive() && (
        <div className="mb-4">
          <Button 
            onClick={handleClearAllFilters}
            className="btn-org !text-sm !w-full !py-2"
            size="small"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Category Filter */}
      <div className='box'>
        <h3 className='mb-3 text-[16px] font-[600] flex items-center pr-5'>
          Shop by category 
          <Button 
            className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black'
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
          >
            {isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenCategoryFilter} className='mb-3'>
          <div className='scroll px-4 relative -left-[13px]'>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <FormControlLabel
                  key={category._id}
                  control={
                    <Checkbox 
                      size="small"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                      color="primary"
                    />
                  }
                  label={
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category.productCount || 0}
                      </span>
                    </div>
                  }
                  className='w-full !m-0 !mb-1'
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No categories found</p>
            )}
          </div>
        </Collapse>
      </div>

      {/* Price Filter */}
      <div className="box mt-4">
        <h3 className="mb-3 text-[16px] font-[600] flex items-center pr-5">
          Filter By Price
          <Button 
            className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black'
            onClick={() => setIsOpenPriceFilter(!isOpenPriceFilter)}
          >
            {isOpenPriceFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        
        <Collapse isOpened={isOpenPriceFilter}>
          {/* RangeSlider with lower thumb hidden */}
          <RangeSlider
            id="range-slider"
            min={0}
            max={1000000}
            value={priceRange}
            onInput={handlePriceChange}
            onThumbDragEnd={handlePriceChangeCommitted}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
          />

          <div className="flex pt-2 pb-2 priceRange justify-between">
            <span className="text-[13px]">
              Range: <strong className="text-dark">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</strong>
            </span>
          </div>
        </Collapse>
      </div>

      {/* Rating Filter */}
      <div className="box mt-4">
        <h3 className="mb-3 text-[16px] font-[600] flex items-center pr-5">
          Filter By Rating
          <Button 
            className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black'
            onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)}
          >
            {isOpenRatingFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        
        <Collapse isOpened={isOpenRatingFilter}>
          <div className='space-y-2'>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div 
                key={rating}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                  selectedRating === rating ? 'bg-blue-50 border border-blue-200' : ''
                }`}
                onClick={() => handleRatingChange(rating)}
              >
                <Rating 
                  name={`rating-${rating}`} 
                  value={rating} 
                  size="small" 
                  readOnly 
                />
                <span className="text-sm text-gray-700 ml-2">
                  {rating === 5 ? '5 Stars' : `${rating} & up`}
                </span>
                {selectedRating === rating && (
                  <span className="ml-auto text-xs text-blue-600">✓</span>
                )}
              </div>
            ))}
          </div>
        </Collapse>
      </div>

      {/* Availability Filter */}
      <div className='box mt-3'>
        <h3 className='mb-3 text-[16px] font-[600] flex items-center pr-5'>
          Availability
          <Button 
            className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black'
            onClick={() => setIsOpenAvailabilityFilter(!isOpenAvailabilityFilter)}
          >
            {isOpenAvailabilityFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenAvailabilityFilter} className='mb-3'>
          <div className='scroll px-4 relative -left-[13px]'>
            <FormControlLabel 
              control={
                <Checkbox 
                  size="small"
                  checked={selectedAvailability.includes('in-stock')}
                  onChange={() => handleAvailabilityChange('in-stock')}
                />
              } 
              label="In Stock" 
              className='w-full !m-0 !mb-1'
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  size="small"
                  checked={selectedAvailability.includes('low-stock')}
                  onChange={() => handleAvailabilityChange('low-stock')}
                />
              } 
              label="Low Stock" 
              className='w-full !m-0 !mb-1'
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  size="small"
                  checked={selectedAvailability.includes('out-of-stock')}
                  onChange={() => handleAvailabilityChange('out-of-stock')}
                />
              } 
              label="Out of Stock" 
              className='w-full !m-0 !mb-1'
            />
          </div>
        </Collapse>
      </div>

      {/* Size Filter */}
      <div className='box mt-3'>
        <h3 className='mb-3 text-[16px] font-[600] flex items-center pr-5'>
          Size
          <Button 
            className='!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black'
            onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}
          >
            {isOpenSizeFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenSizeFilter} className='mb-3'>
          <div className='scroll px-4 relative -left-[13px]'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <FormControlLabel
                key={size}
                control={
                  <Checkbox 
                    size="small"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                }
                label={size}
                className='w-full !m-0 !mb-1'
              />
            ))}
          </div>
        </Collapse>
      </div>
    </aside>
  )
}

export default Sidebar