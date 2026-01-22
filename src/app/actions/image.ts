"use server";

export async function validateImage(formData: FormData) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is not set");
      return { success: false, message: "Configuration error" };
    }

    const response = await fetch(`${baseUrl}/validate-image`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Validation error:", error);
    return { success: false, message: "Validation failed" };
  }
}
