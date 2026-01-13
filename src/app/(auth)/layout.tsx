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
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:relative lg:flex flex-col justify-center items-center p-10 bg-muted/30 ">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/sidebg1.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
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
      <div className="flex items-center justify-center bg-background">
        <div className="w-full max-w-[576px]">{children}</div>
      </div>
    </div>
  );
}
