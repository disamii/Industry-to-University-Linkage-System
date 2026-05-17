import FormWrapper from "@/components/reusable/form-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIndustryUpdateMutation } from "@/data/industry/industry-update-mutation";
import ContactDetailsForm from "@/features/auth/signup/contact-details-form";
import { IndustryResponse } from "@/types/interfaces.industry";
import {
  ContactPersonUpdateInput,
  contactPersonUpdateSchema,
} from "@/validation/validation.industry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const ContactPersonInfoUpdateForm = ({
  contact_full_name,
  contact_email,
  contact_person_phone_number,
}: IndustryResponse) => {
  const { mutate, isPending } = useIndustryUpdateMutation();
  const form = useForm<ContactPersonUpdateInput>({
    resolver: zodResolver(contactPersonUpdateSchema),
    defaultValues: {
      contact_full_name,
      contact_email,
      contact_person_phone_number,
    },
  });

  const onSubmit = (data: ContactPersonUpdateInput) => {
    mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-lg">
          Manage Your Account
        </CardTitle>
        <CardDescription>
          Fill out the fields to update you account info.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormWrapper
          form={form}
          formId="update-contact-person-form"
          onSubmit={onSubmit}
          submitLabel="Update Account"
          isPending={isPending}
        >
          <ContactDetailsForm showPasswordFields={false} />{" "}
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default ContactPersonInfoUpdateForm;
