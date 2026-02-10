'use client';

import { useAuth } from '@/context/auth-context';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/actions/checkout';
import { PricingPlan } from '@/util/types';
import { useSubscription } from '@/hooks/use-subscription';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchPlans } from '@/queries/plans';

export function PricingSection() {
  // Fetch plans from cache (hydrated from server)
  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
    initialData: [],
    staleTime: 60 * 1000,
  });

  const { user, getToken } = useAuth();
  const {
    subscription: subscriptionData,
    billingHistory,
    isLoading: isCheckingSubscription,
    isHistoryLoading: isLoadingHistory,
    activePlanId,
  } = useSubscription();

  /* 
     Derived State Logic to avoid useEffect setState anti-patterns
  */

  // 1. View Mode Logic
  // We track if the user has manually selected a view mode.
  // If not, we fallback to an automatic mode based on subscription status.
  const [manualViewMode, setManualViewMode] = useState<'usage' | 'plans' | null>(null);

  // Computed default based on data availability
  const autoViewMode = activePlanId || billingHistory.length > 0 ? 'usage' : 'plans';

  // Final effective view mode: manual override takes precedence, otherwise auto
  const viewMode = manualViewMode ?? autoViewMode;

  // Helper to update mode manually (used by buttons)
  const setViewMode = (mode: 'usage' | 'plans') => setManualViewMode(mode);

  // 2. Selected Plan Logic
  // Similar approach: Manual selection overrides default calculated plan
  const [manualSelectedPlanId, setManualSelectedPlanId] = useState<string | null>(null);

  // Calculate default plan (Popular or First)
  // We use the first plan as fallback if no popular plan is found
  const defaultPlanId = plans.length > 0 ? plans.find((p) => p.is_popular)?.id || plans[0].id : '';

  const selectedPlanId = manualSelectedPlanId || defaultPlanId;

  // Helper to update selected plan
  const setSelectedPlanId = (id: string) => setManualSelectedPlanId(id);

  const router = useRouter();

  const { mutate: subscribe, isPending: isRedirecting } = useMutation({
    mutationFn: async (planId: string) => {
      return await createCheckoutSession(planId);
    },
    onSuccess: (result) => {
      if (result.success && result.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.error(result.message || 'Failed to initiate checkout');
      }
    },
    onError: (error) => {
      console.error('Checkout exception:', error);
      toast.error('Something went wrong');
    },
  });

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.variant === 'free') {
      return;
    }

    const token = await getToken();

    if (!user || !token) {
      toast.error('Please sign in to purchase a plan');
      router.push('/login');
      return;
    }

    subscribe(plan.id);
  };

  // Ensure we sort plans by price or a specific order
  const displayPlans = plans.sort((a, b) => {
    // Basic sorting by price string if it contains numbers, simple heuristic
    const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
    const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
    return priceA - priceB;
  });

  // Calculate generic progress stats
  const quotaUsed = subscriptionData?.quota_used || 0;
  const totalQuota = subscriptionData?.image_generation_limit || 1; // Avoid divide by zero
  const percentage = Math.min(Math.round((quotaUsed / totalQuota) * 100), 100);

  // Determine colors based on usage
  let progressColor = 'bg-primary';
  let showLowCreditWarning = false;
  let showEmptyCreditError = false;

  if (percentage >= 100) {
    progressColor = 'bg-red-500';
    showEmptyCreditError = true;
  } else if (percentage >= 80) {
    progressColor = 'bg-orange-500';
    showLowCreditWarning = true;
  }

  return (
    <section id="plans" className="py-18 md:py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center space-y-2 md:mb-8">
          {isCheckingSubscription ? (
            <div className="space-y-4 flex flex-col items-center">
              <Skeleton className="h-12 w-3/4 md:w-1/2 rounded-lg" />
              <Skeleton className="h-6 w-2/3 md:w-1/3 rounded-lg" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#538ce8]">
                {viewMode === 'usage' ? 'Your Plans' : 'Choose Your Perfect Plan'}
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto md:mb-auto mb-4">
                Generate professional-grade AI images instantly. Choose a flexible plan that fits
                your creative workflow and start building today.
              </p>
            </>
          )}
        </div>

        {/* Top Right Actions */}
        {(activePlanId || billingHistory.length > 0) && !isCheckingSubscription && (
          <div className="flex justify-end max-w-7xl mx-auto mb-8">
            {viewMode === 'usage' ? (
              <Button onClick={() => setViewMode('plans')} className="rounded-xl">
                Buy More Credits
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setViewMode('usage')} className="rounded-xl">
                Back to Dashboard
              </Button>
            )}
          </div>
        )}

        {isCheckingSubscription ? (
          <div className="w-full">
            {/* Unified Skeleton (Matches loading.tsx) */}
            <div className="max-w-4xl mx-auto space-y-8 mt-8">
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
          </div>
        ) : (
          <>
            {/* Usage Dashboard View */}
            {viewMode === 'usage' && (
              <>
                {subscriptionData ? (
                  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <Card className="rounded-3xl shadow-xl border-blue-100 overflow-hidden">
                      <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <CardTitle className="text-2xl text-slate-900">
                              {subscriptionData.plan.name}
                            </CardTitle>
                            {subscriptionData.status !== 'active' && (
                              <span
                                className={cn(
                                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ml-2',
                                  subscriptionData.status === 'quota_exhausted'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-red-100 text-red-800',
                                )}
                              >
                                {subscriptionData.status.replace(/_/g, ' ')}
                              </span>
                            )}
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
                                  ? 'text-red-600'
                                  : showLowCreditWarning
                                    ? 'text-orange-600'
                                    : 'text-primary',
                              )}
                            >
                              {percentage}% Used
                            </span>
                          </div>
                          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all duration-500 ease-out rounded-full',
                                progressColor,
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          {showLowCreditWarning && !showEmptyCreditError && (
                            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-3 rounded-xl">
                              <AlertTriangle className="w-5 h-5 shrink-0" />
                              <p className="text-sm font-medium">
                                Your credits are running low. Consider upgrading or waiorting for
                                the next cycle.
                              </p>
                            </div>
                          )}
                          {showEmptyCreditError && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                              <AlertTriangle className="w-5 h-5 shrink-0" />
                              <p className="text-sm font-medium">
                                You have used all your credits. Please buy more to contotinue
                                generating images.
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <Card className="rounded-3xl shadow-xl border-gray-100 overflow-hidden bg-gray-50">
                      <CardContent className="p-8 text-center space-y-4">
                        <p className="text-lg text-muted-foreground">No active plan found.</p>
                        <Button
                          onClick={() => setViewMode('plans')}
                          variant="outline"
                          className="rounded-xl"
                        >
                          View Available Plans
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}

            {/* Plans Grid View (Desktop) */}
            {viewMode === 'plans' && (
              <>
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start animate-in fade-in slide-in-from-bottom-8 duration-500">
                  {displayPlans.map((plan) => {
                    // Highlight "Plush" or middle plan as popular if nothing active
                    const isPopular = plan.is_popular;
                    const isBasicFree = !user && plan.name.toLowerCase().includes('basic');
                    const isHighlighted = isPopular || isBasicFree;

                    // Determine styling based on highlight type
                    const highlightColor = isPopular ? 'bg-[#538CE8]' : 'bg-green-500';
                    const highlightShadow = isPopular
                      ? 'shadow-[#538CE8]/20'
                      : 'shadow-green-500/20';

                    return (
                      <div
                        key={plan.id}
                        className={cn(
                          'relative w-full rounded-3xl transition-all duration-300 flex flex-col',
                          isHighlighted
                            ? `shadow-2xl ${highlightColor} z-10 pt-10 px-[3px] pb-[3px]`
                            : 'bg-white shadow-xl border border-blue-200 hover:scale-[1.02] hover:shadow-blue-500/20 p-8 mt-9',
                        )}
                      >
                        {isHighlighted && (
                          <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center text-white text-sm font-medium">
                            {isPopular
                              ? 'Recommended'
                              : '🎉 First time login user can get basic plan free!'}
                          </div>
                        )}

                        <div
                          className={cn(
                            'flex flex-col flex-1',
                            isHighlighted
                              ? 'bg-linear-to-b from-[#FFFFFF] to-[#E5EFFF] p-8 pt-6 rounded-[22px]'
                              : 'bg-white',
                          )}
                        >
                          {/* Deleted inline Basic Free message as it's now a badge */}

                          <div className="mb-8 space-y-4 text-left">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-2xl font-bold text-slate-900 line-clamp-1"
                                title={plan.name}
                              >
                                {plan.name}
                              </h3>
                              {/* Optional Badge */}
                              {plan.name.toUpperCase().includes('PRO') && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold tracking-wide">
                                  PRO
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-bold text-black">
                                {plan.price.includes('₹') ? plan.price.split(' ')[0] : plan.price}
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
                                      'rounded-full p-1 shrink-0 mt-0.5',
                                      feature.included
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-slate-100 text-slate-400',
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
                                      'text-sm',
                                      feature.included
                                        ? 'text-slate-700 font-medium'
                                        : 'text-slate-400 line-through',
                                    )}
                                  >
                                    {feature.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3 mt-auto">
                            {/* <Button
                              onClick={() => handleSubscribe(plan)}
                              disabled={isCheckingSubscription || isRedirecting}
                              className={cn(
                                'w-full h-12 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md',
                                isPopular
                                  ? 'bg-[#538CE8] hover:bg-[#538CE8]/90 text-white shadow-[#538CE8]/20'
                                  : 'bg-primary hover:opacity-90 text-white shadow-blue-500/20',
                              )}
                            >
                              {isCheckingSubscription || isRedirecting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Checking...
                                </>
                              ) : (
                                plan.action
                              )}
                            </Button> */}

                            <a
                              href={`mailto:kaushik@softcolon.com?subject=Inquiry about ${plan.name}&body=Hi Team,%0D%0A%0D%0AI am interested in the ${plan.name}. Please provide more details about this plan.%0D%0A%0D%0AThanks`}
                              className="block w-full"
                            >
                              <Button
                                className={cn(
                                  'w-full h-12 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md',
                                  isPopular
                                    ? 'bg-[#538CE8] hover:bg-[#538CE8]/90 text-white shadow-[#538CE8]/20'
                                    : isBasicFree
                                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20'
                                      : 'bg-primary hover:opacity-90 text-white shadow-blue-500/20',
                                )}
                              >
                                Contact Sales
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile List View (New Compact Design) */}
                <div className="md:hidden space-y-4 mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                  {displayPlans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const isPopular = plan.is_popular;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={cn(
                          'relative rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer overflow-hidden',
                          isSelected
                            ? 'border-[#538CE8] bg-blue-50/50 shadow-md ring-1 ring-[#538CE8]/20'
                            : 'border-gray-100 bg-white shadow-sm active:scale-[0.98]',
                        )}
                      >
                        {isPopular && (
                          <div className="absolute top-0 right-0 bg-[#538CE8] text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl shadow-sm">
                            Best Value
                          </div>
                        )}
                        {!user && plan.name.toLowerCase().includes('basic') && (
                          <div className="mb-3 bg-green-100/80 text-green-700 text-xs font-semibold px-2 py-1 rounded-lg text-center border border-green-200 w-full">
                            First time login user can get basic plan free!
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          {/* Radio Indicator */}
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                              isSelected
                                ? 'border-[#538CE8] bg-[#538CE8]'
                                : 'border-gray-300 bg-transparent',
                            )}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-3" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                              <span className="font-bold text-lg text-gray-900">
                                {plan.price.includes('₹') ? plan.price.split(' ')[0] : plan.price}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-tight">{plan.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Sticky CTA - Now Static at Bottom */}
                <div className="md:hidden mt-8">
                  {/* <Button
                    onClick={() => {
                      const selectedPlan = plans.find((p) => p.id === selectedPlanId);
                      if (selectedPlan) handleSubscribe(selectedPlan);
                    }}
                    disabled={isCheckingSubscription || !selectedPlanId || isRedirecting}
                    className="w-full h-14 rounded-xl text-lg font-bold bg-[#538CE8] hover:bg-[#538CE8]/90 text-white shadow-lg shadow-blue-500/25"
                  >
                    {isCheckingSubscription || isRedirecting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plans.find((p) => p.id === selectedPlanId)?.action || 'Subscribe'
                    )}
                  </Button> */}

                  {selectedPlanId &&
                    (() => {
                      const plan = plans.find((p) => p.id === selectedPlanId);
                      if (!plan) return null;
                      return (
                        <a
                          href={`mailto:kaushik@softcolon.com?subject=Inquiry about ${plan.name}&body=Hi Team,%0D%0A%0D%0AI am interested in the ${plan.name}. Please provide more details about this plan.%0D%0A%0D%0AThanks`}
                          className="block w-full mt-3"
                        >
                          <Button className="w-full h-14 rounded-xl text-lg font-bold bg-[#538CE8] hover:bg-[#538CE8]/90 text-white shadow-lg shadow-blue-500/25">
                            Contact Sales
                          </Button>
                        </a>
                      );
                    })()}
                </div>
              </>
            )}

            {/* Billing History Section */}
            {viewMode === 'usage' && billingHistory.length > 0 && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 md:mt-24 mt-12 ">
                <Card className="rounded-3xl shadow-lg bg-white/50 backdrop-blur-sm border-blue-100 border">
                  <CardHeader>
                    <CardTitle className="text-2xl">Billing History</CardTitle>
                    <CardDescription>View your recent payments and invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingHistory ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="bg-slate-50 rounded-xl p-4 flex justify-between items-center"
                          >
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-24 rounded" />
                              <Skeleton className="h-4 w-32 rounded" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block rounded-2xl border bg-white border-gray-100 max-h-[200px] overflow-y-auto">
                          <Table>
                            <TableHeader className="bg-slate-50 ">
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
                                    {new Date(historyItem.period_start).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>{historyItem.plan.name}</TableCell>
                                  <TableCell>₹{historyItem.plan.price_usd}</TableCell>
                                  <TableCell>
                                    <span
                                      className={cn(
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                                        historyItem.status === 'active'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-yellow-100 text-yellow-800',
                                      )}
                                    >
                                      {historyItem.status.replace('_', ' ')}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4 max-h-[400px] overflow-y-auto">
                          {billingHistory.map((historyItem) => (
                            <div
                              key={historyItem.id}
                              className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-muted-foreground">Plan</p>
                                  <p className="font-semibold text-lg">{historyItem.plan.name}</p>
                                </div>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                                    historyItem.status === 'active'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-800',
                                  )}
                                >
                                  {historyItem.status.replace('_', ' ')}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Date</p>
                                  <p className="font-medium">
                                    {new Date(historyItem.period_start).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Amount</p>
                                  <p className="font-medium">₹{historyItem.plan.price_usd}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
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
