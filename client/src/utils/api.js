import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export async function postData(url, formData) {
  try {
    const response = await axios.post(apiUrl + url, formData, { 
      headers: getAuthHeaders() 
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error posting data:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function fetchDataFromApi(url, params = {}) {
  try {
    const response = await axios.get(apiUrl + url, {
      headers: getAuthHeaders(),
      params // optional query params
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching data:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function uploadImage(url, data = {}, isFormData = false) {
  try {
    const response = await axios.post(apiUrl + url, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' })
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching data:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function editData(url, data = {}, isFormData = false) {
  try {
    const response = await axios.put(apiUrl + url, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' })
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching data:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Get products with filters
export async function getProducts(params = {}) {
  try {
    const response = await axios.get(apiUrl + '/api/product/getAllProducts', {
      headers: getAuthHeaders(),
      params
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Get single product
export async function getProductById(id) {
  try {
    const response = await axios.get(apiUrl + `/api/product/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching product:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Get featured products
export async function getFeaturedProducts() {
  try {
    const response = await axios.get(apiUrl + '/api/product/getAllFeaturedProducts', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching featured products:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Get products by category
export async function getProductsByCategory(catId, params = {}) {
  try {
    const response = await axios.get(apiUrl + `/api/product/getAllProductsByCatId/${catId}`, {
      headers: getAuthHeaders(),
      params
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching category products:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// ========== CART API FUNCTIONS - UPDATED TO MATCH BACKEND ==========

// Add item to cart - MATCHES: POST /api/cart/add
export async function addToCart(productId, quantity = 1) {
  try {
    const response = await axios.post(apiUrl + '/api/cart/add', {
      productId,
      quantity
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error adding to cart:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Get cart items - MATCHES: GET /api/cart/get
export async function getCart() {
  try {
    const response = await axios.get(apiUrl + '/api/cart/get', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching cart:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Update cart item quantity - MATCHES: PUT /api/cart/update-qty
export async function updateCartItem(cartItemId, quantity) {
  try {
    const response = await axios.put(apiUrl + '/api/cart/update-qty', {
      _id: cartItemId,
      qty: quantity
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error updating cart:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Remove item from cart - MATCHES: DELETE /api/cart/delete-cart-item
export async function removeFromCart(cartItemId, productId) {
  try {
    const response = await axios.delete(apiUrl + '/api/cart/delete-cart-item', {
      headers: getAuthHeaders(),
      data: {
        _id: cartItemId,
        productId: productId
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error removing from cart:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Sync cart - MATCHES: POST /api/cart/sync
export async function syncCart(cartItems) {
  try {
    const response = await axios.post(apiUrl + '/api/cart/sync', {
      cartItems
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error syncing cart:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// ========== DELETE OPERATION WITH BODY SUPPORT ==========
// Since your backend DELETE endpoint expects a body, use this approach:
export async function deleteData(url, data) {
  try {
    const response = await axios.delete(apiUrl + url, {
      headers: getAuthHeaders(),
      data: data
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error deleting data:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}


// Add to wishlist
export async function addToMyList(data) {
  try {
    const response = await axios.post(apiUrl + '/api/mylist/add', data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error adding to wishlist:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Remove from wishlist
export async function removeFromMyList(itemId) { // Remove productId parameter
  try {
    console.log('API: Removing from wishlist, itemId:', itemId);
    
    const response = await axios.delete(apiUrl + `/api/mylist/${itemId}`, {
      headers: getAuthHeaders()
      // No need to send data in body for DELETE
    });
    
    console.log('API: Remove from wishlist response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: Error removing from wishlist:', error);
    console.error('API: Error response:', error.response?.data);
    
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// Get wishlist
export async function getMyList() {
  try {
    const response = await axios.get(apiUrl + '/api/mylist/get', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching wishlist:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// ========== ORDER API FUNCTIONS ==========

export async function placeOrder(orderData) {
  try {
    const response = await axios.post(apiUrl + '/api/orders/place', orderData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error placing order:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function getUserOrders() {
  try {
    const response = await axios.get(apiUrl + '/api/orders/user-orders', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching user orders:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function getOrderById(orderId) {
  try {
    const response = await axios.get(apiUrl + `/api/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// ========== PAYMENT API FUNCTIONS ==========

export async function initiateEsewaPayment(orderId) {
  try {
    const response = await axios.post(apiUrl + '/api/payment/esewa/initiate', {
      orderId
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error initiating eSewa payment:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function esewaPaymentSuccess(orderId, paymentId) {
  try {
    const response = await axios.post(apiUrl + '/api/payment/esewa/success', {
      orderId,
      paymentId
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error processing eSewa payment success:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function esewaPaymentFailure(orderId, paymentId, reason) {
  try {
    const response = await axios.post(apiUrl + '/api/payment/esewa/failure', {
      orderId,
      paymentId,
      reason
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error processing eSewa payment failure:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// ========== NOTIFICATION API FUNCTIONS ==========

export async function getUserNotifications() {
  try {
    const response = await axios.get(apiUrl + '/api/notifications/user', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function markNotificationRead(notificationId) {
  try {
    const response = await axios.put(apiUrl + `/api/notifications/${notificationId}/read`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function markAllNotificationsRead() {
  try {
    const response = await axios.put(apiUrl + '/api/notifications/read-all', {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function getUnreadNotificationCount() {
  try {
    const response = await axios.get(apiUrl + '/api/notifications/unread-count', {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching unread notification count:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}
