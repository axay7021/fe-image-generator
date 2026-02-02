'use server';

import { SubscriptionData, BillingHistoryItem } from '@/util/types';
import apiClient from '@/lib/api-client';

export interface SubscriptionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: SubscriptionData;
}

export async function getUserSubscription() {
  try {
    const response = await apiClient.get<SubscriptionResponse>('/my-subscription');
    return response.data;
  } catch (error: unknown) {
    console.error('Get subscription exception:', error);
    return {
      statusCode: 500,
      success: false,
      message: 'Failed to fetch subscription',
    };
  }
}

export interface BillingHistoryResponse {
  success: boolean;
  data: BillingHistoryItem[];
  message?: string;
}

export async function getUserBillingHistory() {
  try {
    const response = await apiClient.get<BillingHistoryResponse>('/my-subscription-history');
    return response.data;
  } catch (error: unknown) {
    console.error('Get billing history exception:', error);
    return {
      success: false,
      data: [],
      message: 'Failed to fetch billing history',
    };
  }
}
