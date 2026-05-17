import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;

  children: React.ReactNode;

  submitLabel?: string;
  isPending?: boolean;

  formId: string;
};

const FormWrapper = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  submitLabel = "Save",
  isPending,
  formId,
}: Props<T>) => {
  const { isDirty } = form.formState;

  return (
    <FormProvider {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {children}

        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="mt-4 w-full h-11"
        >
          {isPending && <Spinner data-icon="inline-start" />}
          {submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
};

export default FormWrapper;
