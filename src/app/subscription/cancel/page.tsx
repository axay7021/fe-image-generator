"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowRight, Home, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function CancelContent() {
  const router = useRouter();

  return (
    <div className="max-w-md w-full text-center space-y-8">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-red-600">
            Payment Cancelled
          </h1>
          <p className="text-lg text-muted-foreground">
            It seems you&apos;ve cancelled the checkout process. No charges were
            made.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <p className="text-sm text-gray-500">
            If you encountered any issues or changed your mind, you can try
            again anytime.
          </p>

          <Button
            onClick={() => router.push("/#plans")}
            className="w-full h-12 text-base bg-[#538CE8] hover:bg-[#538CE8]/90 text-white rounded-xl"
          >
            Try Again
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          }
        >
          <CancelContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
