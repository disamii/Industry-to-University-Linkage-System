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
  CreateIndustryInput,
  createIndustrySchema,
} from "@/validation/validation.auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useCreateIndustryMutation } from "../../_hooks/useAuth";

type Props = {
  setStep: (step: number) => void;
};

const CreateIndustryForm = ({ setStep }: Props) => {
  const { mutate, isPending: isSubmitting } = useCreateIndustryMutation();

  const form = useForm<CreateIndustryInput>({
    resolver: zodResolver(createIndustrySchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const name = useWatch({
    control: form.control,
    name: "name",
  });
  const email = useWatch({
    control: form.control,
    name: "email",
  });

  const onSubmit = (data: CreateIndustryInput) =>
    mutate(data, {
      onSuccess: () => {
        form.reset();
        setStep(3);
      },
    });

  return (
    <div className="space-y-6">
      <form
        id="form-create-industry"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-create-industry-name">
                  Company Name
                </FieldLabel>
                <Input
                  {...field}
                  className="h-10"
                  id="form-create-industry-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-create-industry-email">
                  Company Email Address
                </FieldLabel>
                <Input
                  {...field}
                  className="h-10"
                  id="form-create-industry-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter email adresss"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-create-industry-password">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  className="h-10"
                  type="password"
                  id="form-create-industry-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-create-industry-confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  {...field}
                  className="h-10"
                  type="password"
                  id="form-create-industry-confirm-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Repeat your password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1 rounded-xl h-12 font-bold text-xs"
        >
          Back
        </Button>
        <Button
          type="submit"
          form="form-create-industry"
          disabled={isSubmitting || !email || !name}
          className="flex-1 rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" /> <span>Submitting...</span>
            </>
          ) : (
            "Register"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateIndustryForm;
