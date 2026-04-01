"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, X, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormInput,
  FormTextarea,
  FormFileUpload,
} from "@/components/dashboard/form-components";

export default function SubmitRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    priority: "",
    budget: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push("/dashboard/industry/requests");
  };

  return (
    <div className="space-y-8 mx-auto pb-20 max-w-4xl">
      {/* Navigation */}
      <Link
        href="/dashboard/industry"
        className="group inline-flex items-center gap-2 font-bold text-muted-foreground hover:text-primary text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
          Submit New Request
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Complete the details below to initiate a formal collaboration request
          with university experts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="bg-card shadow-sm p-2 md:p-6 border-border/50 rounded-[2.5rem]">
          <CardContent className="space-y-8 pt-6">
            {/* Title Section */}
            <FormInput
              label="Request Title"
              placeholder="e.g., AI-Powered Quality Control System"
              required
              value={formData.title}
              onChange={(e: any) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            {/* Grid for Selects */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 font-bold text-foreground text-sm tracking-tight">
                  Request Type <span className="text-destructive">*</span>
                </label>
                <Select
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger className="bg-background border-border/60 rounded-2xl focus:ring-primary/20 h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="shadow-xl border-border/60 rounded-2xl">
                    <SelectItem value="technical-support">
                      Technical Support
                    </SelectItem>
                    <SelectItem value="research-collaboration">
                      Research Collaboration
                    </SelectItem>
                    <SelectItem value="training">
                      Training & Development
                    </SelectItem>
                    <SelectItem value="consulting">
                      Consulting Services
                    </SelectItem>
                    <SelectItem value="testing">Testing & Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="ml-1 font-bold text-foreground text-sm tracking-tight">
                  Priority <span className="text-destructive">*</span>
                </label>
                <Select
                  onValueChange={(v) =>
                    setFormData({ ...formData, priority: v })
                  }
                >
                  <SelectTrigger className="bg-background border-border/60 rounded-2xl focus:ring-primary/20 h-12">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="shadow-xl border-border/60 rounded-2xl">
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Input */}
            <FormInput
              label="Estimated Budget (USD)"
              type="number"
              placeholder="e.g. 50000"
              value={formData.budget}
              onChange={(e: any) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              helperText="Optional: Provide a rough estimate for financial planning."
            />

            {/* Description Textarea */}
            <FormTextarea
              label="Detailed Description"
              placeholder="Describe project goals, expected outcomes, and specific technical requirements..."
              required
              value={formData.description}
              onChange={(e: any) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* File Upload */}
            <FormFileUpload
              label="Attachments & Briefings"
              accept=".pdf,.doc,.docx"
            />

            {/* Next Steps Info Box */}
            <div className="bg-primary/[0.03] p-6 md:p-8 border border-primary/10 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <Info size={18} />
                </div>
                <h3 className="font-bold text-foreground">
                  What happens next?
                </h3>
              </div>
              <ul className="gap-4 grid grid-cols-1 md:grid-cols-2">
                {[
                  "Review by Linkage Office (2-3 days)",
                  "Matching with university experts",
                  "Status updates via email/dashboard",
                  "Direct messaging with assigned team",
                ].map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-muted-foreground text-sm"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex sm:flex-row flex-col items-center gap-4 pt-4 border-border/40 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-lg shadow-primary/20 px-10 rounded-2xl w-full sm:w-auto h-12 font-bold transition-all"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 w-4 h-4" />
                    Submit Request
                  </>
                )}
              </Button>
              <Link href="/dashboard/industry" className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  type="button"
                  className="hover:bg-accent px-10 rounded-2xl w-full sm:w-auto h-12 font-bold text-muted-foreground"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
