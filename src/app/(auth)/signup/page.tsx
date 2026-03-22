"use client";

import { useState } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper, type StepProps } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { CreateTenantDto } from "@/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";
import { Invoice03Icon, ManagerIcon, School01Icon } from "@hugeicons/core-free-icons";

const schema = Yup.object().shape({
  name: Yup.string().required("School name is required"),
  school_type: Yup.string().required("School type is required"),
  contact_email: Yup.string().email("Invalid email").required("School email is required"),
  address: Yup.string().required("Address is required"),
  principal_admin: Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Admin email is required")
      .test("not-same-as-school", "Admin email must be different from school email", function (value) {
        const { contact_email } = this.from?.[1]?.value || {};
        return value !== contact_email;
      }),
    phone: Yup.string().required("Phone number is required"),
  }),
  billing_contact: Yup.object().shape({
    name: Yup.string().required("Billing contact name is required"),
    email: Yup.string().email("Invalid email").required("Billing email is required"),
    phone: Yup.string().required("Billing phone is required"),
  }),
});

const initialValues: CreateTenantDto = {
  address: "",
  name: "",
  school_type: "",
  contact_email: "",
  logo: "",
  billing_contact: {
    name: "",
    email: "",
    phone: "",
  },
  principal_admin: {
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  },
};

const steps: StepProps[] = [
  { label: "School Info", index: 0, icon: School01Icon },
  { label: "Admin Details", index: 1, icon: ManagerIcon },
  { label: "Billing", index: 2, icon: Invoice03Icon },
];

const Page = () => {
  const [step, setStep] = useState(0);

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue, validateForm } =
    useFormik<CreateTenantDto>({
      initialValues,
      onSubmit: (values) => {
        console.log("Submitted:", values);
      },
      validationSchema: schema,
      validateOnBlur: true,
    });

  const getFieldError = (field: string) => {
    const keys = field.split(".");
    let error: unknown = errors;
    let touch: unknown = touched;

    for (const key of keys) {
      error = (error as Record<string, unknown>)?.[key];
      touch = (touch as Record<string, unknown>)?.[key];
    }

    return touch && error ? String(error) : undefined;
  };

  const validateStep = async (currentStep: number): Promise<boolean> => {
    const formErrors = await validateForm();

    if (currentStep === 0) {
      return !formErrors.name && !formErrors.school_type && !formErrors.contact_email && !formErrors.address;
    }
    if (currentStep === 1) {
      const adminErrors = formErrors.principal_admin as Record<string, string> | undefined;
      return !adminErrors?.first_name && !adminErrors?.last_name && !adminErrors?.email && !adminErrors?.phone;
    }
    if (currentStep === 2) {
      const billingErrors = formErrors.billing_contact as Record<string, string> | undefined;
      return !billingErrors?.name && !billingErrors?.email && !billingErrors?.phone;
    }
    return false;
  };

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (!isValid) return;

    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
  };

  const handleBack = () => {
    if (step === 1) setStep(0);
    else if (step === 2) setStep(1);
  };

  return (
    <div className="w-full max-w-2xl space-y-6 rounded-xl border bg-white p-6 shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800">Create your school</h2>
        <p className="text-sm text-neutral-600">Set up your school account in minutes</p>
      </div>

      <Stepper current={step} steps={steps} />

      <form className="space-y-4" onSubmit={handleSubmit}>
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-700">School Information</h3>
            <Input
              label="School Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={getFieldError("name")}
              placeholder="e.g. Greenfield Academy"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700">School Type</label>
              <Select value={values.school_type} onValueChange={(value) => setFieldValue("school_type", value)}>
                <SelectTrigger className={cn("w-full", getFieldError("school_type") ? "border-red-500" : "")}>
                  <SelectValue placeholder="Select school type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMARY">Primary School</SelectItem>
                  <SelectItem value="SECONDARY">Secondary School</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError("school_type") && <p className="text-xs text-red-500">{getFieldError("school_type")}</p>}
            </div>
            <Input
              label="School Email"
              name="contact_email"
              type="email"
              value={values.contact_email}
              onChange={handleChange}
              error={getFieldError("contact_email")}
              placeholder="e.g. info@greenfieldacademy.edu"
            />
            <Input
              label="School Address"
              name="address"
              value={values.address}
              onChange={handleChange}
              error={getFieldError("address")}
              placeholder="e.g. 123 Education Street, Lagos"
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-700">Principal Administrator</h3>
            <p className="text-xs text-neutral-500">This person will have full access to manage the school.</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="principal_admin.first_name"
                value={values.principal_admin.first_name}
                onChange={handleChange}
                error={getFieldError("principal_admin.first_name")}
                placeholder="John"
              />
              <Input
                label="Last Name"
                name="principal_admin.last_name"
                value={values.principal_admin.last_name}
                onChange={handleChange}
                error={getFieldError("principal_admin.last_name")}
                placeholder="Doe"
              />
            </div>
            <Input
              label="Admin Email"
              name="principal_admin.email"
              type="email"
              value={values.principal_admin.email}
              onChange={handleChange}
              error={getFieldError("principal_admin.email")}
              placeholder="admin@example.com"
            />
            <Input
              label="Phone Number"
              name="principal_admin.phone"
              type="tel"
              value={values.principal_admin.phone}
              onChange={handleChange}
              error={getFieldError("principal_admin.phone")}
              placeholder="+234 800 000 0000"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-700">Billing Contact</h3>
            <p className="text-xs text-neutral-500">This person will receive invoices and billing notifications.</p>
            <Input
              label="Contact Name"
              name="billing_contact.name"
              value={values.billing_contact.name}
              onChange={handleChange}
              error={getFieldError("billing_contact.name")}
              placeholder="Jane Smith"
            />
            <Input
              label="Billing Email"
              name="billing_contact.email"
              type="email"
              value={values.billing_contact.email}
              onChange={handleChange}
              error={getFieldError("billing_contact.email")}
              placeholder="billing@example.com"
            />
            <Input
              label="Billing Phone"
              name="billing_contact.phone"
              type="tel"
              value={values.billing_contact.phone}
              onChange={handleChange}
              error={getFieldError("billing_contact.phone")}
              placeholder="+234 800 000 0000"
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step !== 0 && (
            <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
              Back
            </Button>
          )}
          {step !== 2 ? (
            <Button type="button" className="flex-1" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit" className="flex-1">
              Create School
            </Button>
          )}
        </div>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/signin" className="link font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Page;
