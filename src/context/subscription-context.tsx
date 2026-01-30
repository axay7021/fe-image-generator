"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/auth-context";
import {
  getUserSubscription,
  getUserBillingHistory,
} from "@/actions/subscription";
import { SubscriptionData, BillingHistoryItem } from "@/util/types";

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  billingHistory: BillingHistoryItem[];
  isLoading: boolean;
  isHistoryLoading: boolean;
  activePlanId: string | null;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null,
  );
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  const fetchSubscriptionData = useCallback(
    async (isThorough = false) => {
      if (isAuthLoading) return;
      if (!user) {
        setSubscription(null);
        setBillingHistory([]);
        setActivePlanId(null);
        setIsLoading(false);
        return;
      }

      try {
        // If we are refreshing (thorough) or don't have data, set loading
        // We check the current state inside the set state updater or just assume we need loading if checking explicitly
        // But we can't access state here without adding it to deps.
        // We'll just set loading to true if it's an explicit refresh or if we are mounting.
        // However, for the "polling" or "silent update" user wants, we might want to avoid flashing loading state.
        // Let's rely on the calling context.
        // For now, let's just set isLoading to true if we don't have a subscription in the context yet (we can't check that easily without deps).
        // So we will just manage a local ref or just let it be.

        // Simpler approach:
        // loading state is for the *initial* load. Subsequent revalidations can be silent or use a separate "isRefetching" state if needed.
        // But here user wants to just "get from store".

        const subRes = await getUserSubscription();
        if (subRes.success && subRes.data) {
          setSubscription(subRes.data as SubscriptionData);
          setActivePlanId((subRes.data as SubscriptionData).plan.id);
        } else {
          setSubscription(null);
          setActivePlanId(null);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user, isAuthLoading],
  );

  const fetchBillingHistory = useCallback(async () => {
    if (!user) return;

    setIsHistoryLoading(true);
    try {
      const historyRes = await getUserBillingHistory();
      if (historyRes.success) {
        setBillingHistory(historyRes.data);
      }
    } catch (error) {
      console.error("Error fetching billing history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    if (isAuthLoading) return;
    fetchSubscriptionData();
    fetchBillingHistory();
  }, [user, isAuthLoading, fetchSubscriptionData, fetchBillingHistory]);

  const refreshSubscription = async () => {
    // When manually refreshing, we might want to show loading?
    // Or maybe just background refresh. User didn't specify, but usually background refresh is better for credits update.
    await Promise.all([fetchSubscriptionData(), fetchBillingHistory()]);
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
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider",
    );
  }
  return context;
}
