"use server";

export interface SubscriptionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    id: string;
    status: string;
    quota_used: number;
    period_end: string;
    plan: {
      id: string;
      name: string;
      price_usd: number;
      image_quota: number;
      stripe_price_id: string;
      is_active: boolean;
      created_at: string;
    };
  };
}

export async function getUserSubscription(
  token: string
): Promise<SubscriptionResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is not set");
      return {
        statusCode: 500,
        success: false,
        message: "Configuration error",
      };
    }

    const response = await fetch(`${baseUrl}/my-subscription`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      next: { revalidate: 0 },
    });
    console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get subscription exception:", error);
    return {
      statusCode: 500,
      success: false,
      message: "Failed to fetch subscription",
    };
  }
}
