"use client";

import { UploadCloud } from "lucide-react";

// Input
export const FormInput = ({ label, required, helperText, ...props }: any) => (
  <div className="space-y-2">
    <label className="ml-1 font-bold text-foreground text-sm tracking-tight">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <input
      {...props}
      className="bg-background px-4 border border-border/60 focus:border-primary rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-12 placeholder:text-muted-foreground/50 text-sm transition-all"
    />
    {helperText && (
      <p className="ml-1 text-[11px] text-muted-foreground">{helperText}</p>
    )}
  </div>
);

// Textarea
export const FormTextarea = ({ label, required, ...props }: any) => (
  <div className="space-y-2">
    <label className="ml-1 font-bold text-foreground text-sm tracking-tight">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <textarea
      {...props}
      className="bg-background p-4 border border-border/60 focus:border-primary rounded-[1.5rem] outline-none focus:ring-2 focus:ring-primary/20 w-full min-h-30 text-sm transition-all resize-none"
    />
  </div>
);

// File Upload
export const FormFileUpload = ({ label, required, accept }: any) => (
  <div className="space-y-2">
    <label className="ml-1 font-bold text-foreground text-sm tracking-tight">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <label className="group flex flex-col justify-center items-center bg-accent/20 hover:bg-accent/40 border-2 border-border/60 hover:border-primary/40 border-dashed rounded-[1.5rem] w-full h-32 transition-all cursor-pointer">
      <UploadCloud className="mb-2 w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
        Click to upload files
      </span>
      <input type="file" className="hidden" accept={accept} />
    </label>
  </div>
);
