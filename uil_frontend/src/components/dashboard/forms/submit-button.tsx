"use client";

import { Spinner } from "@/components/reusable/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useFormStatus } from "react-dom";

type Props = {
  label: string;
  form: string;
  isSubmitting?: boolean;
  className?: string;
};

const SubmitButton = ({ label, form, isSubmitting, className }: Props) => {
  const { pending } = useFormStatus();
  const isPending = isSubmitting || pending;

  return (
    <Button
      type="submit"
      className={cn(
        "hover:bg-primary/90 rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest transition-all",
        className,
      )}
      disabled={isPending}
      form={form}
    >
      {isPending ? (
        <>
          <Spinner size="sm" /> <span>Submitting...</span>
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="ml-2 w-4 h-4" />
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
