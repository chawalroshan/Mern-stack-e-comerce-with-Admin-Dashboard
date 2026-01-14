import { Button } from '@mui/material'
import { RiMenu2Line } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';
import { GoRocket } from "react-icons/go";
import CategoryPanel from './Categorypanel';
import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(MyContext);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(true);
  }

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Fetch main categories
        const categoriesRes = await fetchDataFromApi('/api/category');
        if (categoriesRes.success) {
          const mainCategories = categoriesRes.categories?.filter(cat => !cat.parentId) || [];
          setCategories(mainCategories);
        }

        // Fetch all subcategories
        const subCategoriesRes = await fetchDataFromApi('/api/category/subcategories');
        if (subCategoriesRes.success) {
          const allSubCats = subCategoriesRes.subCategories || subCategoriesRes.subcategories || subCategoriesRes.data || [];
          setSubCategories(allSubCats);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  // Format category name for URL
  const formatCategoryUrl = (name) => {
    return `/products?category=${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`;
  };

  if (loading) {
    return (
      <nav className='nav'>
        <div className='container flex items-center justify-center py-4'>
          <p>Loading categories...</p>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className='nav'>
        <div className='container flex items-center'>
          <div className='col_1 w-[20%]'>
            <Button className='!text-black gap-2 w-full' onClick={openCategoryPanel}>
              <RiMenu2Line className='text-[18px]' />
              Shop By Categories 
              <LiaAngleDownSolid className='text-[14px]' />
            </Button>
          </div>
          
          <div className="col_2 w-[60%]">
            <ul className='flex items-center gap-4'>
              <li className='list-none'>
                <Link to='/' className='link transition text-[14px] font-[500]'>
                  <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                    Home
                  </Button>
                </Link>
              </li>
              
              {/* Categories from database */}
              {categories.slice(0, 8).map((category) => {
                const categorySubs = getSubCategories(category._id);
                
                return (
                  <li key={category._id} className='list-none relative group'>
                    <Link 
                      to={formatCategoryUrl(category.name)} 
                      className='link transition text-[14px] font-[500]'
                    >
                      <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                        {category.name}
                      </Button>
                    </Link>
                    
                    {/* Submenu if category has subcategories */}
                    {categorySubs.length > 0 && (
                      <div className="submenu absolute top-full left-0 min-w-[200px] !bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <ul className='py-2'>
                          {categorySubs.map((subCategory) => {
                            const thirdLevelCategories = getThirdLevelCategories(subCategory._id);
                            
                            return (
                              <li key={subCategory._id} className='list-none w-full relative group/men'>
                                <Link 
                                  to={`/products?subcategory=${encodeURIComponent(subCategory.name.toLowerCase().replace(/\s+/g, '-'))}`} 
                                  className='w-full block'
                                >
                                  <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-3 !px-4 hover:!bg-gray-100 !normal-case'>
                                    {subCategory.name}
                                  </Button>
                                </Link>
                                
                                {/* Third level submenu */}
                                {thirdLevelCategories.length > 0 && (
                                  <div className="absolute left-full top-0 min-w-[150px] !bg-white shadow-lg opacity-0 invisible group-hover/men:opacity-100 group-hover/men:visible transition-all duration-300 z-50">
                                    <ul className='py-2'>
                                      {thirdLevelCategories.map((thirdCategory) => (
                                        <li key={thirdCategory._id} className='list-none w-full'>
                                          <Link 
                                            to={`/products?thirdcategory=${encodeURIComponent(thirdCategory.name.toLowerCase().replace(/\s+/g, '-'))}`} 
                                            className='w-full block'
                                          >
                                            <Button className='!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none !py-2 !px-4 hover:!bg-gray-100 !normal-case'>
                                              {thirdCategory.name}
                                            </Button>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
              
              {/* View All Categories link */}
              {categories.length > 8 && (
                <li className='list-none'>
                  <Link to='/categories' className='link transition text-[14px] font-[500]'>
                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-4'>
                      More Categories
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="col_3 w-[20%] flex justify-end">
            <p className='text-[14px] font-[500] flex items-center gap-3 mb-0 mt-0'>
              <GoRocket className='text-[18px]' />
              Free International Delivery
            </p>
          </div>
        </div>
      </nav>

      <CategoryPanel 
        openCategoryPanel={openCategoryPanel} 
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel} 
        categories={categories}
        subCategories={subCategories}
      />
    </>
  )
}

export default Navigation