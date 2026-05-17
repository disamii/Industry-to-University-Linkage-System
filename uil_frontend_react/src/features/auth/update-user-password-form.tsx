import ChangeUserPasswordForm from "@/components/reusable/change-password-form";
import FormWrapper from "@/components/reusable/form-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChangePasswordMutation } from "@/data/user/change-password-mutation";
import {
  UserUpdatePasswordInput,
  userUpdatePasswordSchema,
} from "@/validation/validation.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const UpdateUserPasswordForm = () => {
  const { mutate, isPending } = useChangePasswordMutation();

  const form = useForm<UserUpdatePasswordInput>({
    resolver: zodResolver(userUpdatePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: UserUpdatePasswordInput) => {
    mutate(data);
  };

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
          isPending={isPending}
        >
          <ChangeUserPasswordForm />
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default UpdateUserPasswordForm;
