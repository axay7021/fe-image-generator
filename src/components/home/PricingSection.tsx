"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createCheckoutSession } from "@/actions/checkout";
import { PricingPlan } from "@/util/types";
import { useSubscription } from "@/hooks/use-subscription";

interface PricingSectionProps {
  plans: PricingPlan[];
}

export function PricingSection({ plans }: PricingSectionProps) {
  const { user, getToken } = useAuth();
  const {
    subscription: subscriptionData,
    billingHistory,
    isLoading: isCheckingSubscription,
    isHistoryLoading: isLoadingHistory,
    activePlanId,
  } = useSubscription();

  const [viewMode, setViewMode] = useState<"usage" | "plans">("plans");

  const router = useRouter();

  const [hasInitialized, setHasInitialized] = useState(false);

  // Optimize Skeleton State using LocalStorage hint
  const [skeletonMode, setSkeletonMode] = useState<"usage" | "plans">("plans");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSub = localStorage.getItem("user_has_subscription");
      if (hasSub === "true") {
        setSkeletonMode("usage");
      }
    }
  }, []);

  // Update localStorage when subscription state is confirmed
  useEffect(() => {
    if (!isCheckingSubscription) {
      if (activePlanId) {
        localStorage.setItem("user_has_subscription", "true");
      } else {
        localStorage.setItem("user_has_subscription", "false");
      }
    }
  }, [isCheckingSubscription, activePlanId]);

  // Update viewMode based on subscription status (only once)
  useEffect(() => {
    if (!isCheckingSubscription && !hasInitialized) {
      if (activePlanId) {
        setViewMode("usage");
      } else {
        setViewMode("plans");
      }
      setHasInitialized(true);
    }
  }, [isCheckingSubscription, activePlanId, hasInitialized]);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.variant === "free") {
      return;
    }

    const token = await getToken();

    if (!user || !token) {
      toast.error("Please sign in to purchase a plan");
      router.push("/login");
      return;
    }

    try {
      const result = await createCheckoutSession(plan.id, token);
      console.log(result);
      if (result.success && result.data?.url) {
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = result.data.url;
      } else {
        toast.error(result.message || "Failed to initiate checkout");
      }
    } catch (error) {
      console.error("Checkout exception:", error);
      toast.error("Something went wrong");
    }
  };

  // Ensure we sort plans by price or a specific order
  const displayPlans = plans.sort((a, b) => {
    // Basic sorting by price string if it contains numbers, simple heuristic
    const priceA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
    const priceB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
    return priceA - priceB;
  });

  // Calculate generic progress stats
  const quotaUsed = subscriptionData?.quota_used || 0;
  const totalQuota = subscriptionData?.image_generation_limit || 1; // Avoid divide by zero
  const percentage = Math.min(Math.round((quotaUsed / totalQuota) * 100), 100);

  // Determine colors based on usage
  let progressColor = "bg-primary";
  let showLowCreditWarning = false;
  let showEmptyCreditError = false;

  if (percentage >= 100) {
    progressColor = "bg-red-500";
    showEmptyCreditError = true;
  } else if (percentage >= 80) {
    progressColor = "bg-orange-500";
    showLowCreditWarning = true;
  }

  return (
    <section id="plans" className="py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center space-y-4 mb-8">
          {isCheckingSubscription ? (
            <div className="space-y-4 flex flex-col items-center">
              <Skeleton className="h-12 w-3/4 md:w-1/2 rounded-lg" />
              <Skeleton className="h-6 w-2/3 md:w-1/3 rounded-lg" />
            </div>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#538ce8]">
                {viewMode === "usage"
                  ? "Your Plans"
                  : "Choose Your Perfect Plan"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Generate professional-grade AI images instantly. Choose a
                flexible plan that fits your creative workflow and start
                building today.
              </p>
            </>
          )}
        </div>

        {/* Top Right Actions */}
        {activePlanId && !isCheckingSubscription && (
          <div className="flex justify-end max-w-7xl mx-auto mb-8">
            {viewMode === "usage" ? (
              <Button
                onClick={() => setViewMode("plans")}
                className="rounded-xl"
              >
                Buy More Credits
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setViewMode("usage")}
                className="rounded-xl"
              >
                Back to Dashboard
              </Button>
            )}
          </div>
        )}

        {isCheckingSubscription ? (
          // Skeleton Loading State
          <div className="w-full">
            {skeletonMode === "usage" ? (
              // Usage Skeleton
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="rounded-3xl bg-white shadow-xl border border-gray-100 overflow-hidden p-8 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-48 rounded-lg" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-10 w-32 ml-auto rounded-lg" />
                      <Skeleton className="h-4 w-24 ml-auto rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-32 rounded-lg" />
                      <Skeleton className="h-5 w-16 rounded-lg" />
                    </div>
                    <Skeleton className="h-4 w-full rounded-full" />
                  </div>
                </div>
              </div>
            ) : (
              // Plans Skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative w-full p-8 rounded-3xl bg-white shadow-xl border border-gray-100 flex flex-col space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-1/2 rounded-lg" />
                        <Skeleton className="h-6 w-12 rounded-full" />
                      </div>
                      <Skeleton className="h-10 w-1/3 rounded-lg" />
                      <Skeleton className="h-4 w-3/4 rounded-lg" />
                    </div>
                    <div className="flex-1 space-y-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="flex gap-3">
                          <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                          <Skeleton className="h-4 w-full rounded-lg" />
                        </div>
                      ))}
                    </div>
                    <Skeleton className="w-full h-12 rounded-xl" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Usage Dashboard View */}
            {viewMode === "usage" && subscriptionData && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <Card className="rounded-3xl shadow-xl border-blue-100 overflow-hidden">
                  <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl text-slate-900">
                          {subscriptionData.plan.name}
                        </CardTitle>
                        {/* <CardDescription className="mt-2 text-base">
                          Active until{" "}
                          {new Date(
                            subscriptionData.period_end,
                          ).toLocaleDateString()}
                        </CardDescription> */}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900">
                          {quotaUsed} / {totalQuota}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          Credits Used
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {/* Progress Bar */}
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600">Usage Progress</span>
                        <span
                          className={cn(
                            showEmptyCreditError
                              ? "text-red-600"
                              : showLowCreditWarning
                                ? "text-orange-600"
                                : "text-primary",
                          )}
                        >
                          {percentage}% Used
                        </span>
                      </div>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-500 ease-out rounded-full",
                            progressColor,
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {showLowCreditWarning && !showEmptyCreditError && (
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-3 rounded-xl">
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <p className="text-sm font-medium">
                            Your credits are running low. Consider upgrading or
                            waiting for the next cycle.
                          </p>
                        </div>
                      )}
                      {showEmptyCreditError && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <p className="text-sm font-medium">
                            You have used all your credits. Please buy more to
                            continue generating images.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Plans Grid View */}
            {viewMode === "plans" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                {displayPlans.map((plan) => {
                  // Highlight "Plush" or middle plan as popular if nothing active
                  const isPopular = plan.is_popular;

                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "relative w-full p-8 rounded-3xl transition-all duration-300 flex flex-col border",
                        isPopular
                          ? "bg-white shadow-2xl border-[#558de8] ring-1 ring-[#558de8] hover:scale-[1.02] hover:shadow-[#558de8]/20"
                          : "bg-white shadow-xl border-blue-200 hover:scale-[1.02] hover:shadow-blue-500/20",
                      )}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 right-8 bg-[#558de8] px-4 py-1 text-white rounded-full text-sm font-medium shadow-lg z-20">
                          Most Popular
                        </div>
                      )}

                      <div className="mb-8 space-y-4 text-left">
                        <div className="flex items-center justify-between">
                          <h3
                            className="text-2xl font-bold text-slate-900 line-clamp-1"
                            title={plan.name}
                          >
                            {plan.name}
                          </h3>
                          {/* Optional Badge */}
                          {plan.name.toUpperCase().includes("PRO") && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold tracking-wide">
                              PRO
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-black">
                            {plan.price.includes("$")
                              ? plan.price.split(" ")[0]
                              : plan.price}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed h-10">
                          {plan.subtitle}
                        </p>
                      </div>

                      <div className="flex-1 mb-8">
                        <ul className="space-y-4 px-1">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "rounded-full p-1 shrink-0 mt-0.5",
                                  feature.included
                                    ? "bg-green-100 text-green-600"
                                    : "bg-slate-100 text-slate-400",
                                )}
                              >
                                {feature.included ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <X className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  "text-sm",
                                  feature.included
                                    ? "text-slate-700 font-medium"
                                    : "text-slate-400 line-through",
                                )}
                              >
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3 mt-auto">
                        <Button
                          onClick={() => handleSubscribe(plan)}
                          disabled={isCheckingSubscription}
                          className={cn(
                            "w-full h-12 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md",
                            "bg-primary hover:opacity-90 text-white shadow-blue-500/20",
                          )}
                        >
                          {isCheckingSubscription ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            plan.action
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Billing History Section */}
            {viewMode === "usage" && billingHistory.length > 0 && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 mt-24">
                <Card className="rounded-3xl shadow-lg border-none bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl">Billing History</CardTitle>
                    <CardDescription>
                      View your recent payments and invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingHistory ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="rounded-2xl border overflow-hidden bg-white">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead>Purchased Date</TableHead>
                              <TableHead>Plan</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {billingHistory.map((historyItem) => (
                              <TableRow
                                key={historyItem.id}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <TableCell className="font-medium">
                                  {new Date(
                                    historyItem.period_start,
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{historyItem.plan.name}</TableCell>
                                <TableCell>
                                  ${historyItem.plan.price_usd}
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={cn(
                                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                      historyItem.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-800",
                                    )}
                                  >
                                    {historyItem.status.replace("_", " ")}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
