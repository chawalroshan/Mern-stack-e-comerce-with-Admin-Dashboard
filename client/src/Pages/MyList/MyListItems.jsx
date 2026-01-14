import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { IoCloseSharp } from "react-icons/io5";
import { Button } from '@mui/material';
import { MyContext } from '../../App';

const MyListItems = ({ item, onRemove }) => {
  const { addToCart } = useContext(MyContext);
  
  if (!item) return null;
  
  // Handle different data structures
  let product, productId, productName, productImages, productRating, productPrice, oldPrice, discount, brand;
  
  if (typeof item.productId === 'object' && item.productId !== null) {
    // Case 1: productId is a populated object from backend
    product = item.productId;
    productId = product._id;
    productName = product.name;
    productImages = product.images || [];
    productRating = product.rating || 0;
    productPrice = product.price || 0;
    oldPrice = product.oldePrice || 0;
    discount = product.discount || 0;
    brand = product.brand || '';
  } else if (typeof item.productId === 'string') {
    // Case 2: productId is just an ID string
    productId = item.productId;
    product = { _id: productId }; // Create minimal product object
    productName = item.productTitle || 'Product';
    productImages = item.images || [];
    productRating = item.rating || 0;
    productPrice = item.price || 0;
    oldPrice = item.oldPrice || 0;
    discount = item.discount || 0;
    brand = item.brand || '';
  } else {
    // Case 3: Item is a product object itself (guest scenario)
    product = item;
    productId = item._id;
    productName = item.name || item.productTitle || 'Product';
    productImages = item.images || [];
    productRating = item.rating || 0;
    productPrice = item.price || 0;
    oldPrice = item.oldePrice || item.oldPrice || 0;
    discount = item.discount || 0;
    brand = item.brand || '';
  }
  
  // Ensure we have a valid productId
  if (!productId) {
    console.error('No product ID found for item:', item);
    return null;
  }
  
  const imageUrl = productImages.length > 0 ? productImages[0] : 'https://via.placeholder.com/150';

  const handleAddToCart = () => {
    // Create a proper product object for addToCart
    const cartProduct = {
      _id: productId,
      name: productName,
      price: productPrice,
      images: productImages,
      brand: brand,
      rating: productRating,
      oldePrice: oldPrice,
      discount: discount,
      countInStock: 10 // Default value for wishlist items
    };
    addToCart(cartProduct, 1);
  };

  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]">
      <div className="img w-[15%] rounded-md overflow-hidden">
        <Link to={`/product/${productId}`} className='group'>
          <img
            src={imageUrl}
            className='w-full group-hover:scale-105 transition-all'
            alt={productName}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
        </Link>
      </div>

      <div className="info w-[85%] relative">
        <IoCloseSharp 
          className='cursor-pointer absolute top-0 right-0 text-[20px] link transition-all hover:text-red-500'
          onClick={onRemove}
        />

        {brand && (
          <span className='text-[13px] text-gray-500'>{brand}</span>
        )}
        <h3 className='text-[16px] font-medium'>
          <Link to={`/product/${productId}`} className='link hover:text-primary'>
            {productName}
          </Link>
        </h3>
        
        {productRating > 0 && (
          <Rating 
            name="size-small" 
            value={productRating} 
            precision={0.5} 
            size="small" 
            readOnly 
          />
        )}

        <div className='flex items-center gap-4 mt-2 mb-2'>
          <span className='Price !text-black font-[600] text-[14px]'>
            ${productPrice.toFixed(2)}
          </span>
          {oldPrice > 0 && oldPrice > productPrice && (
            <span className='oldPrice line-through text-gray-500 text-[14px] font-[500]'>
              ${oldPrice.toFixed(2)}
            </span>
          )}
          {discount > 0 && (
            <span className='Price !text-primary font-[600] text-[14px]'>
              {discount}% OFF
            </span>
          )}
        </div>

        <Button 
          className='btn-org btn-sm'
          onClick={handleAddToCart}
          variant="contained"
          size="small"
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default MyListItems;