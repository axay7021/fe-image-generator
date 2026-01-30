"use client";

import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If signed in, show loader while redirecting (or nothing)
  // to avoid flashing the login form
  if (isSignedIn) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#f8fafc] min-[531px]:bg-background">
      {/* Mobile Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] min-[531px]:hidden z-0">
        <Image
          src="/auth-bg.png"
          alt="Background"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center p-10 bg-muted/30 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/sidebg1.png')" }}
        />
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="relative z-10 w-full max-w-md h-[415px]">
            <Image
              src="/auth-side.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative z-10 max-w-md text-center space-y-2 text-white">
            <h2 className="text-[40px] font-bold tracking-tight">
              Unleash Your Creativity
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of creators using our AI tools to transform their
              photos instantly.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-end min-[531px]:items-center justify-center relative z-10 w-full">
        <div className="w-full max-w-[576px] bg-white min-[531px]:bg-transparent rounded-t-[32px] min-[531px]:rounded-none px-4 pt-10 pb-8 mt-40 min-[531px]:mt-0 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),10px_10px_30px_4px_rgba(45,78,255,0.15)] min-[531px]:shadow-none min-h-[calc(100vh-160px)] min-[531px]:min-h-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
