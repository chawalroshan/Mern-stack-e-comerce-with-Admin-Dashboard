import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import ProductItem from '../../components/ProductItem/ProductItem';
import ProductItemListView from '../../components/ProductItemListView/ProductItemListView';
import { Button } from '@mui/material';
import { IoGridSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';

const ProductListing = () => {
  const [itemView, setItemView] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    search: ''
  });
  const [categories, setCategories] = useState([]);

  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const openSort = Boolean(sortAnchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const productsPerPage = 12;

  // Get URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';
    const categoryQuery = searchParams.get('category') || '';
    const minPriceQuery = searchParams.get('minPrice') || '';
    const maxPriceQuery = searchParams.get('maxPrice') || '';
    const ratingQuery = searchParams.get('rating') || '';
    const pageQuery = parseInt(searchParams.get('page')) || 1;
    
    setFilters(prev => ({
      ...prev,
      search: searchQuery,
      category: categoryQuery,
      minPrice: minPriceQuery,
      maxPrice: maxPriceQuery,
      rating: ratingQuery
    }));
    
    setCurrentPage(pageQuery);
  }, [location.search]);

  // Load categories for breadcrumb
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchDataFromApi('/api/category');
        if (response.success && response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Fetch products based on filters and sorting
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters - only include non-empty filters
      const params = {
        page: currentPage,
        limit: productsPerPage,
      };

      // Add search filter if exists
      if (filters.search) {
        params.search = filters.search;
      }

      // Add category filter if exists
      if (filters.category) {
        params.catId = filters.category; // Use catId for category filtering
      }

      // Add price filters if exist
      if (filters.minPrice) {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice) {
        params.maxPrice = filters.maxPrice;
      }

      // Add rating filter if exists
      if (filters.rating) {
        params.rating = filters.rating;
      }

      // Apply sorting
      if (sortBy === 'price-low-high') {
        params.sort = 'price';
        params.order = 'asc';
      } else if (sortBy === 'price-high-low') {
        params.sort = 'price';
        params.order = 'desc';
      } else if (sortBy === 'name-a-z') {
        params.sort = 'name';
        params.order = 'asc';
      } else if (sortBy === 'name-z-a') {
        params.sort = 'name';
        params.order = 'desc';
      } else if (sortBy === 'rating-high-low') {
        params.sort = 'rating';
        params.order = 'desc';
      } else if (sortBy === 'newest') {
        params.sort = 'createdAt';
        params.order = 'desc';
      }

      console.log('Fetching products with params:', params);
      
      // Call the correct API endpoint with proper parameters
      let response;
      if (filters.category) {
        // If category filter is applied, use category-specific endpoint
        response = await fetchDataFromApi(`/api/product/getAllProductsByCatId/${filters.category}`, params);
      } else if (filters.search) {
        // If search filter is applied
        response = await fetchDataFromApi('/api/product/getAllProducts', params);
      } else {
        // Default: get all products
        response = await fetchDataFromApi('/api/product/getAllProducts', params);
      }
      
      console.log('Products API response:', response);
      
      if (response.success) {
        // Handle different response structures
        let productsData = [];
        let totalCount = 0;
        
        if (response.products) {
          productsData = response.products;
          totalCount = response.total || response.products.length || 0;
        } else if (response.data) {
          productsData = response.data.products || response.data;
          totalCount = response.data.total || response.data.count || productsData.length;
        }
        
        setProducts(productsData);
        setTotalProducts(totalCount);
        
        // Calculate total pages
        const calculatedPages = Math.ceil(totalCount / productsPerPage);
        setTotalPages(calculatedPages > 0 ? calculatedPages : 1);
        
        console.log(`Loaded ${productsData.length} products, total: ${totalCount}, pages: ${calculatedPages}`);
      } else {
        console.error('Failed to load products:', response.message);
        context.openAlertBox({ 
          type: 'error', 
          msg: response.message || 'Failed to load products' 
        });
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      context.openAlertBox({ 
        type: 'error', 
        msg: 'Error loading products. Please try again.' 
      });
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (value) => {
    setSortAnchorEl(null);
    if (value) {
      setSortBy(value);
      setCurrentPage(1); // Reset to first page when sorting changes
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    
    // Update URL with page parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', value);
    navigate({ search: searchParams.toString() });
  };

  const handleFilterChange = (newFilters) => {
    console.log('Filter change:', newFilters);
    
    // Merge new filters with existing ones
    const updatedFilters = { ...filters, ...newFilters };
    
    // Remove any empty filter values
    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] === '' || updatedFilters[key] === null || updatedFilters[key] === undefined) {
        delete updatedFilters[key];
      }
    });
    
    setFilters(updatedFilters);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Update URL with filter parameters
    const searchParams = new URLSearchParams();
    
    if (updatedFilters.search) searchParams.set('search', updatedFilters.search);
    if (updatedFilters.category) searchParams.set('category', updatedFilters.category);
    if (updatedFilters.minPrice) searchParams.set('minPrice', updatedFilters.minPrice);
    if (updatedFilters.maxPrice) searchParams.set('maxPrice', updatedFilters.maxPrice);
    if (updatedFilters.rating) searchParams.set('rating', updatedFilters.rating);
    
    // Only navigate if there are params, otherwise go to base URL
    const queryString = searchParams.toString();
    if (queryString) {
      navigate(`/productListing?${queryString}&page=1`);
    } else {
      navigate('/productListing');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: filters.search, // Keep search term if it came from header search
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: ''
    });
    setCurrentPage(1);
    setSortBy('relevance');
    navigate('/productListing');
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'relevance': return 'Relevance';
      case 'price-low-high': return 'Price, Low to High';
      case 'price-high-low': return 'Price, High to Low';
      case 'name-a-z': return 'Name, A to Z';
      case 'name-z-a': return 'Name, Z to A';
      case 'rating-high-low': return 'Rating, High to Low';
      case 'newest': return 'Newest First';
      default: return 'Sort By';
    }
  };

  const getCategoryName = () => {
    if (filters.category) {
      const category = categories.find(cat => cat._id === filters.category);
      return category ? category.name : 'Category';
    }
    if (filters.search) {
      return `Search: "${filters.search}"`;
    }
    return 'All Products';
  };

  return (
    <section className='py-5 bg-gray-50 min-h-screen'>
      <div className="container">
        <Breadcrumbs aria-label="breadcrumb" className="mb-3">
          <Link to="/" className='text-gray-600 hover:text-primary transition-colors'>
            Home
          </Link>
          <Link 
            to="/productListing" 
            className='text-gray-600 hover:text-primary transition-colors'
          >
            Products
          </Link>
          {(filters.category || filters.search) && (
            <span className="text-gray-800 font-medium capitalize">
              {getCategoryName()}
            </span>
          )}
        </Breadcrumbs>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {filters.search ? `Search Results for "${filters.search}"` : 
             filters.category ? getCategoryName() : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {filters.search ? `Found ${totalProducts} products matching your search` :
             `Browse our collection of ${totalProducts} products`}
          </p>
        </div>

        <div className='bg-white py-4 rounded-lg shadow-sm'>
          <div className='container'>
            <div className='flex flex-col lg:flex-row gap-6'>
              {/* Sidebar */}
              <div className='sidebarWrapper lg:w-[220px] bg-white p-4 rounded-lg border border-gray-200'>
                <Sidebar 
                  onFilterChange={handleFilterChange}
                  currentFilters={filters}
                  onClearFilters={clearFilters}
                />
              </div>

              {/* Main Content */}
              <div className='rightContent flex-1 py-3'>
                {/* Toolbar */}
                <div className='bg-gray-50 p-3 w-full mb-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4'>
                  <div className='col1 flex items-center itemViewActions gap-2'>
                    <Button 
                      className={`!w-10 !h-10 !min-w-10 !rounded-full ${itemView === 'list' ? '!bg-primary !text-white' : '!bg-white !text-gray-700'}`}
                      onClick={() => setItemView('list')}
                      title="List View"
                    >
                      <LuMenu className="text-lg" />
                    </Button>
                    <Button 
                      className={`!w-10 !h-10 !min-w-10 !rounded-full ${itemView === 'grid' ? '!bg-primary !text-white' : '!bg-white !text-gray-700'}`}
                      onClick={() => setItemView('grid')}
                      title="Grid View"
                    >
                      <IoGridSharp className="text-lg" />
                    </Button>

                    <span className='text-gray-700 text-sm font-medium pl-3'>
                      {loading ? 'Loading...' : `Showing ${products.length} of ${totalProducts} products`}
                    </span>

                    {/* Active Filters Display */}
                    {(filters.category || filters.minPrice || filters.maxPrice || filters.rating) && (
                      <div className="flex items-center gap-2 ml-3 flex-wrap">
                        <span className="text-xs text-gray-500">Filters:</span>
                        
                        {filters.category && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Category: {getCategoryName()}
                          </span>
                        )}
                        
                        {(filters.minPrice || filters.maxPrice) && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Price: Rs.{filters.minPrice || 0} - Rs.{filters.maxPrice || '∞'}
                          </span>
                        )}
                        
                        {filters.rating && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Rating: {filters.rating}+ stars
                          </span>
                        )}
                        
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={clearFilters}
                          className="!text-xs !py-1 !px-2 !border-red-200 !text-red-600 hover:!bg-red-50"
                        >
                          Clear All
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="col2 flex items-center justify-end gap-3">
                    <span className='text-gray-700 text-sm font-medium hidden sm:block'>
                      Sort By:
                    </span>
                    <Button
                      id="sort-button"
                      aria-controls={openSort ? 'sort-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openSort ? 'true' : undefined}
                      onClick={handleSortClick}
                      className='!bg-white !text-sm !text-gray-800 !capitalize !border !border-gray-300 hover:!border-primary hover:!bg-gray-50'
                      endIcon={<span className="ml-2">▼</span>}
                    >
                      {getSortLabel()}
                    </Button>

                    <Menu
                      id="sort-menu"
                      anchorEl={sortAnchorEl}
                      open={openSort}
                      onClose={() => handleSortClose(null)}
                      slotProps={{
                        paper: {
                          sx: {
                            width: 200,
                          },
                        },
                      }}
                    >
                      <MenuItem 
                        onClick={() => handleSortClose('relevance')}
                        selected={sortBy === 'relevance'}
                        className='!text-sm'
                      >
                        Relevance
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortClose('newest')}
                        selected={sortBy === 'newest'}
                        className='!text-sm'
                      >
                        Newest First
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortClose('price-low-high')}
                        selected={sortBy === 'price-low-high'}
                        className='!text-sm'
                      >
                        Price, Low to High
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortClose('price-high-low')}
                        selected={sortBy === 'price-high-low'}
                        className='!text-sm'
                      >
                        Price, High to Low
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortClose('name-a-z')}
                        selected={sortBy === 'name-a-z'}
                        className='!text-sm'
                      >
                        Name, A to Z
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortClose('name-z-a')}
                        selected={sortBy === 'name-z-a'}
                        className='!text-sm'
                      >
                        Name, Z to A
                      </MenuItem>
                      <MenuItem 
                        onClick={() => handleSortClose('rating-high-low')}
                        selected={sortBy === 'rating-high-low'}
                        className='!text-sm'
                      >
                        Rating, High to Low
                      </MenuItem>
                    </Menu>
                  </div>
                </div>

                {/* Loading State */}
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg 
                        className="w-10 h-10 text-gray-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {filters.search 
                        ? `No products found for "${filters.search}". Try different keywords or browse categories.`
                        : 'No products available with current filters. Try clearing some filters.'
                      }
                    </p>
                    <Button 
                      variant="outlined" 
                      onClick={clearFilters}
                      className="!border-primary !text-primary hover:!bg-primary hover:!text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Products Grid/List */}
                    <div className={itemView === 'grid' 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" 
                      : "grid grid-cols-1 gap-4 md:gap-6"
                    }>
                      {products.map((product) => (
                        itemView === 'grid' ? (
                          <ProductItem key={product._id} product={product} />
                        ) : (
                          <ProductItemListView key={product._id} product={product} />
                        )
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className='flex items-center justify-center mt-8 pt-6 border-t border-gray-200'>
                        <Pagination 
                          count={totalPages} 
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          showFirstButton 
                          showLastButton
                          size="large"
                          siblingCount={1}
                          boundaryCount={1}
                        />
                      </div>
                    )}

                    {/* Results Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
                      <p>
                        Page {currentPage} of {totalPages} • 
                        Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductListing;