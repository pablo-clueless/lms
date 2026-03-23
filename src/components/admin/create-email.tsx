"use client";

import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useComposeEmail } from "@/lib/api/communication";
import { useGetClasses } from "@/lib/api/class";
import type { CreateEmailDto } from "@/types";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";

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
  recipient_scope: "ALL_USERS",
  target_class_id: undefined,
  target_course_id: undefined,
  specific_user_ids: undefined,
};

export const CreateEmail = () => {
  const [open, setOpen] = useState(false);
  const { mutate: composeEmail, isPending } = useComposeEmail();
  const { data: classesData } = useGetClasses();

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        html_body: values.body,
      };
      composeEmail(payload, {
        onSuccess: () => {
          toast.success("Email draft created successfully");
          setOpen(false);
          formik.resetForm();
        },
        onError: () => {
          toast.error("Failed to create email draft");
        },
      });
    },
  });

  const showClassSelector = formik.values.recipient_scope === "CLASS";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Email</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
          <DialogDescription>
            Create a new email to send to users. The email will be saved as a draft until you send it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Recipients <span className="text-destructive">*</span>
            </label>
            <Select
              value={formik.values.recipient_scope}
              onValueChange={(value) => {
                formik.setFieldValue("recipient_scope", value);
                if (value !== "CLASS") {
                  formik.setFieldValue("target_class_id", undefined);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_USERS">All Users</SelectItem>
                <SelectItem value="ALL_TUTORS">All Tutors</SelectItem>
                <SelectItem value="ALL_STUDENTS">All Students</SelectItem>
                <SelectItem value="CLASS">Specific Class</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.recipient_scope && formik.errors.recipient_scope && (
              <p className="text-destructive text-sm">{formik.errors.recipient_scope}</p>
            )}
          </div>

          {showClassSelector && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Class <span className="text-destructive">*</span>
              </label>
              <Select
                value={formik.values.target_class_id || ""}
                onValueChange={(value) => formik.setFieldValue("target_class_id", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classesData?.classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.target_class_id && formik.errors.target_class_id && (
                <p className="text-destructive text-sm">{formik.errors.target_class_id}</p>
              )}
            </div>
          )}

          <Input
            label="Subject"
            name="subject"
            placeholder="Enter email subject..."
            value={formik.values.subject}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subject ? formik.errors.subject : undefined}
            required
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Message <span className="text-destructive">*</span>
            </label>
            <Textarea
              name="body"
              placeholder="Write your message here..."
              value={formik.values.body}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={8}
            />
            {formik.touched.body && formik.errors.body && (
              <p className="text-destructive text-sm">{formik.errors.body}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Draft"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
