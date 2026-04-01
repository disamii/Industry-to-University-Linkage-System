"use client";

import Logo from "@/components/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPending, setShowPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowPending(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="space-y-10 w-full max-w-100">
        {/* Logo & Header Section - Consistent with landing page */}
        <div className="flex flex-col items-center text-center">
          <Logo hasLabel={true} />

          <h1 className="font-bold text-3xl md:text-4xl tracking-tighter">
            Welcome back
          </h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Please enter your professional credentials
          </p>
        </div>

        {/* Auth Card - No Shadows, Clean Borders */}
        <Card className="bg-card/50 shadow-none backdrop-blur-sm border-border rounded-[2rem] overflow-hidden">
          {showPending && (
            <div className="p-6 pb-0">
              <Alert
                variant="destructive"
                className="bg-amber-500/5 border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-500"
              >
                <AlertCircle className="w-4 h-4" />
                <AlertTitle className="font-bold text-xs uppercase tracking-widest">
                  Pending Approval
                </AlertTitle>
                <AlertDescription className="text-[11px] leading-relaxed">
                  Our administrators are currently reviewing your access
                  request.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label
                  htmlFor="email"
                  className="font-bold text-muted-foreground text-xs uppercase tracking-widest"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@organization.com"
                  required
                  className="bg-background border-border rounded-xl focus-visible:ring-primary/20 h-12 transition-all"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="font-bold text-muted-foreground text-xs uppercase tracking-widest"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="hover:opacity-80 font-bold text-[11px] text-primary uppercase tracking-wider transition-opacity"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col bg-muted/20 p-6 lg:p-8 border-border border-t">
            <p className="font-medium text-muted-foreground text-xs text-center">
              New to the platform?{" "}
              <Link
                href="/signup"
                className="font-bold text-primary hover:underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer Legal - Consistent with Footer section */}
        <p className="px-8 font-medium text-[10px] text-muted-foreground text-center uppercase leading-loose tracking-widest">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="text-foreground hover:text-primary decoration-border underline underline-offset-4 transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-foreground hover:text-primary decoration-border underline underline-offset-4 transition-colors"
          >
            Privacy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
