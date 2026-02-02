'use client';

import { useSignIn } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VerifyForm } from '@/components/auth/VerifyForm';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [emailAddressId, setEmailAddressId] = useState('');
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);

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

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      toast.error(error.errors?.[0]?.message || 'Something went wrong failed to login');
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
        (factor) => factor.strategy === 'email_code',
      );

      if (isEmailCodeFactor && 'emailAddressId' in isEmailCodeFactor) {
        // 3. Prepare verification
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: isEmailCodeFactor.emailAddressId,
        });

        setEmailAddressId(isEmailCodeFactor.emailAddressId);
        setVerifying(true);
        setTimeLeft(30); // Start with 30s
        setCanResend(false);
        setResendCount(0); // Reset resend count
        toast.success('Verification code sent to your email');
      } else {
        toast.error('Email code login not supported for this account.');
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.errors?.[0]?.message || 'Something went wrong');
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
        strategy: 'email_code',
        code,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/');
        toast.success('Welcome back!');
      } else {
        console.error(JSON.stringify(result, null, 2));
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      console.error(JSON.stringify(err, null, 2));
      toast.error(error.errors?.[0]?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !emailAddressId) return;
    setIsLoading(true);
    try {
      await signIn.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: emailAddressId,
      });

      const nextCount = resendCount + 1;
      setResendCount(nextCount);

      // Progressive timer logic: 30s -> 120s -> 300s
      let nextTime = 30; // Default fallback
      if (nextCount === 1)
        nextTime = 120; // 2 min
      else if (nextCount >= 2) nextTime = 300; // 5 min

      setTimeLeft(nextTime);
      setCanResend(false);

      toast.success('Verification code sent again');
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      toast.error(error.errors?.[0]?.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  // if (verifying) {
  //   return (
  //     <VerifyForm
  //       email={email}
  //       code={code}
  //       setCode={setCode}
  //       handleVerify={handleVerify}
  //       handleResend={handleResend}
  //       isLoading={isLoading}
  //       onBack={() => setVerifying(false)}
  //       timeLeft={timeLeft}
  //       canResend={canResend}
  //     />
  //   );
  // }

  return (
    <>
      {verifying ? (
        <VerifyForm
          email={email}
          code={code}
          setCode={setCode}
          handleVerify={handleVerify}
          handleResend={handleResend}
          isLoading={isLoading}
          onBack={() => setVerifying(false)}
          timeLeft={timeLeft}
          canResend={canResend}
        />
      ) : (
        <LoginForm
          email={email}
          setEmail={setEmail}
          handleEmailLogin={handleEmailLogin}
          handleGoogleLogin={handleGoogleLogin}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
