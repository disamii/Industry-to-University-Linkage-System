import { FormInput } from "@/components/reusable/form-components";
import FormWrapper from "@/components/reusable/form-wrapper";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAuthStore } from "@/store/use-auth-store";
import {
  UserAccountUpdateInput,
  userAccountUpdateSchema,
} from "@/validation/validation.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const UpdateUserAccountForm = () => {
  const { user } = useAuthStore();
  const {
    username,
    email,
    first_name,
    father_name,
    grand_father_name,
    academic_unit,
  } = user || {};

  const form = useForm<UserAccountUpdateInput>({
    resolver: zodResolver(userAccountUpdateSchema),
    defaultValues: {
      username,
      email,
      first_name,
      father_name,
      grand_father_name,
      academic_unit,
    },
  });

  const onSubmit = () => {};

  return (
    <Card>
      <CardHeader className="sr-only">
        <CardTitle className="font-bold text-2xl">
          Update your Account.
        </CardTitle>
        <CardDescription className="text-base">
          Fill out the following fields to update your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormWrapper
          form={form}
          formId="update-user-account"
          onSubmit={onSubmit}
          submitLabel="Update Account"
          isPending={false}
        >
          <FieldGroup>
            {/* --- Account Information --- */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <FormInput
                form={form}
                name="username"
                label="Username"
                placeholder="Enter username"
                disabled
              />

              <FormInput
                type="email"
                form={form}
                name="email"
                label="Email Address"
                placeholder="Enter email address"
                disabled
              />
            </div>

            {/* --- Personal Information --- */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <FormInput
                form={form}
                name="first_name"
                label="First Name"
                placeholder="Enter first name"
                required
              />

              <FormInput
                form={form}
                name="father_name"
                label="Father Name"
                placeholder="Enter father name"
                required
              />
            </div>

            <FormInput
              form={form}
              name="grand_father_name"
              label="Grand Father Name"
              placeholder="Enter grand father name"
              required
            />

            <TreeSelectOrgUnit form={form} variant="form" />
          </FieldGroup>
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default UpdateUserAccountForm;
