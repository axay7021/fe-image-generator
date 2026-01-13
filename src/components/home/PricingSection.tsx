"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createCheckoutSession } from "@/actions/checkout";
import {
  getUserSubscription,
  getUserBillingHistory,
  cancelSubscription,
  BillingHistoryItem,
} from "@/actions/subscription";

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
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    []
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
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
            // Check active subscription
            getUserSubscription(currentToken).then((res) => {
              console.log({ res });
              if (res.success && res.data && res.data.status === "active") {
                setActivePlanId(res.data.plan.id);
              }
            });

            // Fetch billing history
            setIsLoadingHistory(true);
            getUserBillingHistory(currentToken).then((res) => {
              if (res.success) {
                setBillingHistory(res.data);
              }
              setIsLoadingHistory(false);
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

  const handleCancelSubscription = async () => {
    if (!token) return;

    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    setIsCancelling(true);
    try {
      const result = await cancelSubscription(token);
      if (result.success) {
        toast.success("Subscription cancelled successfully");
        setActivePlanId(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel subscription");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling");
    } finally {
      setIsCancelling(false);
    }
  };

  // Ensure we sort plans by price or a specific order
  const displayPlans = plans.sort((a, b) => {
    // Basic sorting by price string if it contains numbers, simple heuristic
    const priceA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
    const priceB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
    return priceA - priceB;
  });

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#538ce8]">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the best option for your creative needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayPlans.map((plan) => {
            const isActive = plan.id === activePlanId;
            // Highlight "Plush" or middle plan as popular if nothing active
            const isPopular =
              !activePlanId &&
              (plan.name.toUpperCase().includes("PLUSH") ||
                plan.name.toUpperCase().includes("POPULAR") ||
                (displayPlans.length === 3 && plan === displayPlans[1]));

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative w-full p-8 rounded-3xl transition-all duration-300 flex flex-col border",
                  isActive
                    ? "bg-green-50/50 border-green-500 shadow-xl ring-1 ring-green-500"
                    : isPopular
                    ? "bg-white shadow-2xl border-[#558de8] ring-1 ring-[#558de8] hover:scale-[1.02] hover:shadow-[#558de8]/20"
                    : "bg-white shadow-xl border-blue-200 hover:scale-[1.02] hover:shadow-blue-500/20"
                )}
              >
                {isActive && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg z-20">
                    Active Plan
                  </div>
                )}
                {!isActive && isPopular && (
                  <div className="absolute -top-4 right-8 bg-gradient-to from-[#558de8] to-[#558de8] text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg z-20">
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
                    {/* {plan.price.includes("$") && (
                      <span className="text-muted-foreground font-medium">
                        /month
                      </span>
                    )} */}
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
                              : "bg-slate-100 text-slate-400"
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
                              : "text-slate-400 line-through"
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
                    disabled={isActive}
                    className={cn(
                      "w-full h-12 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md",
                      isActive
                        ? "bg-green-600 hover:bg-green-700 text-white cursor-default"
                        : "bg-primary hover:opacity-90 text-white shadow-blue-500/20"
                    )}
                  >
                    {isActive ? "Current Plan" : plan.action}
                  </Button>

                  {isActive && (
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                      className="w-full h-12 rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Subscription"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Billing History Section */}
        {token && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 mt-24">
            <Card className="border-none shadow-lg">
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
                ) : billingHistory.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Invoice</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billingHistory.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>
                              {new Date(invoice.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {invoice.currency.toUpperCase()}{" "}
                              {(invoice.amount / 100).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                  invoice.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                )}
                              >
                                {invoice.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {invoice.invoice_pdf ? (
                                <a
                                  href={invoice.invoice_pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <Download className="mr-1 h-4 w-4" />
                                  PDF
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  -
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No billing history found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
