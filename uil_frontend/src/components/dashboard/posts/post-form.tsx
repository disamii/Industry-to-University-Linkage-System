"use client";

import React, { useState } from "react";
import { Save, Send, Info, Eye, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormInput, FormTextarea, FormFileUpload } from "../form-components";

interface PostFormProps {
  initialData?: {
    title: string;
    description: string;
    type: string;
    status: string;
  };
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function PostForm({
  initialData,
  onSubmit,
  isSubmitting,
}: PostFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "",
    status: initialData?.status || "draft",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
      {/* Main Form Area */}
      <div className="lg:col-span-2">
        <Card className="bg-card shadow-sm p-8 md:p-12 border border-border/50 rounded-[2.5rem]">
          <form id="form-post" onSubmit={handleSubmit} className="space-y-8">
            <FormInput
              label="Post Title"
              placeholder="e.g. Annual Technology Symposium 2026"
              value={formData.title}
              onChange={(e: any) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              helperText="Keep the title concise and impactful."
            />

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 font-bold text-foreground text-sm tracking-tight">
                  Category
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger className="bg-background px-4 border border-border/60 rounded-2xl h-12 text-sm">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="research">Research Call</SelectItem>
                    <SelectItem value="project">Industry Project</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="ml-1 font-bold text-foreground text-sm tracking-tight">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="bg-background px-4 border border-border/60 rounded-2xl h-12 text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="draft">Internal Draft</SelectItem>
                    <SelectItem value="published">Publicly Visible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FormTextarea
              label="Detailed Description"
              placeholder="Write the full content..."
              value={formData.description}
              onChange={(e: any) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />

            <FormFileUpload
              label="Attachments"
              accept="image/*,application/pdf"
            />
          </form>
        </Card>
      </div>

      {/* Configuration Sidebar */}
      <div className="space-y-6">
        <Card className="bg-card shadow-sm p-8 border border-border/50 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Settings2 size={18} />
            </div>
            <h3 className="font-bold text-foreground text-sm uppercase tracking-widest">
              Post Settings
            </h3>
          </div>
          <div className="space-y-6">
            <div className="bg-accent/30 p-4 border border-border/40 rounded-2xl">
              <div className="flex items-start gap-3">
                <Info size={16} className="mt-0.5 text-primary" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Publishing this post makes it visible to all{" "}
                  <strong>Industry Partners</strong>.
                </p>
              </div>
            </div>
            <Button
              type="submit"
              form="form-post"
              disabled={isSubmitting}
              className="gap-2 shadow-lg px-8 rounded-2xl w-full h-12 font-bold transition-all"
            >
              {initialData ? <Save size={18} /> : <Send size={18} />}
              {initialData ? "Update Changes" : "Publish Post"}
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 border-border/60 rounded-xl w-full h-12 font-bold text-muted-foreground"
            >
              <Eye size={16} /> Preview Draft
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
