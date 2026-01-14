import React, { createContext, useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Home from './Pages/Home/Home'
import ProductListing from './Pages/ProductListing/ProductListing'
import Footer from './components/Footer/Footer'
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import ProductDetails from './Pages/ProductDetails/ProductDetails'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import ProductZoom from './components/ProductZoom/ProductZoom'
import { IoClose } from "react-icons/io5"
import ProductDetailsComponent from './components/ProductDetails/ProductDetails'
import Cart from './Pages/Cart/Cart'
import Verify from './Pages/Verify/Verify'
import toast, { Toaster } from 'react-hot-toast';
import ForgetPassword from './Pages/ForgetPassword/Forgetpassword'
import Checkout from './Pages/Checkout/Checkout'
import MyAccount from './Pages/MyAccount/MyAccount'
import MyList from './Pages/MyList/MyList'
import Orders from './Pages/Orders/Orders'
import {
  fetchDataFromApi,
  postData,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  addToMyList as apiAddToMyList,
  removeFromMyList as apiRemoveFromMyList,
  getMyList as apiGetMyList
} from './utils/api'
import Address from './Pages/Address/Address'

const MyContext = createContext();

function App() {
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [maxWidth] = useState('lg');
  const [fullWidth] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  // New states for products and cart
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Wishlist states
  const [myList, setMyList] = useState([]);
  const [myListLoading, setMyListLoading] = useState(false);

  // Add localStorage key constants
  const WISHLIST_STORAGE_KEY = 'wishlist_data';
  const WISHLIST_LAST_SYNC_KEY = 'wishlist_last_sync';

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
    setSelectedProduct(null);
  };

  // Load products from backend
  useEffect(() => {
    console.log('App.js: Initial load');
    fetchAllProducts();
    fetchFeaturedProducts();
    loadInitialCart();
  }, []);

  // ================== WISHLIST FUNCTIONS ==================

  const loadMyList = async () => {
    if (!isLogin) {
      // For guest users, try to load from localStorage
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setMyList(parsedWishlist);
        } catch (error) {
          console.error('Error loading wishlist from storage:', error);
          setMyList([]);
        }
      } else {
        setMyList([]);
      }
      return;
    }
    
    try {
      setMyListLoading(true);
      console.log('Loading wishlist from backend...');
      const response = await apiGetMyList();
      
      if (response.success) {
        console.log('Wishlist loaded from backend:', response.data.length, 'items');
        const wishlistData = response.data || [];
        setMyList(wishlistData);
        
        // Save to localStorage for persistence
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistData));
        localStorage.setItem(WISHLIST_LAST_SYNC_KEY, Date.now().toString());
      } else {
        console.error('Failed to load wishlist:', response.message);
        // Fallback to localStorage if backend fails
        const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            setMyList(parsedWishlist);
          } catch (error) {
            console.error('Error loading wishlist from storage:', error);
            setMyList([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      // Fallback to localStorage on error
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setMyList(parsedWishlist);
        } catch (error) {
          console.error('Error loading wishlist from storage:', error);
          setMyList([]);
        }
      } else {
        setMyList([]);
      }
    } finally {
      setMyListLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInMyList = (productId) => {
    if (!productId) return false;
    
    return myList.some(item => {
      if (item.productId && typeof item.productId === 'object') {
        // Item has full product object
        return item.productId._id === productId;
      } else if (item.productId) {
        // Item has just productId string
        return item.productId === productId;
      }
      return false;
    });
  };

  // Add to wishlist function
  const addToMyList = async (product) => {
    if (!product || !product._id) {
      openAlertBox({ type: 'error', msg: 'Invalid product' });
      return;
    }
    
    console.log('Adding to wishlist:', product.name);
    
    // Check if already in wishlist
    const alreadyInWishlist = isInMyList(product._id);
    if (alreadyInWishlist) {
      openAlertBox({ type: 'info', msg: 'Item already in your wishlist' });
      return;
    }
    
    if (!isLogin) {
      // For guest users, save to localStorage
      const newItem = {
        _id: 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        productId: product,
        productTitle: product.name,
        images: product.images || [],
        rating: product.rating || 0,
        price: product.price || 0,
        oldPrice: product.oldePrice || 0,
        brand: product.brand || '',
        discount: product.discount || 0,
        userId: null,
        isGuest: true
      };
      
      // Add to local state
      const updatedWishlist = [...myList, newItem];
      setMyList(updatedWishlist);
      
      // Save to localStorage
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));
      
      openAlertBox({ 
        type: 'success', 
        msg: 'Added to wishlist! Login to save permanently.' 
      });
      return;
    }
    
    try {
      const response = await apiAddToMyList({
        productId: product._id,
        productTitle: product.name,
        images: product.images || [],
        rating: product.rating || 0,
        price: product.price || 0,
        oldPrice: product.oldePrice || 0,
        brand: product.brand || '',
        discount: product.discount || 0
      });
      
      console.log('Add to wishlist response:', response);
      
      if (response.success) {
        openAlertBox({ type: 'success', msg: response.message || 'Added to wishlist!' });
        
        // Refresh wishlist from backend
        await loadMyList();
      } else if (response.message === 'Item already in my list') {
        openAlertBox({ type: 'info', msg: 'Item already in your wishlist' });
      } else {
        openAlertBox({ type: 'error', msg: response.message || 'Failed to add to wishlist' });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      openAlertBox({ type: 'error', msg: 'Error adding to wishlist' });
    }
  };

  // Remove from wishlist function
  const removeFromMyList = async (itemId) => {
    console.log('Removing from wishlist, itemId:', itemId);
    
    // Update local state first for immediate UI feedback
    const updatedWishlist = myList.filter(item => item._id !== itemId);
    setMyList(updatedWishlist);
    
    // Save to localStorage immediately
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));
    
    if (!isLogin) {
      // For guest users, we're already done
      openAlertBox({ type: 'success', msg: 'Removed from wishlist!' });
      return;
    }
    
    try {
      const response = await apiRemoveFromMyList(itemId);
      
      console.log('Remove from wishlist response:', response);
      
      if (response.success) {
        openAlertBox({ type: 'success', msg: response.message || 'Removed from wishlist!' });
        
        // Update localStorage again with backend data
        setTimeout(async () => {
          await loadMyList(); // Reload from backend to ensure sync
        }, 100);
      } else {
        openAlertBox({ type: 'error', msg: response.message || 'Failed to remove from wishlist' });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      openAlertBox({ type: 'error', msg: 'Error removing from wishlist' });
    }
  };

  // Sync guest wishlist to backend
  const syncGuestWishlistToBackend = async () => {
    if (!isLogin || myList.length === 0) return;
    
    // Check if there are any guest items to sync
    const guestItems = myList.filter(item => item.isGuest);
    
    if (guestItems.length === 0) return;
    
    console.log('Syncing guest wishlist items to backend:', guestItems.length);
    
    try {
      // Add each guest item to backend
      for (const item of guestItems) {
        if (item.productId && item.productId._id) {
          await apiAddToMyList({
            productId: item.productId._id,
            productTitle: item.productTitle,
            images: item.images,
            rating: item.rating,
            price: item.price,
            oldPrice: item.oldPrice,
            brand: item.brand,
            discount: item.discount
          });
        }
      }
      
      // After syncing, reload from backend
      await loadMyList();
      
      console.log('Guest wishlist synced to backend');
    } catch (error) {
      console.error('Error syncing guest wishlist:', error);
    }
  };

  // ================== PRODUCT FUNCTIONS ==================

  // Fetch all products
  const fetchAllProducts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await fetchDataFromApi('/api/product/getAllProducts', params);
      if (response.success) {
        setProducts(response.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetchDataFromApi('/api/product/getAllFeaturedProducts');
      if (response.success) {
        setFeaturedProducts(response.products || []);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  // Fetch single product by ID
  const fetchProductById = async (id) => {
    try {
      const response = await fetchDataFromApi(`/api/product/${id}`);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  // ================== CART FUNCTIONS ==================

  // Load initial cart based on auth status
  const loadInitialCart = useCallback(async () => {
    const token = localStorage.getItem('accessToken');

    if (token && token !== "") {
      // User is logged in
      setIsLogin(true);
      await loadUserData();
      await loadCartFromBackend();
      await loadMyList(); // Load wishlist for logged-in users
    } else {
      // User is guest
      setIsLogin(false);
      loadCartFromStorage();
      
      // Load wishlist from localStorage for guest
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setMyList(parsedWishlist);
        } catch (error) {
          console.error('Error loading guest wishlist:', error);
          setMyList([]);
        }
      } else {
        setMyList([]);
      }
    }
  }, []);

  // Load cart from backend for logged-in users
  const loadCartFromBackend = async () => {
    try {
      console.log('App.js: Loading cart from backend');
      const response = await fetchDataFromApi('/api/cart/get');

      if (response.success) {
        // Transform backend cart data to match frontend format
        const backendCart = (response.data || []).map(item => ({
          ...item.productId, // Spread product details
          _id: item.productId?._id,
          cartItemId: item._id, // Save cart item ID for updates/deletes
          quantity: item.quantity || 1,
          totalPrice: (item.productId?.price || 0) * (item.quantity || 1)
        }));

        console.log('App.js: Backend cart loaded:', backendCart.length, 'items');
        setCart(backendCart);
        saveCartToStorage(backendCart);

        // Check if there's any local cart to sync
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          const guestCart = JSON.parse(localCart);
          if (guestCart.length > 0) {
            await syncGuestCartToBackend(guestCart);
            localStorage.removeItem('guest_cart');
          }
        }
      }
    } catch (error) {
      console.error('App.js: Error loading cart from backend:', error);
      loadCartFromStorage();
    }
  };

  // Sync guest cart to backend when user logs in
  const syncGuestCartToBackend = async (guestCart) => {
    try {
      console.log('App.js: Syncing guest cart to backend:', guestCart.length, 'items');

      // Format items for backend sync
      const itemsToSync = guestCart.map(item => ({
        productId: item._id,
        quantity: item.quantity || 1
      }));

      if (itemsToSync.length > 0) {
        const syncResponse = await postData('/api/cart/sync', { cartItems: itemsToSync });

        if (syncResponse.success) {
          console.log('App.js: Guest cart synced to backend:', syncResponse.syncedItems, 'items');
          // Reload cart from backend after sync
          await loadCartFromBackend();
        } else {
          console.error('App.js: Failed to sync guest cart:', syncResponse.message);
        }
      }
    } catch (error) {
      console.error('App.js: Error syncing guest cart:', error);
    }
  };

  // Load cart from localStorage for guest users
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      console.log('App.js: Loading cart from storage');

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('App.js: Error loading cart from storage:', error);
      setCart([]);
    }
  };

  // Save cart to localStorage
  const saveCartToStorage = (cartItems) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('App.js: Error saving cart to storage:', error);
    }
  };

  // ================== USER FUNCTIONS ==================

  // Load user data
  const loadUserData = async () => {
    try {
      const response = await fetchDataFromApi('/api/user/user-details');
      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Handle user login
  const handleUserLogin = async () => {
    setIsLogin(true);
    await loadUserData();
    await loadCartFromBackend();
    
    // Sync guest wishlist if exists
    const guestWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (guestWishlist) {
      try {
        const parsedWishlist = JSON.parse(guestWishlist);
        if (parsedWishlist.length > 0) {
          setMyList(parsedWishlist);
          // Sync guest items to backend in background
          setTimeout(async () => {
            await syncGuestWishlistToBackend();
          }, 500);
        }
      } catch (error) {
        console.error('Error loading guest wishlist on login:', error);
      }
    } else {
      await loadMyList();
    }
  };

  // Handle user logout
  const handleUserLogout = () => {
    // Save current cart to guest storage before logging out
    if (cart.length > 0) {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }

    // Save guest wishlist items if any exist
    const guestWishlistItems = myList.filter(item => item.isGuest);
    if (guestWishlistItems.length > 0) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(guestWishlistItems));
    } else {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    }
    
    localStorage.removeItem(WISHLIST_LAST_SYNC_KEY);

    // Clear user data
    localStorage.removeItem('accessToken');
    setIsLogin(false);
    setUserData(null);

    // Load guest cart or clear
    const guestCart = localStorage.getItem('guest_cart');
    if (guestCart) {
      setCart(JSON.parse(guestCart));
      saveCartToStorage(JSON.parse(guestCart));
    } else {
      setCart([]);
      saveCartToStorage([]);
    }

    // Clear wishlist state but keep guest items
    setMyList(guestWishlistItems);

    openAlertBox({ type: 'success', msg: 'Logged out successfully!' });
  };

  // ================== CART OPERATIONS ==================

  // Add to cart function - handles both logged in and guest users
  const addToCart = async (product, quantity = 1) => {
    if (!product || !product._id) {
      openAlertBox({ type: 'error', msg: 'Invalid product' });
      return;
    }

    console.log('App.js: Adding to cart, user logged in:', isLogin);
    console.log('Product ID:', product._id);
    console.log('Quantity:', quantity);

    if (isLogin) {
      // User is logged in - use backend API
      try {
        console.log('Sending request to /api/cart/add');
        const response = await postData('/api/cart/add', {
          productId: product._id.toString(),
          quantity: quantity
        });

        console.log('Backend response:', response);

        if (response.success) {
          // Refresh cart from backend to get updated data
          await loadCartFromBackend();
          openAlertBox({ type: 'success', msg: 'Product added to cart!' });
        } else {
          // Check if item already exists
          if (response.message === 'Item already in cart') {
            // Item exists, update quantity
            console.log('Item already in cart, updating quantity...');

            // Find the existing cart item
            const cartItem = cart.find(item => item._id === product._id);

            if (cartItem && cartItem.cartItemId) {
              const newQuantity = (cartItem.quantity || 1) + quantity;
              await updateCartItemQuantity(product._id, newQuantity);
              openAlertBox({ type: 'success', msg: 'Product quantity updated in cart!' });
            } else {
              // If cart item exists in backend but not in local state, reload cart
              await loadCartFromBackend();
              openAlertBox({ type: 'info', msg: 'Item already in cart' });
            }
          } else {
            openAlertBox({ type: 'error', msg: response.message || 'Failed to add to cart' });
          }
        }
      } catch (error) {
        console.error('App.js: Error adding to cart via API:', error);
        console.error('Error details:', error.response?.data || error.message);
        openAlertBox({ type: 'error', msg: 'Network error. Please try again.' });
      }
    } else {
      // Guest user - use localStorage
      console.log('Adding to guest cart');
      updateLocalCartAfterAdd(product, quantity);
      openAlertBox({ type: 'success', msg: 'Product added to cart! Login to save cart permanently.' });
    }
  };

  // Update local cart after adding item
  const updateLocalCartAfterAdd = async (product, quantity) => {
    const existingItemIndex = cart.findIndex(item => item._id === product._id);

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].totalPrice = updatedCart[existingItemIndex].price * updatedCart[existingItemIndex].quantity;
      setCart(updatedCart);
      saveCartToStorage(updatedCart);
    } else {
      const cartItem = {
        ...product,
        quantity: quantity,
        totalPrice: product.price * quantity
      };
      const updatedCart = [...cart, cartItem];
      setCart(updatedCart);
      saveCartToStorage(updatedCart);
    }
  };

  // Update cart item quantity via backend
  const updateCartItemQuantityBackend = async (productId, additionalQuantity) => {
    try {
      // First find the cart item
      const cartItem = cart.find(item => item._id === productId);
      if (!cartItem || !cartItem.cartItemId) return;

      const newQuantity = (cartItem.quantity || 1) + additionalQuantity;

      // Use the aliased API function
      const response = await apiUpdateCartItem(cartItem.cartItemId, newQuantity);

      if (response.success) {
        // Update local state
        const updatedCart = cart.map(item => {
          if (item._id === productId) {
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: item.price * newQuantity
            };
          }
          return item;
        });

        setCart(updatedCart);
        saveCartToStorage(updatedCart);
      }
    } catch (error) {
      console.error('App.js: Error updating cart quantity via API:', error);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    if (isLogin) {
      // Update via API for logged-in users
      try {
        const cartItem = cart.find(item => item._id === productId);
        if (!cartItem || !cartItem.cartItemId) return;

        // Use the aliased API function
        const response = await apiUpdateCartItem(cartItem.cartItemId, quantity);

        console.log('Update cart response:', response);

        if (response.success) {
          // Update local state
          const updatedCart = cart.map(item => {
            if (item._id === productId) {
              return {
                ...item,
                quantity: quantity,
                totalPrice: item.price * quantity
              };
            }
            return item;
          });

          setCart(updatedCart);
          saveCartToStorage(updatedCart);
        }
      } catch (error) {
        console.error('App.js: Error updating cart quantity:', error);
      }
    } else {
      // Guest user - update localStorage
      const updatedCart = cart.map(item => {
        if (item._id === productId) {
          return {
            ...item,
            quantity: quantity,
            totalPrice: item.price * quantity
          };
        }
        return item;
      });

      setCart(updatedCart);
      saveCartToStorage(updatedCart);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    console.log('=== removeFromCart called ===');
    console.log('Product ID to remove:', productId);
    console.log('Is user logged in:', isLogin);
    console.log('Current cart state:', cart);

    if (!productId) {
      console.error('No productId provided');
      openAlertBox({ type: 'error', msg: 'Invalid product ID' });
      return;
    }

    // Find the cart item
    const cartItem = cart.find(item => item._id === productId);
    console.log('Found cart item:', cartItem);

    if (!cartItem) {
      console.error('Cart item not found for productId:', productId);
      openAlertBox({ type: 'error', msg: 'Product not found in cart' });
      return;
    }

    try {
      if (isLogin) {
        // User is logged in - use backend API
        console.log('User is logged in, calling API');
        console.log('Cart item ID (cartItemId):', cartItem.cartItemId);
        console.log('Product ID:', cartItem._id);

        if (!cartItem.cartItemId) {
          console.error('Missing cartItemId, cannot delete via API');
          console.log('Falling back to local deletion');

          // Fallback to local deletion
          const updatedCart = cart.filter(item => item._id !== productId);
          setCart(updatedCart);
          saveCartToStorage(updatedCart);
          openAlertBox({ type: 'success', msg: 'Product removed from cart!' });
          return;
        }

        // Use the aliased API function, not the local one
        const response = await apiRemoveFromCart(cartItem.cartItemId, cartItem._id);

        console.log('Delete API response:', response);

        if (response && response.success) {
          // Update local state
          const updatedCart = cart.filter(item => item._id !== productId);
          setCart(updatedCart);
          saveCartToStorage(updatedCart);
          openAlertBox({ type: 'success', msg: response.message || 'Product removed from cart!' });

          // Refresh cart from backend to ensure sync
          setTimeout(async () => {
            try {
              await loadCartFromBackend();
            } catch (error) {
              console.log('Background refresh failed:', error);
            }
          }, 100);
        } else {
          const errorMsg = response?.message || 'Failed to remove from cart';
          openAlertBox({ type: 'error', msg: errorMsg });
        }
      } else {
        // Guest user - update localStorage only
        console.log('User is guest, updating local storage');
        const updatedCart = cart.filter(item => item._id !== productId);
        setCart(updatedCart);
        saveCartToStorage(updatedCart);
        openAlertBox({ type: 'success', msg: 'Product removed from cart!' });
      }
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      console.error('Error details:', error.response?.data || error.message);
      openAlertBox({ type: 'error', msg: 'Error removing product from cart' });
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isLogin) {
      // For logged-in users, remove all items one by one
      try {
        for (const item of cart) {
          if (item.cartItemId) {
            // Use the aliased API function
            await apiRemoveFromCart(item.cartItemId, item._id);
          }
        }
      } catch (error) {
        console.error('App.js: Error clearing cart from backend:', error);
      }
    }

    setCart([]);
    saveCartToStorage([]);
    localStorage.removeItem('guest_cart');
    openAlertBox({ type: 'success', msg: 'Cart cleared successfully!' });
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate cart items count
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // ================== UTILITY FUNCTIONS ==================

  // Open product details
  const openProductDetails = async (productId) => {
    const product = await fetchProductById(productId);
    if (product) {
      setSelectedProduct(product);
      setOpenProductDetailsModal(true);
    } else {
      openAlertBox({ type: 'error', msg: 'Failed to load product details' });
    }
  };

  // Alert box function
  const openAlertBox = ({ type, msg }) => {
    if (type === 'success') {
      toast.success(msg);
    } else if (type === 'error') {
      toast.error(msg);
    } else {
      toast(msg);
    }
  };

  // ================== USE EFFECTS FOR PERSISTENCE ==================

  // Auto-save wishlist to localStorage
  useEffect(() => {
    // Don't save empty wishlist for logged-in users (they get it from backend)
    if (myList.length > 0 && (!isLogin || myList.some(item => item.isGuest))) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(myList));
    } else if (myList.length === 0 && !isLogin) {
      // Clear localStorage if wishlist is empty and user is guest
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    }
  }, [myList, isLogin]);

  // Cleanup old wishlist data
  useEffect(() => {
    const cleanupOldWishlistData = () => {
      try {
        const lastSync = localStorage.getItem(WISHLIST_LAST_SYNC_KEY);
        if (lastSync) {
          const lastSyncTime = parseInt(lastSync);
          const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
          
          if (lastSyncTime < oneWeekAgo) {
            // Data is older than a week, clear it
            localStorage.removeItem(WISHLIST_STORAGE_KEY);
            localStorage.removeItem(WISHLIST_LAST_SYNC_KEY);
            console.log('Cleaned up old wishlist data');
          }
        }
      } catch (error) {
        console.error('Error cleaning up wishlist data:', error);
      }
    };

    cleanupOldWishlistData();
  }, []);

  // Handle page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Save current state before page unload
      if (myList.length > 0) {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(myList));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [myList]);

  // ================== CONTEXT VALUES ==================

  const values = {
    // Existing values
    setOpenProductDetailsModal,
    openProductDetailsModal,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
    openAlertBox,
    isLogin,
    setIsLogin: handleUserLogin,
    handleUserLogout,
    userData,
    setUserData,

    // New cart and product values
    products,
    featuredProducts,
    cart,
    loading,
    selectedProduct,
    fetchAllProducts,
    fetchFeaturedProducts,
    fetchProductById,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    openProductDetails,
    handleCloseProductDetailsModal,
    setSelectedProduct,

    // Wishlist values
    myList,
    setMyList,
    myListLoading,
    addToMyList,
    removeFromMyList,
    loadMyList,
    isInMyList,
  };

  // ================== RENDER ==================

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/productListing' element={<ProductListing />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/forgot-password' element={<ForgetPassword />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/my-account' element={<MyAccount />} />
            <Route path='/my-list' element={<MyList />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/address' element={<Address />} />
          </Routes>
          <Footer />

          <Toaster />

          <Dialog
            open={openProductDetailsModal}
            onClose={handleCloseProductDetailsModal}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            className='productDetailsModal'
          >
            <DialogContent>
              <div className='flex items-center w-full productDetailsModalContainer relative'>
                <Button
                  className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[black] !absolute top-[0px] right-[0px] !bg-[#f1f1f1]'
                  onClick={handleCloseProductDetailsModal}
                >
                  <IoClose className='text-[22px]' />
                </Button>
                <div className="col1 w-[40%]">
                  {selectedProduct && <ProductZoom product={selectedProduct} />}
                </div>
                <div className="col2 w-[60%] py-8 px-8 pr-16 productContent">
                  {selectedProduct && <ProductDetailsComponent product={selectedProduct} />}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
export { MyContext };