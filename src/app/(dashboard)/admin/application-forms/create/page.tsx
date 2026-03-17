"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useState } from "react";

import type { ApplicationFormFieldDto, CreateApplicationFormDto, FieldType } from "@/types";
import { Form, FormPallete, FormValidation } from "@/components/form-builder";
import { useCreateApplicationForm } from "@/lib/api/cohort";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const breadcrumbs = [
  { label: "Application Forms", href: "/admin/application-forms" },
  { label: "Create Application Form", href: "/admin/application-forms/create" },
];

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
});

const Page = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [fields, setFields] = useState<ApplicationFormFieldDto[]>([]);

  const { mutate: createForm, isPending } = useCreateApplicationForm();

  const handleAddField = (type: FieldType) => {
    const field: ApplicationFormFieldDto = {
      helper_text: "",
      label: "",
      name: `field_${fields.length + 1}`,
      order: fields.length + 1,
      placeholder: "",
      type,
      validation: {
        required: false,
      },
      width: 4,
    };
    setFields((prev) => [...prev, field]);
    setSelectedIndex(fields.length);
  };

  const handleRemoveField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else if (selectedIndex !== null && selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleSelectField = (index: number) => {
    setSelectedIndex(index);
  };

  const handleUpdateField = (index: number, field: ApplicationFormFieldDto) => {
    setFields((prev) => prev.map((f, i) => (i === index ? field : f)));
  };

  const handleReorderFields = (newFields: ApplicationFormFieldDto[]) => {
    setFields(newFields.map((f, i) => ({ ...f, order: i + 1 })));
  };

  const selectedField = selectedIndex !== null ? fields[selectedIndex] : null;

  const { handleChange, handleSubmit, values, errors, touched } = useFormik<Omit<CreateApplicationFormDto, "fields">>({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: (values) => {
      const payload: CreateApplicationFormDto = {
        ...values,
        fields: fields.map((f, i) => ({ ...f, order: i + 1 })),
      };
      createForm(payload, {
        onSuccess: () => {
          router.push("/admin/application-forms");
        },
      });
    },
    validationSchema: schema,
  });

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl font-semibold">Create Application Form</h3>
          <p className="text-muted-foreground text-sm">Create an application form template for cohort applications</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-full space-y-6">
          <div className="flex w-full items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex w-full items-center justify-between">
                <div className="w-1/2 space-y-1.5">
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter form name"
                    className={errors.name && touched.name ? "border-red-500" : ""}
                  />
                  {errors.name && touched.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="flex items-center gap-x-3">
                  <Button type="button" size="sm" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={isPending || fields.length === 0}>
                    {isPending ? "Saving..." : "Save Form"}
                  </Button>
                </div>
              </div>
              <Textarea
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                placeholder="Describe the purpose of this form"
                className="min-h-20"
              />
            </div>
          </div>

          <div className="grid w-full grid-cols-5 items-start gap-6">
            <div className="sticky top-6 self-start">
              <h4 className="mb-3 text-sm font-medium">Field Types</h4>
              <FormPallete onAddField={handleAddField} />
            </div>
            <div className="col-span-3">
              <h4 className="mb-3 text-sm font-medium">Form Canvas</h4>
              <Form
                fields={fields}
                selectedIndex={selectedIndex}
                onSelectField={handleSelectField}
                onRemoveField={handleRemoveField}
                onReorderFields={handleReorderFields}
              />
            </div>
            <div className="sticky top-6 max-h-[calc(100vh-8rem)] self-start overflow-y-auto">
              <h4 className="mb-3 text-sm font-medium">Field Settings</h4>
              <FormValidation
                selected={selectedField}
                selectedIndex={selectedIndex}
                onUpdateField={handleUpdateField}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
