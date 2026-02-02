'use server';

import apiClient from '@/lib/api-client';
import axios from 'axios';

export async function validateImage(formData: FormData) {
  try {
    // Explicitly unset Content-Type to let Axios/FormData handle the boundary
    const response = await apiClient.post('/validate-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error('Validation error:', error);
    if (axios.isAxiosError(error) && error.response?.data) {
      console.error('Validation response data:', error.response.data);
      return error.response.data;
    }
    return { success: false, message: 'Validation failed' };
  }
}
