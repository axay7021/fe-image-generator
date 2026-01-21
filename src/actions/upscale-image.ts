"use server";

import { auth } from "@clerk/nextjs/server";

export async function upscaleImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  const targetWidth = formData.get("target_width") as string;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error("API Base URL is not configured");
  }

  // Get Clerk auth token
  const { getToken } = await auth();
  const token = await getToken();

  const apiFormData = new FormData();
  apiFormData.append("file", file);
  apiFormData.append("target_width", targetWidth);

  try {
    const response = await fetch(`${baseUrl}/upscale`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: apiFormData,
    });
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `Upscale Failed: ${response.status} ${response.statusText}`;
      if (contentType && contentType.includes("application/json")) {
        const errorJson = await response.json();
        if (errorJson.error) errorMessage = errorJson.error;
      }
      throw new Error(errorMessage);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = response.headers.get("content-type") || "image/png";
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      success: true,
      imageUrl: dataUrl,
    };
  } catch (error: unknown) {
    console.error("Upscale Action Failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upscale image";
    throw new Error(errorMessage);
  }
}
