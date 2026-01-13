"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // In a real app, you might want to call the backend to verify the session
    // For now, we'll just simulate a verification delay
    const timer = setTimeout(() => {
      setIsValidating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="max-w-md w-full text-center space-y-8">
      {isValidating ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-[#538CE8] animate-spin" />
          <p className="text-lg text-muted-foreground">
            Verifying your payment...
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Payment Successful!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your plan has been upgraded
              successfully.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full h-12 text-base bg-[#538CE8] hover:bg-[#538CE8]/90 text-white rounded-xl"
            >
              Start Generating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/pricing")}
              className="w-full"
            >
              View Plans
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
