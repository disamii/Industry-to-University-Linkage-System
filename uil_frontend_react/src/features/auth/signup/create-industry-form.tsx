import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useIndustryCreateMutation } from "@/data/industry/industry-create-mutation";
import {
  IndustryCreateInput,
  industryCreateSchema,
  industryDefaultValues,
} from "@/validation/validation.industry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CompanyDetailsForm from "./company-details-form";
import ContactDetailsForm from "./contact-details-form";

// --- Main Form Component ---
type CreateIndustryFormProps = {
  setStep: (step: number) => void;
};

const CreateIndustryForm = ({ setStep }: CreateIndustryFormProps) => {
  const { mutate, isPending } = useIndustryCreateMutation();
  const [subStep, setSubStep] = useState(1);

  const form = useForm<IndustryCreateInput>({
    resolver: zodResolver(industryCreateSchema),
    defaultValues: industryDefaultValues,
  });

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid = await form.trigger([
      "name",
      "industry_email",
      "industry_type",
      "location",
      "address",
      "website",
      "phone_number",
      "number_of_employees",
      "description",
    ]);

    if (isValid) {
      setSubStep(2);
    }
  };

  const handleBack = () => {
    if (subStep === 2) {
      setSubStep(1);
    } else {
      setStep(1);
    }
  };

  const onSubmit = (data: IndustryCreateInput) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        setStep(3);
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        id="form-create-industry"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 mx-auto min-w-xl"
      >
        {subStep === 1 ? (
          <div className="animate-in fade-in">
            <h3 className="mb-4 font-bold text-xl">Company Profile</h3>
            <CompanyDetailsForm />
          </div>
        ) : (
          <div className="animate-in fade-in">
            <h3 className="mb-4 font-bold text-xl">Contact Person Account</h3>
            <ContactDetailsForm />
          </div>
        )}

        {/* Navigation Actions */}
        <div className="gap-3 grid grid-cols-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleBack}
            className="w-full h-10"
          >
            {subStep === 2 ? "Previous" : "Back to Role"}
          </Button>

          {subStep === 1 ? (
            <Button type="button" onClick={handleNext} className="w-full h-10">
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              form="form-create-industry"
              disabled={isPending}
              className="w-full h-10"
            >
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Registering..." : "Complete Signup"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateIndustryForm;
