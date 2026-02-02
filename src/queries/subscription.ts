import { getUserSubscription, getUserBillingHistory } from '@/actions/subscription';
import { SubscriptionData, BillingHistoryItem } from '@/util/types';

export const fetchSubscription = async (): Promise<SubscriptionData | null> => {
  const result = await getUserSubscription();
  if (!result.success && result.message !== 'Failed to fetch subscription') {
    throw new Error(result.message || 'Failed to fetch subscription');
  }
  return result.data || null;
};

export const fetchBillingHistory = async (): Promise<BillingHistoryItem[]> => {
  const result = await getUserBillingHistory();
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch billing history');
  }
  return result.data || [];
};
