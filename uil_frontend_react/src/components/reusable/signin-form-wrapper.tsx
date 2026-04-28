import { useSignin } from "@/data/auth/signin-mutation";
import { getMe } from "@/data/user/current_user-profile-query";
import { cn, getAdminHomepageLink } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { SigninInput } from "@/validation/validation.auth";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type Props = {
  form: UseFormReturn<SigninInput>;
  className?: string;
  onCloseDialog?: () => void;
  children: ReactNode;
};

const SigninFormWrapper = ({
  form,
  className,
  children,
  onCloseDialog,
}: Props) => {
  const { mutate, isPending } = useSignin();
  const setAuth = useAuthStore((state) => state.setAuth);

  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/"; // Default to home

  const onSubmit = (data: SigninInput) => {
    mutate(data, {
      onSuccess: async (response) => {
        const token = response.access;

        try {
          // Fetch the profile immediately using the new token
          const userData = await getMe(token);

          // Save both to the persisted store
          setAuth(userData, token);

          // Close the dialog if it's opened
          onCloseDialog?.();

          // navigate(from, { replace: true });
          navigate(getAdminHomepageLink(userData.roles));
        } catch (error) {
          console.error("Login succeeded but user profile fetch failed", error);
        }
      },
    });
  };

  return (
    <form
      id="form-signin"
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      {children}

      <Button
        type="submit"
        form="form-signin"
        disabled={isPending}
        className="w-full h-10"
      >
        {isPending && <Spinner data-icon="inline-start" />}
        {isPending ? "Processing..." : "Sign In"}
      </Button>
    </form>
  );
};

export default SigninFormWrapper;
