import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom'
import ProductZoom from '../../components/ProductZoom/ProductZoom';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import ProductDetailsComponent from '../../components/ProductDetails/ProductDetails';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';

const ProductDetails = () => {
  const { id } = useParams();
  const context = useContext(MyContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'John Doe',
      date: '2024-01-15',
      rating: 4,
      comment: 'Great product! Very satisfied with the quality.',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    },
    {
      id: 2,
      name: 'Jane Smith',
      date: '2024-01-10',
      rating: 5,
      comment: 'Excellent product, highly recommend!',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      date: '2024-01-05',
      rating: 3,
      comment: 'Good product but delivery was slow.',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Johnson&background=random'
    }
  ]);
  const [newReview, setNewReview] = useState({
    comment: '',
    rating: 0
  });

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      console.log('Fetching product details for ID:', id);
      
      const productData = await context.fetchProductById(id);
      console.log('Product data fetched:', productData);
      
      if (productData) {
        setProduct(productData);
        context.setSelectedProduct(productData);
      } else {
        console.error('No product data returned');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      context.openAlertBox({ type: 'error', msg: 'Failed to load product details' });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim() || newReview.rating === 0) {
      context.openAlertBox({ type: 'error', msg: 'Please provide both rating and comment' });
      return;
    }

    const review = {
      id: reviews.length + 1,
      name: context.userData?.name || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      rating: newReview.rating,
      comment: newReview.comment,
      avatar: context.userData?.avatar || `https://ui-avatars.com/api/?name=${context.userData?.name || 'User'}&background=random`
    };

    setReviews([review, ...reviews]);
    setNewReview({ comment: '', rating: 0 });
    context.openAlertBox({ type: 'success', msg: 'Review submitted successfully!' });
  };

  const getRelatedProducts = () => {
    if (!product || !context.products) return [];
    
    // Get products from same category
    const relatedProducts = context.products.filter(p => 
      p._id !== product._id && 
      (p.category?._id === product.category?._id || 
       p.catId === product.catId ||
       p.subCatId === product.subCatId)
    ).slice(0, 8);
    
    // If not enough category matches, get featured products
    if (relatedProducts.length < 4 && context.featuredProducts) {
      const featured = context.featuredProducts
        .filter(p => p._id !== product._id)
        .slice(0, 8 - relatedProducts.length);
      return [...relatedProducts, ...featured];
    }
    
    return relatedProducts;
  };

  if (loading) {
    return (
      <div className='py-5'>
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='py-5'>
        <div className="container">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="btn-org px-6 py-3">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts();

  return (
    <>
      <div className='py-5 bg-gray-50'>
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" className='text-gray-600 hover:text-primary transition-colors'>
              Home
            </Link>
            {product.category?.name && (
              <Link 
                to={`/category/${product.category._id}`}
                className='text-gray-600 hover:text-primary transition-colors'
              >
                {product.category.name}
              </Link>
            )}
            {product.subCat && (
              <Link 
                to={`/category/${product.catId}/${product.subCatId}`}
                className='text-gray-600 hover:text-primary transition-colors'
              >
                {product.subCat}
              </Link>
            )}
            <span className="text-gray-900 font-medium">
              {product.name}
            </span>
          </Breadcrumbs>
        </div>

        <section className='bg-white py-5 mt-4 rounded-lg shadow-sm'>
          <div className="container">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Product Images */}
              <div className="productZoomContainer w-full lg:w-[45%]">
                {product.images && product.images.length > 0 ? (
                  <ProductZoom product={product} />
                ) : (
                  <div className="bg-gray-100 rounded-lg h-[500px] flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="productContent w-full lg:w-[55%] lg:pr-10">
                <ProductDetailsComponent product={product} />
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className='flex items-center gap-8 mb-6'>
                <button 
                  className={`text-[16px] cursor-pointer font-medium ${activeTab === 0 ? 'text-primary border-b-2 border-primary pb-2' : 'text-gray-600 hover:text-primary'}`}
                  onClick={() => setActiveTab(0)}
                >
                  Description
                </button>
                <button 
                  className={`text-[16px] cursor-pointer font-medium ${activeTab === 1 ? 'text-primary border-b-2 border-primary pb-2' : 'text-gray-600 hover:text-primary'}`}
                  onClick={() => setActiveTab(1)}
                >
                  Product Details
                </button>
                <button 
                  className={`text-[16px] cursor-pointer font-medium ${activeTab === 2 ? 'text-primary border-b-2 border-primary pb-2' : 'text-gray-600 hover:text-primary'}`}
                  onClick={() => setActiveTab(2)}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              {/* Description Tab */}
              {activeTab === 0 && (
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Product Description</h4>
                  <div className="prose max-w-none text-gray-700">
                    {product.description ? (
                      <p className="mb-4">{product.description}</p>
                    ) : (
                      <p className="text-gray-500 italic">No description available for this product.</p>
                    )}
                    
                    <h5 className="font-semibold mt-6 mb-2 text-gray-800">Packaging & Delivery</h5>
                    <p className="mb-4">
                      We take great care in packaging your items to ensure they arrive in perfect condition. 
                      Standard delivery takes 3-5 business days, with express options available.
                    </p>
                    
                    <h5 className="font-semibold mt-6 mb-2 text-gray-800">Suggested Use</h5>
                    <p className="mb-4">
                      This product is designed for everyday use. Follow care instructions for best results.
                      {product.productWeight && product.productWeight.length > 0 && (
                        <span> Weight: {product.productWeight.join(', ')}</span>
                      )}
                      {product.size && (
                        <span> | Size: {product.size}</span>
                      )}
                      {product.productRam && (
                        <span> | RAM: {product.productRam}</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Product Details Tab */}
              {activeTab === 1 && (
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Product Specifications</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700 bg-white rounded-lg overflow-hidden">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                          <th scope="col" className="px-6 py-3">Specification</th>
                          <th scope="col" className="px-6 py-3">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Product Name</td>
                          <td className="px-6 py-4">{product.name}</td>
                        </tr>
                        {product.brand && (
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">Brand</td>
                            <td className="px-6 py-4">{product.brand}</td>
                          </tr>
                        )}
                        {product.category?.name && (
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">Category</td>
                            <td className="px-6 py-4">{product.category.name}</td>
                          </tr>
                        )}
                        {product.subCat && (
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">Sub Category</td>
                            <td className="px6 py-4">{product.subCat}</td>
                          </tr>
                        )}
                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Price</td>
                          <td className="px-6 py-4">
                            <span className="text-primary font-semibold">Rs.{product.price?.toFixed(2) || '0.00'}</span>
                            {product.oldePrice && product.oldePrice > product.price && (
                              <span className="ml-2 line-through text-gray-500">Rs.{product.oldePrice.toFixed(2)}</span>
                            )}
                          </td>
                        </tr>
                        <tr className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">Stock Status</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'} ({product.countInStock || 0})
                            </span>
                          </td>
                        </tr>
                        {product.size && (
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">Size</td>
                            <td className="px-6 py-4">{product.size}</td>
                          </tr>
                        )}
                        {product.productRam && (
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">RAM</td>
                            <td className="px-6 py-4">{product.productRam}</td>
                          </tr>
                        )}
                        {product.productWeight && product.productWeight.length > 0 && (
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">Weight</td>
                            <td className="px-6 py-4">{product.productWeight.join(', ')}</td>
                          </tr>
                        )}
                        {product.discount > 0 && (
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">Discount</td>
                            <td className="px-6 py-4 text-red-600 font-semibold">{product.discount}%</td>
                          </tr>
                        )}
                        {product.rating > 0 && (
                          <tr className="bg-white hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">Rating</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Rating value={product.rating} precision={0.5} readOnly size="small" />
                                <span className="text-gray-600">({product.rating})</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 2 && (
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">Customer Reviews ({reviews.length})</h4>
                  
                  <div className="space-y-6 mb-8">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                              <img 
                                src={review.avatar} 
                                alt={review.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-800">{review.name}</h5>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Rating value={review.rating} readOnly size="small" />
                            <span className="text-sm text-gray-600">{review.rating}.0</span>
                          </div>
                        </div>
                        <p className="mt-3 text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h5 className="text-lg font-semibold mb-4 text-gray-800">Add Your Review</h5>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Rating
                        </label>
                        <Rating
                          value={newReview.rating}
                          onChange={(event, newValue) => {
                            setNewReview({...newReview, rating: newValue});
                          }}
                          size="large"
                        />
                      </div>
                      <div>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Your Review"
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          variant="outlined"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          variant="contained"
                          className="btn-org"
                          disabled={!context.isLogin}
                        >
                          {context.isLogin ? 'Submit Review' : 'Login to Review'}
                        </Button>
                      </div>
                      {!context.isLogin && (
                        <p className="text-sm text-gray-600 mt-2">
                          Please <Link to="/login" className="text-primary hover:underline">login</Link> to submit a review.
                        </p>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className='text-2xl font-semibold mb-6 text-gray-800'>Related Products</h3>
                <ProductSlider 
                  products={relatedProducts}
                  items={4}
                  autoplay={false}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default ProductDetails;