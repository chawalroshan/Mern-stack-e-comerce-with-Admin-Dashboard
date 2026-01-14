import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { IoMdClose } from "react-icons/io";
import { fetchDataFromApi } from '../../utils/api';
import CategoryCollapse from '../CategoryCollapse/CategoryCollapse';

const CategoryPanel = (props) => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const toggleDrawer = (newOpen) => () => {
        props.setIsOpenCatPanel(newOpen);
    };

    // Fetch categories when panel opens
    useEffect(() => {
        const fetchCategories = async () => {
            if (props.isOpenCatPanel) {
                try {
                    setLoading(true);
                    setError(null);
                    
                    // Fetch main categories (only top-level categories with no parent)
                    const categoriesRes = await fetchDataFromApi('/api/category');
                    if (categoriesRes.success && categoriesRes.categories) {
                        // Filter to get only top-level categories
                        const mainCategories = categoriesRes.categories.filter(cat => !cat.parentId);
                        setCategories(mainCategories);
                        
                        // Fetch all subcategories
                        try {
                            const subCategoriesRes = await fetchDataFromApi('/api/category/subcategories');
                            if (subCategoriesRes.success) {
                                const allSubCats = subCategoriesRes.subCategories || 
                                                  subCategoriesRes.subcategories || 
                                                  subCategoriesRes.data || [];
                                setSubCategories(allSubCats);
                            }
                        } catch (subError) {
                            console.error('Error fetching subcategories:', subError);
                            // Continue even if subcategories fail
                        }
                    } else {
                        setError('Failed to load categories');
                    }
                } catch (error) {
                    console.error('Error fetching categories:', error);
                    setError('Error loading categories. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        };

        if (props.isOpenCatPanel) {
            fetchCategories();
        } else {
            // Reset states when panel closes
            setCategories([]);
            setSubCategories([]);
            setLoading(true);
            setError(null);
        }
    }, [props.isOpenCatPanel]);

    const DrawerList = (
        <Box sx={{ width: 300 }} role="presentation" className='catagoryPanel'>
            <div className='p-4 border-b flex items-center justify-between bg-gray-50'>
                <h3 className='text-[16px] font-[600] mb-0'>Shop By Categories</h3>
                <IoMdClose 
                    onClick={toggleDrawer(false)} 
                    className='cursor-pointer text-[20px] text-gray-600 hover:text-red-500 transition-colors'
                />
            </div>

            {loading ? (
                <div className="p-4">
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading categories...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="p-4 text-center">
                    <p className="text-red-600 mb-3">{error}</p>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </div>
            ) : (
                <CategoryCollapse 
                    categories={categories}
                    subCategories={subCategories}
                    level={0}
                />
            )}
        </Box>
    );

    return (
        <div>
            <Drawer 
                open={props.isOpenCatPanel} 
                onClose={toggleDrawer(false)}
                anchor="left"
            >
                {DrawerList}
            </Drawer>
        </div>
    );
};

export default CategoryPanel;