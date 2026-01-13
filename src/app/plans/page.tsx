import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingSection, PricingPlan } from "@/components/home/PricingSection";

export const dynamic = "force-dynamic";

interface ApiPlan {
  id: string;
  name: string;
  price_usd: number;
  image_quota: number;
  stripe_price_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const defaultFeatures = {
  free: [
    { name: "1 Generative / Month", included: true },
    { name: "Basic Image Generation", included: true },
    { name: "jpg, png", included: true },
    { name: "Passport photo", included: false },
    { name: "Full prompt edit", included: false },
    { name: "Change background", included: false },
    { name: "Remove object", included: false },
  ],
  pro: [
    { name: "15 Generative", included: true },
    { name: "Watermark free", included: true },
    { name: "jpg, png", included: true },
    { name: "Passport photo", included: true },
    { name: "Full prompt edit", included: true },
    { name: "Change background", included: true },
    { name: "Remove object", included: true },
  ],
};

async function getPlans(): Promise<PricingPlan[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is not set");
      return [];
    }

    const res = await fetch(`${baseUrl}/plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      next: { revalidate: 0 }, // Ensure fresh data
    });
    console.log({ res });
    if (!res.ok) {
      console.error("Failed to fetch plans:", res.statusText);
      return [];
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      return [];
    }

    const apiPlans: ApiPlan[] = json.data;
    console.log({ apiPlans });
    return apiPlans
      .map((plan) => {
        const isFree = plan.name.toUpperCase().includes("FREE");
        const variant = (isFree ? "free" : "pro") as "free" | "pro";
        const subtitle = isFree
          ? "For personal use only with limited features and support"
          : "For teams and organizations with advanced features and support";

        // Convert to Title Case (e.g., "BASIC PLAN" -> "Basic Plan")
        const displayName = plan.name
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const action = isFree ? "No Need to Sign in for Free" : "Get Started";

        let priceDisplay = "";
        if (isFree) {
          priceDisplay = `${plan.image_quota} Image Free`;
        } else {
          priceDisplay = `$${plan.price_usd} / Month`;
        }

        // Merge quotas into features if needed
        // For now, using static features but we could update the "Generative / Month" line
        const features = defaultFeatures[variant].map((f) => {
          if (f.name.includes("Generative")) {
            return {
              ...f,
              name: `${plan.image_quota} Generative${isFree ? " / Month" : ""}`,
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
        };
      })
      .sort((a, b) => (a.variant === "free" ? -1 : 1)); // Ensure Free comes first
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <div className="relative z-10">
        <Header />
        <main>
          <PricingSection plans={plans} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
