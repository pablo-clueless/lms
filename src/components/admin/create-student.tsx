"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { type CreateEnrollmentDto, useCreateEnrollment } from "@/lib/api/enrollment";
import { useGetClasses } from "@/lib/api/class";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
  email: Yup.string().email("Invalid email address").required("Email is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  class_id: Yup.string().required("Class is required"),
  middle_name: Yup.string(),
  phone: Yup.string(),
});

const initialValues: CreateEnrollmentDto = {
  email: "",
  first_name: "",
  last_name: "",
  class_id: "",
  middle_name: "",
  phone: "",
};

export const CreateStudent = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createEnrollment, isPending } = useCreateEnrollment();
  const { data: classesData } = useGetClasses();

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      createEnrollment(values, {
        onSuccess: () => {
          toast.success("Student enrolled successfully");
          setOpen(false);
          formik.resetForm();
        },
        onError: () => {
          toast.error("Failed to enroll student");
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Student</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Create a new student account and enroll them in a class. They will receive an email to set up their account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First Name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.first_name ? formik.errors.first_name : undefined}
              required
            />
            <Input
              label="Last Name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.last_name ? formik.errors.last_name : undefined}
              required
            />
          </div>
          <Input
            label="Middle Name"
            name="middle_name"
            value={formik.values.middle_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : undefined}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Class <span className="text-destructive">*</span>
            </label>
            <Select value={formik.values.class_id} onValueChange={(value) => formik.setFieldValue("class_id", value)}>
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
            {formik.touched.class_id && formik.errors.class_id && (
              <p className="text-destructive text-sm">{formik.errors.class_id}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
