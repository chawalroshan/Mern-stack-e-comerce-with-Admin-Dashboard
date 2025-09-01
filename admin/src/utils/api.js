import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export async function postData(url, formData) {
  try {
    console.log('API Request:', {
      url: apiUrl + url,
      data: formData,
      apiUrl: apiUrl
    });
    
    const response = await axios.post(apiUrl + url, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
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


export async function uploadImage(url, data = {}, isFormData = false) {
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
