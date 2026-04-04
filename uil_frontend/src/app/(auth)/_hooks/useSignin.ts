"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signinAction } from "@/app/actions/actions.auth";
import { signinSchema } from "@/validation/validation.auth";
import { useUserStore } from "@/store/useUserStore";
import { appToast } from "@/lib/toast";

export type ActionState = {
  message: string | null;
  error: string | null;
  fields?: Record<string, any> | null;
};

export const useSignin = (onSuccess?: () => void) => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
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
          setUser(result.user);
          onSuccess?.();
          router.push(result.path);
          return { message: "Success", error: null };
        }
        return { message: null, error: "Invalid credentials" };
      } catch (err: any) {
        if (
          err.message === "NEXT_REDIRECT" ||
          err.digest?.includes("NEXT_REDIRECT")
        )
          throw err;
        return {
          message: null,
          error: err.message || "Something went wrong",
          fields: rawData,
        };
      }
    },
    { message: null, error: null, fields: null },
  );

  useEffect(() => {
    if (state?.error && !isPending) {
      appToast.warning(state.error);
    }
  }, [state?.error, isPending]);

  return { state, formAction, isPending };
};
