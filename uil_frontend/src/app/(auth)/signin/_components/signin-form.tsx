"use client";

import { signinAction } from "@/app/actions/actions.auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appToast } from "@/lib/toast";
import { useUserStore } from "@/store/useUserStore";
import { signinSchema } from "@/validation/validation.auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import SubmitButton from "../../../../components/reusable/submit-button";

type ActionState = {
  message: string | null;
  error: string | null;
  fields?: Record<string, any> | null;
};

const SinginForm = () => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const [state, formAction] = useActionState<ActionState, FormData>(
    async (
      prevState: ActionState,
      formData: FormData,
    ): Promise<ActionState> => {
      const rawData = Object.fromEntries(formData);
      const validatedFields = signinSchema.safeParse(rawData);

      if (!validatedFields.success) {
        return {
          message: null,
          error:
            validatedFields.error.flatten().fieldErrors.email?.[0] ||
            validatedFields.error.flatten().fieldErrors.password?.[0] ||
            "Invalid input",
          fields: rawData,
        };
      }

      try {
        const result = await signinAction(validatedFields.data);

        if (result?.user) {
          // SAVE TO ZUSTAND (and LocalStorage via persist)
          setUser(result.user);

          // Redirect
          router.push(result.path);
        }

        return { message: "Logging in...", error: null };
      } catch (err: any) {
        if (
          err.message === "NEXT_REDIRECT" ||
          err.digest?.includes("NEXT_REDIRECT")
        ) {
          throw err;
        }

        return {
          message: null,
          error: err.message || "Something went wrong",
          fields: rawData,
        };
      }
    },
    { message: null, error: null, fields: null }, // Initial State
  );

  useEffect(() => {
    if (!state?.error) return;

    appToast.warning(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="space-y-2.5">
        <Label
          htmlFor="email"
          className="font-bold text-muted-foreground text-xs uppercase tracking-widest"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Email Address"
          // Use optional chaining to safely access fields
          defaultValue={(state?.fields?.email as string) || ""}
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
            href="/forgot-password"
            className="hover:opacity-80 font-bold text-[11px] text-primary uppercase tracking-wider transition-opacity"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          defaultValue={(state?.fields?.password as string) || ""}
          className="bg-background border-border rounded-xl focus-visible:ring-primary/20 h-12 transition-all"
        />
      </div>

      <SubmitButton label="Sign In" />
    </form>
  );
};

export default SinginForm;
