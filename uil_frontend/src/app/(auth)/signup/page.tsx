"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// --- DUMMY DATA FOR TESTING ---
const MOCK_RPMS_DB = {
  "admin@rpms.com": {
    fullName: "Dr. Sarah Jenkins",
    exists: true,
    correctPass: "password123",
  },
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"industry" | "staff" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // RPMS State
  const [showRpmsDialog, setShowRpmsDialog] = useState(false);
  const [rpmsUserData, setRpmsUserData] = useState<{
    fullName: string;
    email: string;
  } | null>(null);
  const [rpmsError, setRpmsError] = useState("");
  const [notFoundInRpms, setNotFoundInRpms] = useState(false);

  const totalSteps = 2;
  const progress = step === 3 ? 100 : (step / totalSteps) * 100;

  const handleContinue = async () => {
    if (role === "industry" && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setNotFoundInRpms(false);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (role === "staff") {
      const user = MOCK_RPMS_DB[email as keyof typeof MOCK_RPMS_DB];
      if (user) {
        setRpmsUserData({ fullName: user.fullName, email: email });
        setShowRpmsDialog(true);
      } else {
        setNotFoundInRpms(true);
      }
    } else {
      setStep(3);
    }
    setIsSubmitting(false);
  };

  const handleRpmsVerify = async () => {
    setIsSubmitting(true);
    setRpmsError("");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_RPMS_DB[email as keyof typeof MOCK_RPMS_DB];
    if (password === user?.correctPass) {
      setShowRpmsDialog(false);
      router.push("/dashboard/staff");
    } else {
      setRpmsError("Password mismatch with RPMS records.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="space-y-10 w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <Logo hasLabel={true} />
          <h1 className="font-bold text-3xl md:text-4xl tracking-tighter">
            Create Account
          </h1>
          <p className="mt-3 font-medium text-muted-foreground text-sm">
            UIL & RPMS Integrated Authentication
          </p>
        </div>

        {step < 3 && (
          <div className="space-y-3 px-2">
            <div className="flex justify-between items-end">
              <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Step 0{step}
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
                      className={`p-3 rounded-xl ${role === "industry" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">Industry Partner</div>
                      <div className="mt-1 font-medium text-[11px] text-muted-foreground leading-none">
                        Direct signup for companies
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setRole("staff")}
                    className={`group p-5 border rounded-2xl text-left transition-all flex items-center gap-4 ${role === "staff" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  >
                    <div
                      className={`p-3 rounded-xl ${role === "staff" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">University Staff</div>
                      <div className="mt-1 font-medium text-[11px] text-muted-foreground leading-none">
                        Authenticate via RPMS Profile
                      </div>
                    </div>
                  </button>
                </div>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!role}
                  className="mt-2 rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest"
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="font-bold text-xl tracking-tight">
                    {role === "staff"
                      ? "Staff Verification"
                      : "Industry Signup"}
                  </h2>
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    {role === "staff"
                      ? "RPMS (Researcher Profile) Lookup"
                      : "Create your credentials"}
                  </p>
                </div>

                <div className="space-y-4">
                  {role === "staff" && (
                    <div className="flex items-start gap-3 bg-blue-500/5 p-3 border border-blue-500/10 rounded-xl">
                      <ShieldCheck className="mt-0.5 w-4 h-4 text-blue-500 shrink-0" />
                      <p className="text-[11px] text-blue-700/80 leading-tight">
                        <strong>Priority:</strong> An active{" "}
                        <strong>RPMS Account</strong> is required.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className={`bg-background rounded-xl h-12 ${notFoundInRpms ? "border-destructive" : ""}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    {notFoundInRpms && role === "staff" && (
                      <div className="space-y-2 bg-destructive/5 p-4 border border-destructive/20 rounded-2xl animate-in fade-in zoom-in">
                        <div className="flex items-center gap-2 font-bold text-[11px] text-destructive uppercase tracking-wider">
                          <AlertCircle className="w-4 h-4" /> Not Found in RPMS
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-relaxed">
                          Your account must be created in RPMS first.
                        </p>
                        <Button
                          asChild
                          variant="link"
                          className="p-0 h-auto font-bold text-primary text-xs underline"
                        >
                          <a
                            href="https://rpms.university.edu/register"
                            target="_blank"
                          >
                            Register Now{" "}
                            <ExternalLink className="ml-1 w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>

                  {role === "industry" && (
                    <div className="slide-in-from-bottom-2 space-y-4 animate-in">
                      <div className="space-y-2">
                        <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                          Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-background rounded-xl h-12"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                          Confirm Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-background rounded-xl h-12"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl h-12 font-bold text-xs"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={isSubmitting || !email}
                    className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 py-6 text-center animate-in fade-in zoom-in">
                <div className="flex justify-center items-center bg-emerald-500/10 mx-auto rounded-full w-20 h-20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="font-bold text-2xl tracking-tighter">
                  Registration Success!
                </h2>
                <Link href="/signin" className="block w-full">
                  <Button className="rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest">
                    Return to Login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>

          {step !== 3 && (
            <CardFooter className="flex flex-col bg-muted/20 p-6 lg:p-8 border-border border-t">
              <p className="font-medium text-muted-foreground text-xs text-center">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-bold text-primary hover:underline underline-offset-4 transition-all"
                >
                  Sign In
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* RPMS DIALOG - FIXED OVERFLOW */}
      <Dialog open={showRpmsDialog} onOpenChange={setShowRpmsDialog}>
        <DialogContent className="flex flex-col shadow-2xl p-0 border-none rounded-[2.5rem] sm:max-w-106.25 max-h-[90vh] overflow-hidden">
          <div className="p-8 overflow-y-auto custom-scrollbar">
            <DialogHeader className="items-center space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-3xl">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="font-bold text-2xl tracking-tight">
                  RPMS Profile Found
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Please verify your credentials to continue.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-4 bg-muted/40 p-4 border border-border rounded-2xl">
                <div className="flex justify-center items-center bg-primary/20 rounded-full w-10 h-10 font-bold text-primary text-sm shrink-0">
                  {rpmsUserData?.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden text-left">
                  <p className="font-bold text-sm truncate leading-tight">
                    {rpmsUserData?.fullName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                    {rpmsUserData?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  RPMS Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-muted/20 rounded-xl h-12"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setRpmsError("");
                  }}
                />
                {rpmsError && (
                  <div className="flex items-center gap-2 ml-1 font-bold text-[11px] text-destructive animate-in fade-in">
                    <AlertCircle className="w-3 h-3" /> {rpmsError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex sm:flex-row flex-col gap-3 p-8 pt-0">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRpmsDialog(false);
                setEmail("");
                setPassword("");
              }}
              className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
            >
              Re-enter Email
            </Button>
            <Button
              onClick={handleRpmsVerify}
              disabled={isSubmitting || !password}
              className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify & Enter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
