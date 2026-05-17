import ChangeUserPasswordForm from "@/components/reusable/change-password-form";
import FormWrapper from "@/components/reusable/form-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UserUpdatePasswordInput,
  userUpdatePasswordSchema,
} from "@/validation/validation.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const UpdateUserPasswordForm = () => {
  const form = useForm<UserUpdatePasswordInput>({
    resolver: zodResolver(userUpdatePasswordSchema),
    defaultValues: {},
  });

  const onSubmit = () => {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-lg">
          Update your password
        </CardTitle>
        <CardDescription>
          Provide the details below to update your password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormWrapper
          form={form}
          formId="update-user-password-form"
          onSubmit={onSubmit}
          submitLabel="Update Password"
        >
          <ChangeUserPasswordForm />
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default UpdateUserPasswordForm;
