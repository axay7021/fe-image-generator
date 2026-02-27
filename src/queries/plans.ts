import axios from 'axios';
import { PricingPlan } from '@/util/types';

export interface ApiPlan {
  id: string;
  name: string;
  price_usd: number;
  image_quota: number;
  stripe_price_id: string;
  is_active: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

const defaultFeatures = {
  free: [
    { name: '1 Generative / Month', included: true },
    { name: 'Basic Image Generation', included: true },
    { name: 'jpg, png', included: true },
    { name: 'Passport photo', included: false },
    { name: 'Full prompt edit', included: false },
    { name: 'Change background', included: false },
    { name: 'Remove object', included: false },
  ],
  pro: [
    { name: '15 Generative', included: true },
    { name: 'Watermark free', included: true },
    { name: 'jpg, png', included: true },
    { name: 'Passport photo', included: true },
    { name: 'Full prompt edit', included: true },
    { name: 'Change background', included: true },
    { name: 'Remove object', included: true },
  ],
};

export async function fetchPlans(): Promise<PricingPlan[]> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';

    // Use generic axios to avoid server-only imports from empty @/lib/api-client
    const response = await axios.get<{ success: boolean; data: ApiPlan[] }>(`${baseURL}/plans`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    console.log({ response });
    if (!response.data.success || !response.data.data) {
      return [];
    }

    const apiPlans = response?.data?.data;
    return apiPlans
      .map((plan) => {
        const isFree = plan.name.toUpperCase().includes('FREE');
        const variant = (isFree ? 'free' : 'pro') as 'free' | 'pro';
        const subtitle = isFree
          ? 'For personal use only with limited features and support'
          : 'For teams and organizations with advanced features and support';

        // Convert to Title Case (e.g., "BASIC PLAN" -> "Basic Plan")
        const displayName = plan.name
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const action = isFree ? 'No Need to Sign in for Free' : 'Buy Now';

        let priceDisplay = '';
        if (isFree) {
          priceDisplay = `${plan.image_quota} Image Free`;
        } else {
          priceDisplay = `₹${plan.price_usd}`;
        }

        // Merge quotas into features if needed
        const features = defaultFeatures[variant].map((f) => {
          if (f.name.includes('Generative')) {
            return {
              ...f,
              name: `${plan.image_quota} Generative${isFree ? ' / Month' : ''}`,
            };
          }
          return f;
        });

        return {
          id: plan.id,
          name: displayName,
          subtitle,
          price: priceDisplay,
          action,
          variant,
          features,
          is_popular: plan.is_popular,
        };
      })
      .sort((a, b) => {
        if (a.variant === b.variant) return 0;
        return a.variant === 'free' ? -1 : 1;
      }); // Ensure Free comes first
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}
