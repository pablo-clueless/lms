"use client";

import { Mail01Icon } from "@hugeicons/core-free-icons";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

import { useGetApplicationForm } from "@/lib/api/cohort";
import { FormField } from "@/components/form-builder";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared";

type FormValues = Record<string, string | string[] | boolean>;
type Screen = "form" | "success";

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("application_form_id") as string;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formValues, setFormValues] = useState<FormValues>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screen, setScreen] = useState<Screen>("form");
  const { data, isPending } = useGetApplicationForm(id);

  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    if (!data) return false;

    const newErrors: Record<string, string> = {};

    data.data.fields.forEach((field) => {
      const value = formValues[field.id];

      if (field.validation.required) {
        if (value === undefined || value === "" || value === null) {
          newErrors[field.id] = field.validation.message || "This field is required";
        }
      }

      if (typeof value === "string" && value) {
        if (field.validation.min_length && value.length < field.validation.min_length) {
          newErrors[field.id] = `Minimum length is ${field.validation.min_length} characters`;
        }
        if (field.validation.max_length && value.length > field.validation.max_length) {
          newErrors[field.id] = `Maximum length is ${field.validation.max_length} characters`;
        }
      }

      if (field.type === "NUMBER" && value) {
        const numValue = Number(value);
        if (field.validation.min !== undefined && numValue < field.validation.min) {
          newErrors[field.id] = `Minimum value is ${field.validation.min}`;
        }
        if (field.validation.max !== undefined && numValue > field.validation.max) {
          newErrors[field.id] = `Maximum value is ${field.validation.max}`;
        }
      }

      if (field.validation.pattern && typeof value === "string" && value) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          newErrors[field.id] = field.validation.message || "Invalid format";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call to submit the application
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Application submitted successfully!");
      setFormValues({});
      setScreen("success");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) return <Loader isFullScreen />;

  if (!data)
    return (
      <div className="w-full p-10">
        <div className="container mx-auto max-w-4xl">
          <div className="flex h-screen w-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Application Form Not Found</h2>
              <p className="text-muted-foreground mt-2">The requested application form could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );

  if (screen === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="flex justify-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-green-100">
              <HugeiconsIcon icon={Mail01Icon} className="size-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Application Submitted Successfully!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for submitting your application. We have received your information and will review it shortly.
            </p>
          </div>

          <div className="bg-muted/50 mx-auto max-w-md space-y-4 rounded-lg border p-6">
            <div className="flex items-center justify-center gap-2">
              <HugeiconsIcon icon={Mail01Icon} className="text-primary size-5" />
              <h3 className="font-semibold">Check Your Email</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              A confirmation email has been sent to your registered email address. Please check your inbox (and spam folder) for further instructions and updates regarding your application.
            </p>
          </div>

          <div className="border-muted space-y-2 border-t pt-6">
            <p className="text-muted-foreground text-sm">
              If you have any questions or concerns, please don&apos;t hesitate to contact our support team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="container mx-auto max-w-4xl">
        <div className="flex w-full flex-col items-center gap-y-10">
          <h1 className="text-4xl font-bold">ArcLMS</h1>
          <div className="w-full space-y-2 text-center">
            <h3 className="text-2xl font-bold">{data.data.name}</h3>
            {data.data.description && <p className="text-muted-foreground text-lg">{data.data.description}</p>}
          </div>
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="bg-card grid w-full grid-cols-4 gap-6 rounded-lg border p-6">
              {data.data.fields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  value={formValues[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  error={errors[field.id]}
                />
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormValues({});
                  setErrors({});
                }}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
