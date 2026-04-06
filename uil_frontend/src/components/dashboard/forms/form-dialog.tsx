"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  desc?: string;
  children: React.ReactNode;
}

export default function FormDialog({
  open,
  onOpenChange,
  title,
  desc,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="font-bold text-2xl">{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
