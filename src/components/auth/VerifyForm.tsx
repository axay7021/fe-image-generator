'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

interface VerifyFormProps {
  email: string;
  code: string;
  setCode: (code: string) => void;
  handleVerify: (e: React.FormEvent) => void;
  handleResend: () => void;
  isLoading: boolean;
  onBack: () => void;
  timeLeft: number;
  canResend: boolean;
}

export function VerifyForm({
  email,
  code,
  setCode,
  handleVerify,
  handleResend,
  isLoading,
  onBack,
  timeLeft,
  canResend,
}: VerifyFormProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="lg"
            className="p-0 hover:bg-transparent -ml-2 text-muted-foreground hover:text-foreground"
            onClick={onBack}
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
            Resend Code{' '}
            {timeLeft > 0 &&
              `in (${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
