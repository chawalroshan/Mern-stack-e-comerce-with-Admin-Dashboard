import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export async function postData(url, formData) {
  try {
    const response = await axios.post(apiUrl + url, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
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




// export async function postData(url, formData) {
//   try {
//     const response = await axios.post(apiUrl + url, formData, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     // If the backend sent a response, return it
//     if (error.response && error.response.data) {
//       return error.response.data;
//     }
//     console.error('Error posting data:', error);
//     return {
//       success: false,
//       error: true,
//       message: 'Something went wrong'
//     };
//   }
// }
