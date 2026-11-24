'use server';

import apiClient from '@/lib/api-client';
import { AxiosError } from 'axios';

export async function generateImageAction(formData: FormData) {
  try {
    const type = formData.get('type') as string;
    const prompt = formData.get('prompt') as string;
    const image = formData.get('image') as File;

    if (!image) {
      return {
        success: false,
        error: 'Please upload an image first.',
      };
    }

    let endpointAction = 'custom-edit';
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
      default:
        endpointAction = 'custom-edit';
        break;
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
    let errorMessage = 'Failed to generate image. Please try again.';

    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 429) {
        return {
          success: false,
          error: 'Google AI Studio daily generation limit reached on the Free Tier. Quota resets daily.',
        };
      }
      if (status === 402) {
        return {
          success: false,
          error: 'AI Studio prepayment credits are depleted. Please check billing or add credits.',
        };
      }

      // Try to extract error message from response data (which might be ArrayBuffer)
      if (error.response?.data) {
        try {
          const decoder = new TextDecoder();
          const jsonString = decoder.decode(error.response.data);
          const errorJson = JSON.parse(jsonString);

          if (typeof errorJson.error === 'string') {
            errorMessage = errorJson.error;
          } else if (typeof errorJson.error === 'object' && errorJson.error) {
            errorMessage =
              errorJson.error.message || errorJson.error.detail || JSON.stringify(errorJson.error);
          } else if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.detail) {
            errorMessage = errorJson.detail;
          }
        } catch {
          errorMessage = error.message;
        }
      } else {
        errorMessage = error.message;
      }

      if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota') || status === 500) {
        if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
          errorMessage = 'Google AI Studio daily generation limit reached on the Free Tier. Quota resets daily.';
        } else {
          errorMessage = 'The image generation service returned a server error (likely daily AI quota limit reached). Please verify API key credits or try again later.';
        }
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
