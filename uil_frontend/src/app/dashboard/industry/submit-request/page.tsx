"use client";

import {
  FormInput,
  FormSelect,
  FormTextArea,
} from "@/components/dashboard/form-components-modified";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIndustryRequestCreateMutation } from "@/data/industry_requests/industry_request-create-mutation";
import {
  RequestPriority,
  requestPriorityOptions,
  RequestStatus,
  RequestType,
  requestTypeOptions,
} from "@/lib/enums";
import { formatSelectOptions } from "@/lib/utils";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
} from "@/validation/validation.industry_requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function SubmitRequest() {
  const form = useForm<IndustryRequestCreateInput>({
    resolver: zodResolver(industryRequestCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      type: RequestType.WORKSHOP,
      status: RequestStatus.PENDING,
      priority: RequestPriority.MEDIUM,
      budget_required: 0,
    },
  });

  const { mutate, isPending: isSubmitting } =
    useIndustryRequestCreateMutation();

  const onSubmit = async (data: IndustryRequestCreateInput) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="space-y-8 mx-auto pb-20 max-w-4xl">
      {/* Navigation */}
      <Link
        href="/dashboard/industry"
        className="group inline-flex items-center gap-2 font-bold text-muted-foreground hover:text-primary text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
          Submit New Request
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Complete the details below to initiate a formal collaboration request
          with university experts.
        </p>
      </div>

      <div>
        <form
          id="form-create-request"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <Card className="bg-card shadow-sm p-2 md:p-6 border-border/50 rounded-[2.5rem]">
            <CardContent className="space-y-8 pt-6">
              {/* Title - Input Text */}
              <FormInput
                form={form}
                name="title"
                label="Project Title"
                placeholder="Enter a descriptive title"
                type="text"
              />

              {/* Description - Text Area */}
              <FormTextArea
                form={form}
                name="description"
                label="Description"
                placeholder="Provide more details about the request..."
                desc="Briefly explain the scope of work."
              />

              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                {/* Type - Select */}
                <FormSelect
                  form={form}
                  name="type"
                  label="Request Type"
                  placeholder="Select type"
                  options={formatSelectOptions(requestTypeOptions)}
                />

                {/* Priority - Select */}
                <FormSelect
                  form={form}
                  name="priority"
                  label="Priority Level"
                  placeholder="Select priority"
                  options={formatSelectOptions(requestPriorityOptions)}
                />

                {/* Budget Required - Input Number */}
                <FormInput
                  form={form}
                  name="budget_required"
                  label="Budget Required"
                  placeholder="0.00"
                  type="number"
                />
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Form Actions */}
        <div className="flex sm:flex-row flex-col items-center gap-4 pt-4 border-border/40 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            form="form-create-request"
            className="shadow-lg shadow-primary/20 px-10 rounded-2xl w-full sm:w-auto h-12 font-bold transition-all"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="mr-2 w-4 h-4" />
                Submit Request
              </>
            )}
          </Button>
          <Link href="/dashboard/industry" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              className="hover:bg-accent px-10 rounded-2xl w-full sm:w-auto h-12 font-bold text-muted-foreground"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
