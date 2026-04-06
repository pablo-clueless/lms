"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, TextEditor } from "@/components/shared";
import { useComposeEmail } from "@/lib/api/communication";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useGetClasses } from "@/lib/api/class";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateEmailDto } from "@/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const RECIPIENT_SCOPES = [{ label: "Class", value: "CLASS" }] as const;

const schema = Yup.object({
  subject: Yup.string().required("Subject is required"),
  body: Yup.string().required("Body is required"),
  recipient_scope: Yup.string()
    .oneOf(["ALL_USERS", "ALL_TUTORS", "ALL_STUDENTS", "CLASS"])
    .required("Recipient scope is required"),
  target_class_id: Yup.string().when("recipient_scope", {
    is: "CLASS",
    then: (schema) => schema.required("Class is required when scope is CLASS"),
  }),
});

const initialValues: CreateEmailDto = {
  subject: "",
  body: "",
  html_body: "",
  recipient_scope: "CLASS",
  target_class_id: undefined,
  target_course_id: undefined,
  specific_user_ids: undefined,
  send_immediately: false,
};

const breadcrumbs = [
  { label: "Inbox", href: "/tutor/communications" },
  { label: "New Email", href: "/tutor/communications/create" },
];

const Page = () => {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: classesData, isPending: classesLoading } = useGetClasses({ limit: 100 });
  const composeEmail = useComposeEmail();

  const classes = classesData?.classes ?? [];

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await composeEmail.mutateAsync(values);
        if (values.send_immediately) {
          toast.success("Email sent successfully");
        } else {
          toast.success("Email saved as draft");
        }
        router.push("/admin/communications");
      } catch {
        toast.error("Failed to create email");
      }
    },
  });

  const handleBodyChange = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    formik.setFieldValue("body", plainText);
    formik.setFieldValue("html_body", html);
  };

  const isSubmitting = composeEmail.isPending;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">New Email</h3>
          <p className="text-sm font-medium text-gray-600">Compose and send emails to users</p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="recipient_scope">
              Recipients
            </Label>
            <Select
              disabled
              value={formik.values.recipient_scope}
              onValueChange={(value) => {
                formik.setFieldValue("recipient_scope", value);
                if (value !== "CLASS") {
                  formik.setFieldValue("target_class_id", undefined);
                }
              }}
            >
              <SelectTrigger className="w-75" id="recipient_scope">
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                {RECIPIENT_SCOPES.map((scope) => (
                  <SelectItem key={scope.value} value={scope.value}>
                    {scope.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.recipient_scope && formik.errors.recipient_scope && (
              <p className="text-sm text-red-500">{formik.errors.recipient_scope}</p>
            )}
          </div>
          {formik.values.recipient_scope === "CLASS" && (
            <div className="space-y-2">
              <Label className="text-foreground" htmlFor="target_class_id">
                Class
              </Label>
              <Select
                value={formik.values.target_class_id || ""}
                onValueChange={(value) => formik.setFieldValue("target_class_id", value)}
                disabled={classesLoading}
              >
                <SelectTrigger className="w-75" id="target_class_id">
                  <SelectValue placeholder={classesLoading ? "Loading classes..." : "Select a class"} />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.target_class_id && formik.errors.target_class_id && (
                <p className="text-sm text-red-500">{formik.errors.target_class_id}</p>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-foreground" htmlFor="subject">
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            placeholder="Enter email subject"
            value={formik.values.subject}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.subject && formik.errors.subject && (
            <p className="text-sm text-red-500">{formik.errors.subject}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Body</Label>
          <TextEditor
            value={formik.values.html_body}
            onValueChange={handleBodyChange}
            editable
            editorClassName="min-h-64"
          />
          {formik.touched.body && formik.errors.body && <p className="text-sm text-red-500">{formik.errors.body}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="send_immediately"
            checked={formik.values.send_immediately}
            onCheckedChange={(checked) => formik.setFieldValue("send_immediately", checked)}
          />
          <Label htmlFor="send_immediately" className="text-foreground cursor-pointer text-sm font-normal">
            Send immediately after saving
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : formik.values.send_immediately ? "Send Email" : "Save as Draft"}
          </Button>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" disabled={!formik.values.subject && !formik.values.html_body}>
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{formik.values.subject || "No Subject"}</DialogTitle>
                <DialogDescription>
                  To: {RECIPIENT_SCOPES.find((s) => s.value === formik.values.recipient_scope)?.label || "Recipients"}
                  {formik.values.recipient_scope === "CLASS" &&
                    formik.values.target_class_id &&
                    ` - ${classes.find((c) => c.id === formik.values.target_class_id)?.name || ""}`}
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto border-t pt-4">
                {formik.values.html_body ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formik.values.html_body }}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">No content</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/communications")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
