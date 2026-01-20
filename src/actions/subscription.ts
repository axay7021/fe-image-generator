"use server";

import { SubscriptionData, BillingHistoryItem } from "@/util/types";

export interface SubscriptionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: SubscriptionData;
}

export async function getUserSubscription(
  token: string,
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
    console.log(error);
    console.error("Get subscription exception:", error);
    return {
      statusCode: 500,
      success: false,
      message: "Failed to fetch subscription",
    };
  }
}

export interface BillingHistoryResponse {
  success: boolean;
  data: BillingHistoryItem[];
  message?: string;
}

export async function getUserBillingHistory(
  token: string,
): Promise<BillingHistoryResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/my-subscription-history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      next: { revalidate: 0 },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get billing history exception:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch billing history",
    };
  }
}
