"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [emailAddressId, setEmailAddressId] = useState("");
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verifying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [verifying, timeLeft]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      toast.error(
        error.errors?.[0]?.message || "Something went wrong failed to login",
      );
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      // 1. Initiate sign-in with email
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      // 2. Find the email code strategy
      const isEmailCodeFactor = supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code",
      );

      if (isEmailCodeFactor && "emailAddressId" in isEmailCodeFactor) {
        // 3. Prepare verification
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: isEmailCodeFactor.emailAddressId,
        });

        setEmailAddressId(isEmailCodeFactor.emailAddressId);
        setVerifying(true);
        setTimeLeft(120);
        setCanResend(false);
        toast.success("Verification code sent to your email");
      } else {
        toast.error("Email code login not supported for this account.");
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.errors?.[0]?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
        toast.success("Welcome back!");
      } else {
        console.error(JSON.stringify(result, null, 2));
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      console.error(JSON.stringify(err, null, 2));
      toast.error(error.errors?.[0]?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !emailAddressId) return;
    setIsLoading(true);
    try {
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailAddressId,
      });
      setTimeLeft(120);
      setCanResend(false);
      toast.success("Verification code sent again");
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      toast.error(error.errors?.[0]?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  if (verifying) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="lg"
              className="p-0 hover:bg-transparent -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setVerifying(false)}
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
          </div>
          <CardTitle className="md:text-4xl text-2xl font-bold tracking-tight">
            Verify your email
          </CardTitle>
          <CardDescription className="md:text-xl text-base">
            Enter the verification code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleVerify} className="grid gap-4 md:gap-6">
            <div className="grid gap-2">
              <Label htmlFor="code" className="text-base md:text-lg">
                Verification Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="md:p-6 p-4 rounded-lg shadow-none border-gray-300"
              />
            </div>
            <div className="grid gap-2">
              <Button
                className="w-full text-base md:text-lg md:p-6 p-4 rounded-lg"
                type="submit"
                disabled={isLoading || !code}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
              </Button>
            </div>
          </form>
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:text-primary p-0"
              onClick={handleResend}
              type="button"
              disabled={isLoading || !canResend}
            >
              Resend Code{" "}
              {timeLeft > 0 &&
                `in (${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")})`}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="md:text-4xl text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="md:text-xl text-base">
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleEmailLogin} className="grid gap-4 md:gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-base md:text-lg">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="md:p-6 p-4 rounded-lg shadow-none border-gray-300"
            />
          </div>
          <div className="grid gap-2">
            <Button
              className="w-full text-lg md:p-6 p-4 rounded-lg"
              type="submit"
              disabled={isLoading || !email || !emailRegex.test(email)}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Email
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center md:text-base text-sm uppercase">
              <span className="bg-card px-2 text-[#667085]">
                Or continue with email
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 ">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              type="button"
              className="md:p-6 p-4 text-base md:text-lg border-gray-300 shadow-none rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
                className="h-6! w-6!"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Sign in with Google
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center md:text-lg text-base text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary text-black font-semibold"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
