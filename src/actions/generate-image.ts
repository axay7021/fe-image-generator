"use server";

export async function generateImageAction(formData: FormData) {
  const type = formData.get("type") as string;
  const prompt = formData.get("prompt") as string;
  const image = formData.get("image") as File;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error("API Base URL is not configured");
  }

  let endpointAction = "";
  switch (type) {
    case "linkedin-profile":
      endpointAction = "linkedin-profile";
      break;
    case "passport":
      endpointAction = "passport-size";
      break;
    case "background":
      endpointAction = "change-bg";
      break;
    case "remove":
      endpointAction = "remove-object";
      break;
    case "prompt":
      endpointAction = "custom-edit";
      break;
    default:
      throw new Error("Invalid transformation type");
  }

  const apiFormData = new FormData();
  apiFormData.append("file", image);

  // Map prompt to extra_context as per script
  if (prompt) {
    apiFormData.append("extra_context", prompt);
  }

  // Handle LinkedIn Profile
  if (type === "linkedin-profile") {
    const style = formData.get("style") as string;
    if (style) apiFormData.append("style", style);
  }

  // Handle Passport Specifics
  if (type === "passport") {
    const passportMode = formData.get("passport_mode") as string;
    apiFormData.append("passport_mode", passportMode || "standard");

    if (passportMode === "suit") {
      const suitColor = formData.get("suit_color") as string;
      const tieColor = formData.get("tie_color") as string;
      if (suitColor) apiFormData.append("suit_color", suitColor);
      if (tieColor) apiFormData.append("tie_color", tieColor);
    }
  }

  const token = formData.get("token") as string;

  try {
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/modify-image/${endpointAction}`, {
      method: "POST",
      headers: headers,
      body: apiFormData,
    });
    if (!response.ok) {
      // Try to parse error json if possible
      const contentType = response.headers.get("content-type");
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorJson = await response.json();
          if (errorJson.error) {
            if (typeof errorJson.error === "string") {
              errorMessage = errorJson.error;
            } else if (typeof errorJson.error === "object") {
              errorMessage =
                errorJson.error.message ||
                errorJson.error.detail ||
                JSON.stringify(errorJson.error);
            }
          } else if (errorJson.message) {
            errorMessage = errorJson.message;
          } else if (errorJson.detail) {
            errorMessage = errorJson.detail;
          }
        } catch (e) {
          console.error("Failed to parse error JSON:", e);
        }
      }

      if (response.status === 429) {
        errorMessage = "Daily limit reached. Please try again tomorrow.";
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
    console.error("Generate Image Action Failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate image";
    throw new Error(errorMessage);
  }
}
