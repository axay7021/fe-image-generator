"use server";

export interface CheckoutResponse {
  success: boolean;
  data?: {
    url: string;
  };
  message?: string;
}

export async function createCheckoutSession(
  planId: string,
  token: string,
): Promise<CheckoutResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is not set");
      return { success: false, message: "Configuration error" };
    }

    const response = await fetch(`${baseUrl}/checkout/${planId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();

    if (response.ok && data.data?.url) {
      return {
        success: true,
        data: {
          url: data.data.url,
        },
        message: data.message,
      };
    } else {
      console.error("Checkout API error:", data);
      return {
        success: false,
        message: data.error.message || "Failed to initiate checkout",
      };
    }
  } catch (error) {
    console.error("Checkout action exception:", error);
    return { success: false, message: "Something went wrong" };
  }
}
