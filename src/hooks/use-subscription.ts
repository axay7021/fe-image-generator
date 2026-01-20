"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import {
  getUserSubscription,
  getUserBillingHistory,
} from "@/actions/subscription";
import { SubscriptionData, BillingHistoryItem } from "@/util/types";

export function useSubscription() {
  const { user, getToken, isLoading: isAuthLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null,
  );
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  useEffect(() => {
    // If auth is still loading, wait.
    if (isAuthLoading) {
      setIsLoading(true);
      return;
    }

    // If not logged in, we are done checking
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Fetch subscription
        const subRes = await getUserSubscription(token);
        if (
          subRes.success &&
          subRes.data &&
          (subRes.data.status === "active" ||
            subRes.data.status === "quota_exhausted")
        ) {
          setSubscription(subRes.data as SubscriptionData);
          setActivePlanId(subRes.data.plan.id);
        } else {
          setSubscription(null);
          setActivePlanId(null);
        }

        // Fetch billing history
        setIsHistoryLoading(true);
        const historyRes = await getUserBillingHistory(token);
        if (historyRes.success) {
          setBillingHistory(historyRes.data);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setIsLoading(false);
        setIsHistoryLoading(false);
      }
    };

    fetchData();
  }, [user, getToken, isAuthLoading]);

  return {
    subscription,
    billingHistory,
    isLoading,
    isHistoryLoading,
    activePlanId,
  };
}
