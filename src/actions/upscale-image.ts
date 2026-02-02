'use server';

import apiClient from '@/lib/api-client';
import { AxiosError } from 'axios';

export async function upscaleImageAction(formData: FormData) {
  const file = formData.get('file') as File;
  const targetWidth = formData.get('target_width') as string;

  // Get Clerk auth token

  const apiFormData = new FormData();
  apiFormData.append('file', file);
  apiFormData.append('target_width', targetWidth);

  try {
    const response = await apiClient.post('/upscale', apiFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);
    const mimeType = response.headers['content-type'] || 'image/png';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      success: true,
      imageUrl: dataUrl,
    };
  } catch (error: unknown) {
    console.error('Upscale Action Failed:', error);
    let errorMessage = 'Failed to upscale image';
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        try {
          const decoder = new TextDecoder();
          const jsonString = decoder.decode(error.response.data);
          const errorJson = JSON.parse(jsonString);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch {
          errorMessage = error.message;
        }
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
}
