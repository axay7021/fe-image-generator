import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <div className="relative z-10">
        <Header />
        <main>
          <section className="py-24 relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
              <div className="text-center space-y-4 mb-8">
                <div className="space-y-4 flex flex-col items-center">
                  <Skeleton className="h-12 w-3/4 md:w-1/2 rounded-lg" />
                  <Skeleton className="h-6 w-2/3 md:w-1/3 rounded-lg" />
                </div>
              </div>

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
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
