"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createCheckoutSession } from "@/actions/checkout";
import { getUserSubscription } from "@/actions/subscription";

export interface PricingFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string; // Add ID
  name: string;
  subtitle: string;
  price: string;
  action: string;
  variant: "free" | "pro";
  features: PricingFeature[];
}

interface PricingSectionProps {
  plans: PricingPlan[];
}

export function PricingSection({ plans }: PricingSectionProps) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDataStr = localStorage.getItem("user_data");
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          let currentToken = null;
          if (userData.tokens?.access_token) {
            currentToken = userData.tokens.access_token;
            setToken(userData.tokens.access_token);
          } else if (userData.token) {
            currentToken = userData.token;
            setToken(userData.token);
          }
          if (userData.user) {
            setUser(userData.user);
          } else if (userData.id) {
            setUser(userData);
          }

          // Fetch subscription if we have a token
          if (currentToken) {
            getUserSubscription(currentToken).then((res) => {
              console.log({ res });
              if (res.success && res.data && res.data.status === "active") {
                // Match the API plan ID with our plans prop
                // The API returns data.plan.id
                setActivePlanId(res.data.plan.id);
              }
            });
          }
        } catch (error) {
          console.error("Failed to parse user_data:", error);
        }
      }
    }
  }, []);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.variant === "free") {
      return;
    }

    // If this is the active plan, do nothing or redirect to dashboard
    if (plan.id === activePlanId) {
      // Optional: toast.info("You are already subscribed to this plan");
      return;
    }

    if (!user || !token) {
      toast.error("Please sign in to purchase a plan");
      router.push("/login");
      return;
    }

    try {
      const result = await createCheckoutSession(plan.id, token);
      console.log(result);
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.error(result.message || "Failed to initiate checkout");
      }
    } catch (error) {
      console.error("Checkout exception:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#538CE8]">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Start with our free tier and
            upgrade as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-[32px] p-8 border hover:shadow-xl transition-all duration-300 relative",
                plan.variant === "free"
                  ? "border-blue-100 hover:border-blue-200 bg-white"
                  : "border-purple-100 hover:border-purple-200 ring-1 ring-purple-100 text-white"
              )}
              style={{
                background:
                  plan.variant === "pro"
                    ? "linear-gradient(180deg, #FFFFFF 0%, #F4EEFF 100%)"
                    : undefined,
              }}
            >
              <div className="text-center space-y-4 mb-8">
                <h3
                  className={cn(
                    "text-3xl font-bold",
                    plan.variant === "free"
                      ? "text-[#538CE8]"
                      : "text-[#7C3AED]"
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    "text-sm h-10 flex items-center justify-center text-[#606060]"
                  )}
                >
                  {plan.subtitle}
                </p>
                <div className="text-3xl font-bold text-gray-900">
                  {plan.price}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={plan.id === activePlanId}
                  className={cn(
                    "w-full h-12 rounded-xl text-base font-semibold shadow-none transition-transform hover:scale-[1.02]",
                    plan.variant === "free"
                      ? "bg-[#538CE8] hover:bg-[#538CE8]/90 text-white"
                      : "bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white",
                    plan.id === activePlanId && "opacity-80 cursor-default"
                  )}
                >
                  {plan.id === activePlanId ? "Current Plan" : plan.action}
                </Button>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div
                      className={cn(
                        "shrink-0",

                        feature.included
                          ? "text-green-500"
                          : "text-red-400 opacity-50"
                      )}
                    >
                      {feature.included ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        feature.included
                          ? "text-gray-700"
                          : "text-[#606060] line-through"
                      )}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
