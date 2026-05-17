import { FormInput } from "@/components/reusable/form-components";
import { FieldGroup } from "@/components/ui/field";
import { FieldValues, useFormContext } from "react-hook-form";

const ChangeUserPasswordForm = () => {
  const form = useFormContext<FieldValues>();

  return (
    <FieldGroup>
      <FormInput
        type="password"
        form={form}
        name="old_password"
        label="Current Password"
        placeholder="Enter current password"
        required
      />

      <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
        <FormInput
          type="password"
          form={form}
          name="contact_password"
          label="New Password"
          placeholder="Enter new password"
          required
        />

        <FormInput
          type="password"
          form={form}
          name="confirm_password"
          label="Confirm Password"
          placeholder="Confirm password"
          required
        />
      </div>
    </FieldGroup>
  );
};

export default ChangeUserPasswordForm;
