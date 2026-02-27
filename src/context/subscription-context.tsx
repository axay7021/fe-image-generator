'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { SubscriptionData, BillingHistoryItem } from '@/util/types';
import { useQuery } from '@tanstack/react-query';
import { fetchSubscription, fetchBillingHistory } from '@/queries/subscription';

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  billingHistory: BillingHistoryItem[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  activePlanId: string | null;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();

  // Use React Query for Subscription
  const {
    data: subscription = null,
    isLoading: isSubLoading,
    refetch: refetchSubscription,
  } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: fetchSubscription,
    enabled: !!user && !isAuthLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use React Query for Billing History
  const {
    data: billingHistory = [],
    isLoading: isHistoryApiLoading,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['billing-history', user?.id],
    queryFn: fetchBillingHistory,
    enabled: !!user && !isAuthLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const activePlanId = subscription?.plan?.id || null;
  // Only show loading if we have a user and subscription data is still loading.
  // Don't gate on isAuthLoading — if auth never finishes (production Clerk issue),
  // unauthenticated users should not be blocked by a loader.
  const isLoading = !!user && isSubLoading;
  const isHistoryLoading = !!user && isHistoryApiLoading;

  const refreshSubscription = async () => {
    await Promise.all([refetchSubscription(), refetchHistory()]);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        billingHistory,
        isLoading,
        isHistoryLoading,
        activePlanId,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}
