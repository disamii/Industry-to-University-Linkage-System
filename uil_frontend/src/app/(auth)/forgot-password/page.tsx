"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UIL_CONTACT_INFO } from "@/lib/constants";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="space-y-10 w-full max-w-md">
        {/* Logo & Header Section */}
        <div className="flex flex-col items-center text-center">
          <Logo hasLabel={true} />

          <h1 className="font-bold text-3xl md:text-4xl tracking-tighter">
            {isSent ? "Check your email" : "Reset password"}
          </h1>
          <p className="mx-auto mt-3 max-w-70 text-muted-foreground text-sm">
            {isSent
              ? "We've sent a recovery link to your professional email address."
              : "Enter your email and we'll send you instructions to reset your account."}
          </p>
        </div>

        {/* Content Card */}
        <Card className="bg-card/50 shadow-none backdrop-blur-sm border-border rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="email"
                    className="font-bold text-muted-foreground text-xs uppercase tracking-widest"
                  >
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@organization.com"
                    required
                    className="bg-background border-border rounded-xl focus-visible:ring-primary/20 h-12 transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  className="hover:bg-primary/90 rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send Instructions
                      <Send className="ml-2 w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="bg-emerald-500/10 mb-6 p-4 rounded-full">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <p className="font-medium text-muted-foreground text-xs leading-relaxed">
                  Didn&apos;t receive the email? Check your spam folder or
                  <button
                    onClick={() => setIsSent(false)}
                    className="ml-1 font-bold text-primary hover:underline"
                  >
                    try another address.
                  </button>
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col bg-muted/20 p-6 lg:p-8 border-border border-t">
            <Link
              href="/signin"
              className="group flex justify-center items-center gap-2 hover:opacity-80 font-bold text-[11px] text-primary uppercase tracking-widest transition-opacity"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>

        {/* Footer Support Note */}
        <p className="px-8 font-medium text-[10px] text-muted-foreground text-center uppercase leading-loose tracking-widest">
          Having trouble? Contact{" "}
          <a
            href={UIL_CONTACT_INFO.email.href}
            className="text-foreground hover:text-primary decoration-border underline underline-offset-4 transition-colors"
          >
            {UIL_CONTACT_INFO.email.value}
          </a>
        </p>
      </div>
    </div>
  );
}
