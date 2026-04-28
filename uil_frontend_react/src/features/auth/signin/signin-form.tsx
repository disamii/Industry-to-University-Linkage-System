import { FormInput } from "@/components/reusable/form-components";
import SigninFormWrapper from "@/components/reusable/signin-form-wrapper";
import { LINKS } from "@/lib/constants";
import { SigninInput, signinSchema } from "@/validation/validation.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const SinginForm = () => {
  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  return (
    <SigninFormWrapper form={form}>
      <FormInput
        form={form}
        name="username"
        label="Username/Email"
        placeholder="Enter your username"
      />

      <div className="relative">
        <FormInput
          type="password"
          form={form}
          name="password"
          label="Password"
          placeholder="Enter your username"
        />

        <Link
          to={LINKS.forgot_password}
          className="top-0 right-0 absolute hover:opacity-80 font-medium text-primary text-xs transition-opacity"
        >
          Forgot Password?
        </Link>
      </div>
    </SigninFormWrapper>
  );
};

export default SinginForm;
