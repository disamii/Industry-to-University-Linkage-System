"use client";

import { Spinner } from "@/components/reusable/spinner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIndustryCreateMutation } from "@/data/industry/industry-create-mutation";
import { IndustryType } from "@/lib/enums";
import {
  IndustryCreateInput,
  industryCreateSchema,
  industryDefaultValues,
} from "@/validation/validation.industry";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";

// --- Sub-Component: Step 1 (Company) ---
const CompanyDetails = () => {
  const { control } = useFormContext<IndustryCreateInput>();

  return (
    <FieldGroup className="gap-4 grid grid-cols-1 md:grid-cols-2">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="md:col-span-2">
            <FieldLabel>Company Name</FieldLabel>
            <Input {...field} placeholder="e.g. Acme Corp" className="h-10" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="industry_type"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Industry Type</FieldLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(IndustryType).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="industry_email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Industry Email</FieldLabel>
            <Input
              {...field}
              type="email"
              placeholder="office@company.com"
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="phone_number"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Company Phone Number</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder="+251..."
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="number_of_employees"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Number of Employees</FieldLabel>
            <Input
              type="number"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
              placeholder="120"
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              placeholder="Software development and IT consulting..."
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="location"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Location (City)</FieldLabel>
            <Input {...field} placeholder="Addis Ababa" className="h-10" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="website"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Website (Optional)</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder="https://..."
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="address"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="md:col-span-2">
            <FieldLabel>Physical Address</FieldLabel>
            <Textarea {...field} placeholder="Street, Building, Office No." />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

// --- Sub-Component: Step 2 (Contact Person) ---
const ContactDetails = () => {
  const { control } = useFormContext<IndustryCreateInput>();

  return (
    <FieldGroup className="">
      <Controller
        name="contact_full_name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Full Name</FieldLabel>
            <Input {...field} placeholder="John Doe Smith" className="h-10" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="contact_email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Email</FieldLabel>
            <Input
              {...field}
              type="email"
              placeholder="john.d@company.com"
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="contact_person_phone_number"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Phone Number</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder="john.d@company.com"
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <Controller
          name="contact_password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Password</FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder="••••••••"
                className="h-10"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirm_password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder="••••••••"
                className="h-10"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  );
};

// --- Main Form Component ---
type CreateIndustryFormProps = {
  step: number;
  setStep: (step: number) => void;
};

const CreateIndustryForm = ({ step, setStep }: CreateIndustryFormProps) => {
  const isSecondPart = step === 2.5;
  const { mutate, isPending } = useIndustryCreateMutation();

  const methods = useForm<IndustryCreateInput>({
    resolver: zodResolver(industryCreateSchema),
    defaultValues: industryDefaultValues,
    shouldUnregister: true,
  });

  const handleNext = async () => {
    const isValid = await methods.trigger([
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
      methods.clearErrors([
        "contact_full_name",
        "contact_email",
        "contact_person_phone_number",
        "contact_password",
        "confirm_password",
      ]);
      setStep(2.5); // Move global progress to halfway through step 2
    }
  };

  const handleBack = () => {
    if (isSecondPart) {
      setStep(2); // Go back to first part of industry form
    } else {
      setStep(1); // Go back to Role Selection
    }
  };

  const onSubmit = (data: IndustryCreateInput) => {
    mutate(data, {
      onSuccess: () => {
        methods.reset();
        setStep(3); // Moves SignupForm to SignupSuccess
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <form
          id="form-create-industry"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {!isSecondPart ? (
            <div className="animate-in fade-in">
              <h3 className="mb-4 font-bold text-lg">Company Profile</h3>
              <CompanyDetails />
            </div>
          ) : (
            <div className="animate-in fade-in">
              <h3 className="mb-4 font-bold text-lg">Contact Person Account</h3>
              <ContactDetails />
            </div>
          )}
        </form>

        {/* Navigation Actions */}
        <div className="gap-3 grid grid-cols-2 pt-4">
          <Button
            variant="outline"
            type="button" // Important to prevent accidental submits
            onClick={handleBack}
            className="rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest"
          >
            {isSecondPart ? "Previous" : "Back to Role"}
          </Button>

          {!isSecondPart ? (
            <Button
              type="button"
              onClick={handleNext}
              className="rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              form="form-create-industry"
              disabled={isPending}
              className="rounded-xl w-full h-12 font-bold text-xs uppercase tracking-widest"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" /> <span>Registering...</span>
                </div>
              ) : (
                "Complete Signup"
              )}
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default CreateIndustryForm;
