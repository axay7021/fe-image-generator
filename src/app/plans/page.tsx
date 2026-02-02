import { Header } from '@/components/layout/Header';
import { PricingSection } from '@/components/home/PricingSection';
import { getQueryClient } from '@/lib/get-query-client';
import { fetchPlans } from '@/queries/plans';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  });

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <div className="relative z-10">
        <Header />
        <main>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <PricingSection />
          </HydrationBoundary>
        </main>
      </div>
    </div>
  );
}
