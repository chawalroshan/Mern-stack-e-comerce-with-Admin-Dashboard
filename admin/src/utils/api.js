import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export async function postData(url, formData) {
  try {
    const response = await axios.post(apiUrl + url, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    // If the backend sent a response, return it
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
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

export async function editData(url, data = {}, isFormData = false) {
  try {
    const response = await axios.put(apiUrl + url, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
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
      message: 'Something went wrong',
    };
  }
}

export async function deleteData(url) {
  try {
    const response = await axios.delete(apiUrl + url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
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


export async function uploadImages(url, data = {}, isFormData = false) {
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
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function deleteImages(url, data = {}) {
  try {
    const response = await axios.delete(apiUrl + url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      data // axios allows sending data in DELETE using the `data` property
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }

    console.error('Error deleting image:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

// ========== ORDER API FUNCTIONS ==========

export async function getAdminOrders() {
  try {
    const response = await axios.get(apiUrl + '/api/orders/admin-orders', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error fetching admin orders:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}

export async function updateOrderStatus(orderId, orderStatus) {
  try {
    const response = await axios.put(apiUrl + `/api/orders/${orderId}/status`, {
      orderStatus
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: true,
      message: 'Something went wrong'
    };
  }
}
