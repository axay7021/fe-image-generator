'use server';

import apiClient from '@/lib/api-client';
import { AxiosError } from 'axios';

export async function generateImageAction(formData: FormData) {
  const type = formData.get('type') as string;
  const prompt = formData.get('prompt') as string;
  const image = formData.get('image') as File;

  let endpointAction = '';
  switch (type) {
    case 'linkedin-profile':
      endpointAction = 'linkedin-profile';
      break;
    case 'passport':
      endpointAction = 'passport-size';
      break;
    case 'background':
      endpointAction = 'change-bg';
      break;
    case 'remove':
      endpointAction = 'remove-object';
      break;
    case 'prompt':
      endpointAction = 'custom-edit';
      break;
    default:
      throw new Error('Invalid transformation type');
  }

  const apiFormData = new FormData();
  apiFormData.append('file', image);

  // Map prompt to extra_context as per script
  if (prompt) {
    apiFormData.append('extra_context', prompt);
  }

  // Handle LinkedIn Profile
  if (type === 'linkedin-profile') {
    const style = formData.get('style') as string;
    if (style) apiFormData.append('style', style);
  }

  // Handle Background Change
  if (type === 'background') {
    const category = formData.get('category') as string;
    if (category) apiFormData.append('category', category);
  }

  // Handle Passport Specifics
  if (type === 'passport') {
    const passportMode = formData.get('passport_mode') as string;
    apiFormData.append('passport_mode', passportMode || 'standard');

    if (passportMode === 'suit') {
      const suitColor = formData.get('suit_color') as string;
      const tieColor = formData.get('tie_color') as string;
      if (suitColor) apiFormData.append('suit_color', suitColor);
      if (tieColor) apiFormData.append('tie_color', tieColor);
    }
  }

  try {
    const response = await apiClient.post(`/modify-image/${endpointAction}`, apiFormData, {
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
    console.error('Generate Image Action Failed:', error);
    let errorMessage = 'Failed to generate image';

    if (error instanceof AxiosError) {
      if (error.response?.status === 429) {
        return {
          success: false,
          error: 'Daily limit reached. Please try again tomorrow.',
        };
      }
      // Try to extract error message from response data (which might be ArrayBuffer)
      if (error.response?.data) {
        try {
          // If responseType was arraybuffer, we need to decode it to JSON
          const decoder = new TextDecoder();
          const jsonString = decoder.decode(error.response.data);
          const errorJson = JSON.parse(jsonString);

          if (typeof errorJson.error === 'string') {
            errorMessage = errorJson.error;
          } else if (typeof errorJson.error === 'object') {
            errorMessage =
              errorJson.error.message || errorJson.error.detail || JSON.stringify(errorJson.error);
          } else if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.detail) {
            errorMessage = errorJson.detail;
          }
        } catch (e) {
          console.error('Generate Image Action Failed:', e);
          errorMessage = error.message;
        }
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
