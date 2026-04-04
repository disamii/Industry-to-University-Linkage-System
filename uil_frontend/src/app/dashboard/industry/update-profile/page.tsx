"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function IndustryProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-muted/20">
      {/* Increased width to 4xl */}
      <div className="slide-in-from-bottom-4 space-y-6 w-full animate-in duration-700 fade-in">
        <Card className="bg-card border-none rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-muted/10 p-10 pb-8 border-border/50 border-b">
            <div className="flex items-center gap-5">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="font-bold text-3xl tracking-tighter">
                  Industry Profile
                </CardTitle>
                <CardDescription className="text-base">
                  Complete your organizational details to begin collaborating
                  with the UIL network.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Three-column grid on desktop */}
              <div className="gap-x-8 gap-y-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* 1. Company Name */}
                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Company Name
                  </Label>
                  <Input
                    placeholder="Acme Industries"
                    className="focus-visible:ring-2 focus-visible:ring-primary h-10"
                    required
                  />
                </div>

                {/* 2. Industry Type */}
                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Industry Type
                  </Label>
                  <Select required>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary h-10">
                      <SelectValue placeholder="Select Sector" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="energy">Energy & Utilities</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Contact Person */}
                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Contact Person
                  </Label>
                  <Input placeholder="Full Name" className="h-10" required />
                </div>

                {/* 4. Phone */}
                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Business Phone
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="h-10"
                    required
                  />
                </div>

                {/* 5. Efficiency Level */}
                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Efficiency Level
                  </Label>
                  <Select required>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary h-10">
                      <SelectValue placeholder="Current Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="low">Level 1: Developing</SelectItem>
                      <SelectItem value="mid">Level 2: Optimized</SelectItem>
                      <SelectItem value="high">Level 3: Efficient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 6. Website */}
                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Official Website
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://www.acme.com"
                    className="h-10"
                    required
                  />
                </div>

                {/* 7. Address (Spans remaining columns) */}
                <div className="space-y-2 lg:col-span-3">
                  <Label className="ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Headquarters Address
                  </Label>
                  <Input
                    placeholder="Full business address"
                    className="h-10"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-row flex-col justify-between items-center gap-6 pt-6 border-border/50 border-t">
                <div className="flex items-center gap-3 opacity-70 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-medium text-xs uppercase tracking-widest">
                    Data Privacy Guaranteed
                  </span>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  {isSaved && (
                    <Link href="/dashboard" className="w-full md:w-auto">
                      <Button
                        variant="outline"
                        className="hover:bg-muted/50 px-8 border-border rounded-2xl w-full h-14 font-bold uppercase tracking-widest"
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSaved}
                    className="flex-1 md:flex-none px-12 rounded-2xl h-14 font-bold uppercase tracking-widest transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isSaved ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-5 h-5" /> Profile Saved
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Complete Registration <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
