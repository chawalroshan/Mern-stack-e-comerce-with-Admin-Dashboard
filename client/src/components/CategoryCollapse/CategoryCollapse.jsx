import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FiMinus } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";

const CategoryCollapse = ({ categories = [], subCategories = [], level = 0 }) => {
    // State for open submenus - will be dynamic based on categories
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [openInnerSubmenus, setOpenInnerSubmenus] = useState({});

    // Initialize open states when categories load
    useEffect(() => {
        if (categories.length > 0) {
            const initialOpenState = {};
            categories.forEach(cat => {
                initialOpenState[cat._id] = false;
            });
            setOpenSubmenus(initialOpenState);
        }
    }, [categories]);

    // Get subcategories for a specific category
    const getSubCategories = (categoryId) => {
        return subCategories.filter(sub => {
            const parentId = sub.parentId?._id || sub.parentId;
            return parentId === categoryId;
        });
    };

    // Get third-level subcategories for a subcategory
    const getThirdLevelCategories = (subCategoryId) => {
        return subCategories.filter(sub => {
            const parentId = sub.parentId?._id || sub.parentId;
            return parentId === subCategoryId;
        });
    };

    const toggleSubmenu = (categoryId) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const toggleInnerSubmenu = (subCategoryId) => {
        setOpenInnerSubmenus(prev => ({
            ...prev,
            [subCategoryId]: !prev[subCategoryId]
        }));
    };

    // Format URL for category
    const formatCategoryUrl = (categoryItem, type = 'category') => {
        const name = categoryItem.name || categoryItem;
        return `/products?${type}=${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`;
    };

    // Calculate padding based on level
    const getPadding = (currentLevel) => {
        return currentLevel * 20; // 20px per level
    };

    if (categories.length === 0) {
        return (
            <div className="scroll p-3">
                <p className="text-gray-500 text-center">No categories available</p>
            </div>
        );
    }

    // Function to render a category with its subcategories
    const renderCategory = (category, currentLevel = 0) => {
        const categorySubs = getSubCategories(category._id);
        const hasSubCategories = categorySubs.length > 0;
        const isOpen = openSubmenus[category._id] || false;
        const paddingLeft = getPadding(currentLevel);

        return (
            <li key={category._id} className='list-none flex items-center relative flex-col mb-1'>
                <div className='w-full flex items-center justify-between' style={{ paddingLeft: `${paddingLeft}px` }}>
                    <Link 
                        to={formatCategoryUrl(category, 'category')} 
                        className='flex-1'
                        onClick={(e) => {
                            if (hasSubCategories) {
                                e.preventDefault();
                                toggleSubmenu(category._id);
                            }
                        }}
                    >
                        <Button className='w-full text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)] !normal-case !text-sm'>
                            {category.name}
                            {hasSubCategories && (
                                <span className="text-xs text-gray-500 ml-2">
                                    ({categorySubs.length})
                                </span>
                            )}
                        </Button>
                    </Link>
                    
                    {hasSubCategories && (
                        isOpen 
                            ? <FiMinus 
                                className='cursor-pointer mr-3 text-gray-600 hover:text-red-500' 
                                onClick={() => toggleSubmenu(category._id)} 
                              />
                            : <FaRegSquarePlus 
                                className='cursor-pointer mr-3 text-gray-600 hover:text-blue-500' 
                                onClick={() => toggleSubmenu(category._id)} 
                              />
                    )}
                </div>

                {/* Render subcategories if open */}
                {hasSubCategories && isOpen && (
                    <ul className='submenu w-full'>
                        {categorySubs.map((subCategory) => {
                            const thirdLevelCats = getThirdLevelCategories(subCategory._id);
                            const hasThirdLevel = thirdLevelCats.length > 0;
                            const isInnerOpen = openInnerSubmenus[subCategory._id] || false;

                            return (
                                <li key={subCategory._id} className='list-none relative mt-1'>
                                    <div className='w-full flex items-center justify-between' style={{ paddingLeft: `${paddingLeft + 20}px` }}>
                                        <Link 
                                            to={formatCategoryUrl(subCategory, 'subcategory')} 
                                            className='flex-1'
                                            onClick={(e) => {
                                                if (hasThirdLevel) {
                                                    e.preventDefault();
                                                    toggleInnerSubmenu(subCategory._id);
                                                }
                                            }}
                                        >
                                            <Button className='w-full text-left !text-[13px] !justify-start !px-3 !text-[rgba(0,0,0,0.7)] !normal-case'>
                                                {subCategory.name}
                                                {hasThirdLevel && (
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({thirdLevelCats.length})
                                                    </span>
                                                )}
                                            </Button>
                                        </Link>
                                        
                                        {hasThirdLevel && (
                                            isInnerOpen 
                                                ? <FiMinus 
                                                    className='cursor-pointer mr-3 text-gray-500 hover:text-red-500 text-xs' 
                                                    onClick={() => toggleInnerSubmenu(subCategory._id)} 
                                                  />
                                                : <FaRegSquarePlus 
                                                    className='cursor-pointer mr-3 text-gray-500 hover:text-blue-500 text-xs' 
                                                    onClick={() => toggleInnerSubmenu(subCategory._id)} 
                                                  />
                                        )}
                                    </div>

                                    {/* Render third-level categories if open */}
                                    {hasThirdLevel && isInnerOpen && (
                                        <ul className='inner_submenu w-full'>
                                            {thirdLevelCats.map((thirdCategory) => (
                                                <li key={thirdCategory._id} className='list-none relative mb-1' style={{ paddingLeft: `${paddingLeft + 40}px` }}>
                                                    <Link 
                                                        to={formatCategoryUrl(thirdCategory, 'thirdcategory')} 
                                                        className='link w-full text-left !text-[12px] !justify-start !px-3 !text-[rgba(0,0,0,0.6)] block py-1 hover:text-blue-600'
                                                    >
                                                        {thirdCategory.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="scroll max-h-[calc(100vh-200px)] overflow-y-auto">
            <ul className='w-full'>
                {/* Render all main categories */}
                {categories.map(category => renderCategory(category, level))}
            </ul>
        </div>
    );
};

export default CategoryCollapse;