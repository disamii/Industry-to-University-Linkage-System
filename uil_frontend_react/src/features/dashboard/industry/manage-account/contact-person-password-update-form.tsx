import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactPasswordForm from "@/features/auth/signup/contact-password-form";
import IndustryFormWrapper from "@/features/auth/signup/industry-form-wrapper";
import {
  ContactPersonUpdatePasswordInput,
  contactPersonUpdatePasswordSchema,
} from "@/validation/validation.industry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const ContactPersonPasswordUpdateForm = () => {
  const form = useForm<ContactPersonUpdatePasswordInput>({
    resolver: zodResolver(contactPersonUpdatePasswordSchema),
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
        <IndustryFormWrapper
          form={form}
          formId="update-contact-person-password-form"
          onSubmit={onSubmit}
          submitLabel="Update Password"
        >
          <ContactPasswordForm />
        </IndustryFormWrapper>
      </CardContent>
    </Card>
  );
};

export default ContactPersonPasswordUpdateForm;
