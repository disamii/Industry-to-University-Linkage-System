"use client";

import SubmitButton from "@/components/dashboard/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSignin } from "../../_hooks/useSignin";
import { LINKS } from "@/lib/constants";

const SinginForm = () => {
  const { state, formAction } = useSignin();

  return (
    <form id="form-signin" action={formAction} className="space-y-6" noValidate>
      <div className="space-y-2.5">
        <Label
          htmlFor="username"
          className="font-bold text-muted-foreground text-xs uppercase tracking-widest"
        >
          Username/Email
        </Label>
        <Input
          id="username"
          type="username"
          name="username"
          placeholder="Enter your username"
          defaultValue={(state?.fields?.username as string) || ""}
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
            href={LINKS.forgot_password}
            className="hover:opacity-80 font-bold text-[11px] text-primary uppercase tracking-wider transition-opacity"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          defaultValue={(state?.fields?.password as string) || ""}
          className="bg-background border-border rounded-xl focus-visible:ring-primary/20 h-12 transition-all"
        />
      </div>

      <SubmitButton label="Sign In" form="form-signin" />
    </form>
  );
};

export default SinginForm;
