"use server";

import { SubscriptionData, BillingHistoryItem } from "@/util/types";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export interface SubscriptionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: SubscriptionData;
}

export async function getUserSubscription() {
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

    // Get Clerk auth token
    const { getToken } = await auth();
    const token = await getToken();

    // Get IP
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

    const response = await fetch(`${baseUrl}/my-subscription`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        "X-Forwarded-For": ip,
      },
      next: { revalidate: 0 },
    });
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

export interface BillingHistoryResponse {
  success: boolean;
  data: BillingHistoryItem[];
  message?: string;
}

export async function getUserBillingHistory() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Get Clerk auth token
    const { getToken } = await auth();
    const token = await getToken();

    // Get IP
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

    const response = await fetch(`${baseUrl}/my-subscription-history`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
        "X-Forwarded-For": ip,
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
