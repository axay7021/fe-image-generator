'use server';

export interface CheckoutResponse {
  success: boolean;
  data?: {
    url: string;
  };
  message?: string;
}

import apiClient from '@/lib/api-client';
import axios from 'axios';

interface CheckoutAPIResponse {
  data?: {
    url?: string;
    payment_page_url?: string;
  };
  message?: string;
  error?: {
    message: string;
  };
}

export async function createCheckoutSession(planId: string): Promise<CheckoutResponse> {
  try {
    const response = await apiClient.post<CheckoutAPIResponse>(`/razorpay/checkout/${planId}`);

    console.log({ response });
    const data = response.data;
    const checkoutUrl = data.data?.url || data.data?.payment_page_url;

    if (response.status >= 200 && response.status < 300 && checkoutUrl) {
      return {
        success: true,
        data: {
          url: checkoutUrl,
        },
        message: data.message,
      };
    } else {
      // Should not happen if non-2xx throws, but just in case logic flows differently
      console.error('Checkout API error:', data);
      return {
        success: false,
        message: data.error?.message || 'Failed to initiate checkout',
      };
    }
  } catch (error: unknown) {
    console.error('Checkout action exception:', error);
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      return {
        success: false,
        message:
          errorData?.error?.message ||
          errorData?.message ||
          error.message ||
          'Failed to initiate checkout',
      };
    }
    return { success: false, message: 'Something went wrong' };
  }
}
