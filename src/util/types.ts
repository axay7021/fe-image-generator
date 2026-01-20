export interface PricingFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  action: string;
  variant: "free" | "pro";
  features: PricingFeature[];
  is_popular?: boolean;
}

export interface SubscriptionData {
  id: string;
  status: string;
  quota_used: number;
  period_end: string;
  image_generation_limit: number;
  plan: {
    id: string;
    name: string;
    price_usd: number;
    image_quota: number;
    stripe_price_id: string;
    is_active: boolean;
    created_at: string;
  };
}

export interface BillingHistoryItem {
  id: string;
  plan: {
    name: string;
    price_usd: number;
    image_quota: number;
    stripe_price_id: string;
    validity_days: number;
    id: string;
    is_active: boolean;
    created_at: string;
  };
  status: string;
  image_generation_limit: number;
  quota_used: number;
  period_start: string;
  period_end: string;
  created_at: string;
}
