import { FormFieldConfig } from "@/features/dashboard/request/utils.request-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const buildSchema = (fields: FormFieldConfig[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let schema: z.ZodTypeAny;

    // 🔥 1. use explicit validation if exists
    if (field.validation) {
      schema = field.validation(z);
    } else {
      // 🔁 fallback (minimal)
      switch (field.type) {
        case "checkbox":
          schema = z.boolean();
          break;
        case "number":
          schema = z.coerce.number();
          break;
        default:
          schema = z.string();
      }
    }

    // 🔥 2. optional handling (final override)
    shape[field.name] = schema;
  });

  return z.object(shape);
};

const buildDefaultValues = (fields: FormFieldConfig[]) => {
  const defaults: Record<string, any> = {};

  fields.forEach((field) => {
    switch (field.type) {
      case "checkbox":
        defaults[field.name] = false;
        break;
      default:
        defaults[field.name] = "";
    }
  });

  return defaults;
};

const useDynamicForm = (fields: FormFieldConfig[]) => {
  const schema = useMemo(() => buildSchema(fields), [fields]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<Record<string, any>>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(fields),
  });

  return form;
};

export { useDynamicForm };
