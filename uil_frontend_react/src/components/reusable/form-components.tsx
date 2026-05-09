import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { MAX_FILE_SIZE_MB } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UseQueryResult } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { QueryState } from "./query-state-ui";
import XIconButton from "./x-icon-button";
import { Badge } from "../ui/badge";

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

export const RequiredFieldsDisclaimer = ({ className = "" }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      <Asterisk /> indicates required fields
    </p>
  );
};

type FormInputProps<T extends FieldValues> = BaseFormProps<T> & {
  type?: string;
  isNumber?: boolean;
  hidden?: boolean;
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
  const isCheckbox = type === "checkbox";

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          orientation={isCheckbox ? "horizontal" : "vertical"}
        >
          <FieldLabel
            htmlFor={field.name}
            className={cn("capitalize", isCheckbox && "flex-initial!")}
          >
            {label}
            {required && !isCheckbox && <Asterisk />}
          </FieldLabel>

          <Input
            {...field}
            id={field.name}
            type={type}
            placeholder={isCheckbox ? undefined : placeholder}
            // Use 'checked' for checkboxes, 'value' for everything else
            checked={isCheckbox ? !!field.value : undefined}
            value={isCheckbox ? undefined : (field.value ?? "")}
            className={cn(
              !isCheckbox && "py-5",
              isCheckbox && "h-4 w-4", // Checkboxes usually need fixed dimensions
              className,
            )}
            onChange={(e) => {
              // Checkboxes use e.target.checked
              if (isCheckbox) {
                field.onChange(e.target.checked);
              } else if (type === "number") {
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value),
                );
              } else {
                field.onChange(e.target.value);
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
  disabled?: boolean;
};

export const FormTextArea = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  desc,
  required,
  className,
  disabled,
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
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          className={cn("min-h-30", className)}
          disabled={disabled}
        />
        {desc && <FieldDescription>{desc}</FieldDescription>}
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
);

type FormComboboxProps<
  T extends FieldValues,
  Q = unknown,
> = BaseFormProps<T> & {
  orientation?: "vertical" | "horizontal" | "responsive";
  position?: "item-aligned" | "popper";
  multiple?: boolean;

  // static
  options?: { value: string | number; label: string }[];

  // dynamic
  query?: UseQueryResult<Q, Error>;
  children?: (
    data: Q,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
  checkEmpty?: (data: Q) => boolean;

  // search
  searchable?: boolean;
  onSearch?: (value: string | number) => void; // for server-side
  searchPlaceholder?: string;

  desc?: string;
  isNumber?: boolean;
  getDisplayValue?: (value: any, data?: Q) => string;
};

export const FormCombobox = <T extends FieldValues, Q = unknown>({
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
  className,
  isNumber,
  required,
  searchable = true,
  getDisplayValue,
  multiple = false,
}: FormComboboxProps<T, Q>) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  // Sync server-side search
  useEffect(() => {
    if (onSearch) onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const selectedValues = multiple
          ? Array.isArray(field.value)
            ? field.value
            : []
          : [field.value];

        const toggleValue = (value: string | number) => {
          if (!multiple) {
            field.onChange(isNumber ? Number(value) : value);
            setOpen(false);
            return;
          }

          const normalizedValue = isNumber ? Number(value) : value;

          const exists = selectedValues.some(
            (v) => String(v) === String(normalizedValue),
          );

          field.onChange(
            exists
              ? selectedValues.filter(
                  (v) => String(v) !== String(normalizedValue),
                )
              : [...selectedValues, normalizedValue],
          );
        };

        return (
          <Field orientation={orientation} data-invalid={fieldState.invalid}>
            <FieldContent className="flex-initial">
              <FieldLabel className="capitalize">
                {label}
                {required && <Asterisk />}
              </FieldLabel>
              {desc && <FieldDescription>{desc}</FieldDescription>}
              <FieldError errors={[fieldState.error]} />
            </FieldContent>

            <Popover key={name} open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("justify-between py-5 min-w-30", className)}
                >
                  {multiple
                    ? selectedValues.length > 0
                      ? `${selectedValues.length} selected`
                      : (placeholder ?? "Select...")
                    : field.value
                      ? (getDisplayValue?.(field.value, query?.data) ??
                        options?.find(
                          (opt) => String(opt.value) === String(field.value),
                        )?.label ??
                        "Selected")
                      : (placeholder ?? "Select...")}
                  <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command shouldFilter={!query}>
                  {searchable && (
                    <CommandInput
                      placeholder={searchPlaceholder ?? "Search..."}
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                  )}
                  <CommandList>
                    {/* --- Static Options --- */}
                    {!query && (
                      <>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {options?.map((opt) => (
                            <CommandItem
                              key={opt.value}
                              value={String(opt.label)}
                              onSelect={() => toggleValue(opt.value)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 w-4 h-4",
                                  selectedValues.some(
                                    (v) => String(v) === String(opt.value),
                                  )
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {opt.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}

                    {/* --- Dynamic Query --- */}
                    {query && children && checkEmpty && (
                      <QueryState
                        query={query}
                        checkEmpty={checkEmpty}
                        variant="small"
                      >
                        {(data) => children(data, setOpen)}
                      </QueryState>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {multiple && selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedValues.map((value) => {
                  // static options
                  const staticOption = options?.find(
                    (opt) => String(opt.value) === String(value),
                  );

                  // dynamic query results
                  const dynamicOption = query?.data?.results?.find?.(
                    (item: any) => String(item.id) === String(value),
                  );

                  const label =
                    staticOption?.label ??
                    (dynamicOption
                      ? (getDisplayValue?.(dynamicOption.id, query?.data) ??
                        dynamicOption.name ??
                        dynamicOption.label)
                      : value);

                  return (
                    <Badge
                      key={String(value)}
                      variant="secondary"
                      className="capitalize"
                    >
                      {label}
                    </Badge>
                  );
                })}
              </div>
            )}
          </Field>
        );
      }}
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
