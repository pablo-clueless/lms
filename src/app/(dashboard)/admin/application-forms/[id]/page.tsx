"use client";

import { ArrowLeft01Icon, File02Icon } from "@hugeicons/core-free-icons";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
// import { toast } from "sonner";
import * as Yup from "yup";

import { useGetApplicationForm, useUpdateApplicationForm } from "@/lib/api/cohort";
import { Form, FormPallete, FormValidation } from "@/components/form-builder";
import type { ApplicationFormFieldDto, CreateApplicationFormDto, FieldType } from "@/types";
import { Breadcrumb, Loader } from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib";

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
});

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data: formData, isPending } = useGetApplicationForm(id);
  const form = formData?.data;
  const updateForm = useUpdateApplicationForm(id);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [fields, setFields] = useState<ApplicationFormFieldDto[]>([]);
  const prevFormDataRef = useRef<typeof formData>(undefined);

  useEffect(() => {
    if (formData?.data.fields && formData !== prevFormDataRef.current && fields.length === 0) {
      prevFormDataRef.current = formData;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFields(formData.data.fields);
    }
  }, [formData, fields.length]);

  const breadcrumbs = [
    { label: "Application Forms", href: "/admin/application-forms" },
    { label: "Edit Form", href: `/admin/application-forms/${id}` },
  ];

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

  const { handleChange, handleSubmit, values } = useFormik<CreateApplicationFormDto>({
    initialValues: {
      name: formData?.data.name || "",
      description: formData?.data.description || "",
      fields: formData?.data.fields || [],
    },
    onSubmit: (values) => {
      const payload: CreateApplicationFormDto = {
        ...values,
        fields: fields.map((f, i) => ({ ...f, order: i + 1 })),
      };
      updateForm.mutateAsync(payload, {
        onSuccess: () => {
          router.push("/admin/application-forms");
        },
      });
    },
    validationSchema: schema,
  });

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/application-forms")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Forms
      </Button>
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl font-semibold">Edit Application Form</h3>
          <p className="text-muted-foreground text-sm">Modify your application form template</p>
        </div>
      </div>
      <div className="bg-card rounded-xl border p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <HugeiconsIcon icon={File02Icon} className="text-primary size-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Created</p>
            <p className="text-sm font-medium">{formatDate(form?.created_at)}</p>
          </div>
          <div className="ml-4">
            <p className="text-muted-foreground text-xs">Last Updated</p>
            <p className="text-sm font-medium">{formatDate(form?.updated_at)}</p>
          </div>
        </div>
      </div>
      <form className="w-full space-y-6" onSubmit={handleSubmit}>
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
                />
              </div>
              <div className="flex items-center gap-x-3">
                <Button type="button" size="sm" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button disabled={updateForm.isPending || fields.length === 0} size="sm" type="submit">
                  {updateForm.isPending ? "Saving..." : "Save Form"}
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
            <FormValidation selected={selectedField} selectedIndex={selectedIndex} onUpdateField={handleUpdateField} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
