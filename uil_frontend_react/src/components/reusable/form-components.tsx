import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
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
import { MAX_FILE_SIZE_MB } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import XIconButton from "./x-icon-button";
import { UseQueryResult } from "@tanstack/react-query";
import { QueryState } from "./query-state-ui";
import { useDebounce } from "@/hooks/use-debounce";

type BaseFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>; // This ensures 'name' is a valid key of your schema
  placeholder?: string;
  className?: string;
  required?: boolean; // Add this
};

export const Asterisk = () => (
  <span className="mt-1 font-medium text-destructive">*</span>
);

export const RequiredFieldsDisclaimer = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      <Asterisk /> indicates required fields
    </p>
  );
};

type FormInputProps<T extends FieldValues> = BaseFormProps<T> & {
  type?: string;
  isNumber?: boolean;
};

export const FormInput = <T extends FieldValues>({
  form,
  label,
  name,
  placeholder,
  type = "text",
  required,
  className,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name} className="capitalize">
            {label}
            {required && <Asterisk />}
          </FieldLabel>
          <Input
            {...field}
            id={field.name}
            required={required}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className={cn("py-5", className)}
            value={field.value ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              if (type === "number") {
                field.onChange(value === "" ? null : Number(value));
              } else {
                field.onChange(value);
              }
            }}
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
  required,
  className,
}: FormTextAreaProps<T>) => (
  <Controller
    name={name}
    control={form.control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={field.name} className="capitalize">
          {label}
          {required && <Asterisk />}
        </FieldLabel>
        <Textarea
          {...field}
          id={field.name}
          required={required}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          className={cn("min-h-30", className)}
        />
        {desc && <FieldDescription>{desc}</FieldDescription>}
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
);

type FormSelectProps<T extends FieldValues, Q = unknown> = BaseFormProps<T> & {
  orientation?: "vertical" | "horizontal" | "responsive";
  position?: "item-aligned" | "popper";

  // static
  options?: { value: string | number; label: string }[];

  // dynamic
  query?: UseQueryResult<Q, Error>;
  children?: (data: Q, search: string) => React.ReactNode;
  checkEmpty?: (data: Q) => boolean;

  // search
  searchable?: boolean;
  onSearch?: (value: string | number) => void; // for server-side
  searchPlaceholder?: string;

  desc?: string;
  isNumber?: boolean;
};

export const FormSelect = <T extends FieldValues, Q = unknown>({
  form,
  name,
  label,
  options,
  query,
  children,
  checkEmpty,
  onSearch,
  searchPlaceholder,
  orientation,
  desc,
  placeholder,
  position,
  className,
  isNumber,
  required,
  searchable,
}: FormSelectProps<T, Q>) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!query || !onSearch) return;
    onSearch(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const filteredOptions = useMemo(() => {
    if (!options) return [];

    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation={orientation} data-invalid={fieldState.invalid}>
          <FieldContent className="flex-initial">
            <FieldLabel htmlFor={field.name} className="capitalize">
              {label}
              {required && <Asterisk />}
            </FieldLabel>
            {desc && <FieldDescription>{desc}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select
            name={field.name}
            required={required}
            value={
              field.value !== undefined && field.value !== null
                ? String(field.value)
                : ""
            }
            onValueChange={(val) => {
              // Cast back to number if requested
              field.onChange(isNumber ? Number(val) : val);
            }}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              className={cn("py-5 min-w-30", className)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position={position}>
              {/* 🔍 Search input */}
              {searchable && (
                <div className="p-2">
                  <Input
                    placeholder={searchPlaceholder ?? "Search..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8"
                  />
                </div>
              )}

              {/* -------- STATIC (client search always) -------- */}
              {!query &&
                (filteredOptions.length ? (
                  filteredOptions.map(({ value, label }, idx) => (
                    <SelectItem key={`${value}-${idx}`} value={String(value)}>
                      {label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-muted-foreground text-sm">
                    No results found
                  </div>
                ))}

              {/* -------- QUERY -------- */}
              {query && children && checkEmpty && (
                <QueryState query={query} checkEmpty={checkEmpty}>
                  {(data) => children(data, search)}
                </QueryState>
              )}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
};

type FormUploadFileProps<T extends FieldValues> = BaseFormProps<T> & {
  desc?: string;
  accept?: string;
  maxSizeMB?: number;
};

export const FormUploadFile = <T extends FieldValues>({
  form,
  name,
  label,
  desc,
  className,
  accept = "*/*",
  maxSizeMB = MAX_FILE_SIZE_MB,
  required,
}: FormUploadFileProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const value = field.value as File | null | undefined | string;
        const isFileInstance = value instanceof File;
        const isExistingFile = typeof value === "string" && value.length > 0;

        const handleFileAction = (files: FileList | null) => {
          const file = files?.[0] || null;
          field.onChange(file);
        };

        const handleRemove = (e?: React.MouseEvent) => {
          e?.stopPropagation(); // Prevent opening the file dialog
          field.onChange(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input value
          }
        };

        return (
          <Field
            data-invalid={fieldState.invalid}
            className={cn("px-0", className)}
          >
            <FieldLabel htmlFor={field.name} className="capitalize">
              {label}
              {required && <Asterisk />}
            </FieldLabel>

            <div
              className={cn(
                "group relative flex flex-col justify-center items-center p-8 border-2 border-dashed rounded-md text-center transition-all cursor-pointer",
                fieldState.invalid
                  ? "border-destructive bg-destructive/5"
                  : "border-border hover:bg-accent/50 hover:border-primary/50",
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFileAction(e.dataTransfer.files);
              }}
            >
              {/* Remove Button */}
              {(isFileInstance || isExistingFile) && (
                <XIconButton
                  onRemove={handleRemove}
                  className="top-2 right-2 absolute"
                />
              )}

              <div className="bg-muted mb-2 p-3 rounded-full">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <p className="font-medium text-foreground text-sm">
                  {isFileInstance ? (
                    <span className="font-semibold text-primary break-all">
                      {value.name}
                    </span>
                  ) : isExistingFile ? (
                    <span className="font-semibold text-primary break-all">
                      {/* Extract filename from URL or just show "Existing Attachment" */}
                      {value.split("/").pop()}
                    </span>
                  ) : (
                    "Choose a file or drag & drop"
                  )}
                </p>

                <p className="text-muted-foreground text-xs">
                  {value instanceof File ? (
                    <span>({(value.size / 1024 / 1024).toFixed(2)} MB)</span>
                  ) : (
                    <span>Any file up to {maxSizeMB}MB</span>
                  )}
                </p>
              </div>

              <input
                type="file"
                id={field.name}
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                onChange={(e) => handleFileAction(e.target.files)}
              />
            </div>

            {desc && <FieldDescription>{desc}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

type FormSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const FormSection = ({
  title,
  description,
  children,
}: FormSectionProps) => (
  <section className="space-y-4">
    <div className="pb-2 border-b">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    <div className="space-y-2">{children}</div>
  </section>
);
