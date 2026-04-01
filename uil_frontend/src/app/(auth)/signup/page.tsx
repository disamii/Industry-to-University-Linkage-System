"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Step = 1 | 2 | 3 | 4 | 5;

export default function SignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<"industry" | "staff" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Total steps change based on role: Staff only needs Role (1) and Account (2)
  const totalSteps = role === "staff" ? 2 : 4;

  const nextStep = () => {
    // Logic for Staff finishing after Step 2
    if (role === "staff" && step === 2) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(5);
      }, 1500);
    }
    // Logic for Industry finishing after Step 4
    else if (step === 4) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(5);
      }, 1500);
    } else {
      setStep((s) => (s + 1) as Step);
    }
  };

  const prevStep = () => setStep((s) => (s - 1) as Step);
  const progress = step === 5 ? 100 : (step / totalSteps) * 100;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="space-y-10 w-full max-w-120">
        <div className="flex flex-col items-center text-center">
          <Logo hasLabel={true} />
          <h1 className="font-bold text-3xl md:text-4xl tracking-tighter">
            Create Account
          </h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Bridge the gap between research and industry
          </p>
        </div>

        {step < 5 && (
          <div className="space-y-3 px-2">
            <div className="flex justify-between items-end">
              <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Step 0{step} <span className="mx-2 text-border">/</span> 0
                {totalSteps}
              </span>
              <span className="font-bold text-[10px] text-primary uppercase tracking-widest">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="bg-muted h-1" />
          </div>
        )}

        <Card className="bg-card/50 shadow-none backdrop-blur-sm border-border rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            {/* STEP 1: ROLE SELECTION (Moved from 3) */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="font-bold text-xl tracking-tight">
                    Choose your path
                  </h2>
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    Select your registration type
                  </p>
                </div>
                <div className="gap-3 grid">
                  <button
                    onClick={() => setRole("industry")}
                    className={`group p-5 border rounded-2xl text-left transition-all flex items-center gap-4 ${role === "industry" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  >
                    <div
                      className={`p-3 rounded-xl transition-colors ${role === "industry" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">Industry Partner</div>
                      <div className="mt-1 font-medium text-[11px] text-muted-foreground leading-none">
                        For companies looking for expertise
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setRole("staff")}
                    className={`group p-5 border rounded-2xl text-left transition-all flex items-center gap-4 ${role === "staff" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  >
                    <div
                      className={`p-3 rounded-xl transition-colors ${role === "staff" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">University Staff</div>
                      <div className="mt-1 font-medium text-[11px] text-muted-foreground leading-none">
                        Access internal research tools
                      </div>
                    </div>
                  </button>
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!role}
                  className="rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {/* STEP 2: ACCOUNT INFO (Credentials) */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="font-bold text-xl tracking-tight">
                    Account Setup
                  </h2>
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    {role === "staff"
                      ? "Final step: Enter your credentials"
                      : "Enter your primary login details"}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      placeholder="john@domain.com"
                      className="bg-background rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-background rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                      Confirm Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-background rounded-xl h-12"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 border-border rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
                  >
                    {role === "staff" ? (
                      isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Complete"
                      )
                    ) : (
                      "Next"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PERSONAL INFO (Contact Person - Industry Only) */}
            {step === 3 && role === "industry" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="font-bold text-xl tracking-tight">
                    Contact Person
                  </h2>
                  <p className="font-medium text-[10px] text-destructive uppercase tracking-wider">
                    Required for Industry Partners
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                      Full Name
                    </Label>
                    <Input
                      placeholder="John Doe"
                      className="bg-background rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                      Phone Number
                    </Label>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      className="bg-background rounded-xl h-12"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 border-border rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: COMPANY DETAILS (Industry Only) */}
            {step === 4 && role === "industry" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="font-bold text-xl tracking-tight">
                    Company Profile
                  </h2>
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    Entity details
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                      Company Name
                    </Label>
                    <Input
                      placeholder="Acme Inc."
                      className="bg-background rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                      Industry Type
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-background border-border rounded-xl h-12">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="mfg">Manufacturing</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 border-border rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Complete"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 5 && (
              <div className="space-y-8 py-6 text-center animate-in duration-500 fade-in zoom-in">
                <div className="flex justify-center items-center bg-emerald-500/10 mx-auto rounded-full w-20 h-20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-3">
                  <h2 className="font-bold text-2xl tracking-tighter">
                    Application Received!
                  </h2>
                  <p className="mx-auto max-w-[320px] text-muted-foreground text-sm leading-relaxed">
                    {role === "staff"
                      ? "Your staff account is being verified. Please check your email for the next steps."
                      : "We've sent a verification link. Your account will be accessible once an admin approves your partnership."}
                  </p>
                </div>
                <Link href="/signin" className="block w-full">
                  <Button className="rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest">
                    Return to Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>

          {step !== 5 && (
            <CardFooter className="flex flex-col bg-muted/20 p-6 lg:p-8 border-border border-t">
              <p className="font-medium text-muted-foreground text-xs text-center">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-bold text-primary hover:underline underline-offset-4"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
