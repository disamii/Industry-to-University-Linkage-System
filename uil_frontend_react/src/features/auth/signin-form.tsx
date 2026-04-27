import { FormInput } from "@/components/reusable/form-components";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignin } from "@/data/auth/signin-mutation";
import { getMe } from "@/data/user/current_user-profile-query";
import { LINKS } from "@/lib/constants";
import { getAdminHomepageLink } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { SigninInput, signinSchema } from "@/validation/validation.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const SinginForm = () => {
  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });
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
      className="space-y-6"
    >
      <FormInput
        form={form}
        name="username"
        label="Username/Email"
        placeholder="Enter your username"
      />

      <div className="relative">
        <FormInput
          form={form}
          name="password"
          label="Password"
          placeholder="Enter your username"
          type="password"
        />

        <Link
          to={LINKS.forgot_password}
          className="top-0 right-0 absolute hover:opacity-80 font-medium text-primary text-xs transition-opacity"
        >
          Forgot Password?
        </Link>
      </div>

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

export default SinginForm;
