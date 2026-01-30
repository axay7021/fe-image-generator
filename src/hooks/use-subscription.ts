"use client";

"use client";

import { useSubscriptionContext } from "@/context/subscription-context";

export function useSubscription() {
  return useSubscriptionContext();
}
