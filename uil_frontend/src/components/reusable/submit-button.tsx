"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type Props = {
  label: string;
};

const SubmitButton = ({ label }: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="hover:bg-primary/90 rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest transition-all"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
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
