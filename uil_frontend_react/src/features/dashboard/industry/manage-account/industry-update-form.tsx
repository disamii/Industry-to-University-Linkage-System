import FormWrapper from "@/components/reusable/form-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompanyDetailsForm from "@/features/auth/signup/company-details-form";
import { IndustryResponse } from "@/types/interfaces.industry";
import {
  IndustryUpdateInput,
  industryUpdateSchema,
} from "@/validation/validation.industry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const IndustryUpdateForm = ({
  name,
  industry_type,
  industry_email,
  location,
  address,
  phone_number,
  description,
  number_of_employees,
  website,
}: IndustryResponse) => {
  const form = useForm<IndustryUpdateInput>({
    resolver: zodResolver(industryUpdateSchema),
    defaultValues: {
      name,
      industry_email,
      industry_type,
      location,
      address,
      phone_number,
      description,
      number_of_employees,
      website,
    },
  });

  const onSubmit = () => {};

  return (
    <Card>
      <CardHeader className="sr-only">
        <CardTitle className="font-bold text-2xl">
          Update your Industry details.
        </CardTitle>
        <CardDescription className="text-base">
          Fill out the following fields to update your industry info.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormWrapper
          form={form}
          formId="update-industry-form"
          onSubmit={onSubmit}
          submitLabel="Update Industry"
        >
          <CompanyDetailsForm />
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default IndustryUpdateForm;
