import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type BaseFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>; // This ensures 'name' is a valid key of your schema
  placeholder: string;
};

type FormInputProps<T extends FieldValues> = BaseFormProps<T> & {
  type: string;
};

export const FormInput = <T extends FieldValues>({
  form,
  label,
  name,
  placeholder,
  type,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...field}
            id={field.name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

type FormTextAreaProps<T extends FieldValues> = BaseFormProps<T> & {
  desc?: string;
};

export const FormTextArea = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  desc,
}: FormTextAreaProps<T>) => (
  <Controller
    name={name}
    control={form.control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        <Textarea
          {...field}
          id={field.name}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          className="min-h-30"
        />
        {desc && <FieldDescription>{desc}</FieldDescription>}
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
);

type FormSelectProps<T extends FieldValues> = BaseFormProps<T> & {
  orientation?: "vertical" | "horizontal" | "responsive";
  position?: "item-aligned" | "popper";
  options: { value: string; label: string }[];
  desc?: string;
};

export const FormSelect = <T extends FieldValues>({
  form,
  name,
  label,
  options,
  orientation,
  desc,
  placeholder,
  position,
}: FormSelectProps<T>) => (
  <Controller
    name={name}
    control={form.control}
    render={({ field, fieldState }) => (
      <Field orientation={orientation} data-invalid={fieldState.invalid}>
        <FieldContent>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {desc && <FieldDescription>{desc}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldContent>
        <Select
          name={field.name}
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger
            id={field.name}
            aria-invalid={fieldState.invalid}
            className="min-w-30"
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent position={position}>
            {options.map(({ value, label }, idx) => (
              <SelectItem key={`${value}—${idx}`} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    )}
  />
);
