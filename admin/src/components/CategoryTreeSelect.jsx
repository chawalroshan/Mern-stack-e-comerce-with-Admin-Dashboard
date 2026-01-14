import React from 'react';
import { Select, MenuItem } from '@mui/material';

const CategoryTreeSelect = ({ categories, value, onChange, excludeId }) => {

  const renderCategories = (categoryList, depth = 0) => {
    return categoryList
      .map(category => {
        if (category._id === excludeId) {
          return null;
        }
        return (
          <MenuItem key={category._id} value={category._id} style={{ paddingLeft: `${depth * 20 + 10}px` }}>
            {category.name}
            {category.children && category.children.length > 0 && renderCategories(category.children, depth + 1)}
          </MenuItem>
        );
      })
      .filter(Boolean);
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      fullWidth
      size="small"
    >
      <MenuItem value="">Select a category</MenuItem>
      {renderCategories(categories)}
    </Select>
  );
};

export default CategoryTreeSelect;