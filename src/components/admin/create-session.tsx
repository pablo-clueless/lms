"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCreateSession } from "@/lib/api/session";
import type { CreateSessionDto } from "@/types";
import { Textarea } from "../ui/textarea";
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

const currentYear = new Date().getFullYear();

const schema = Yup.object({
  label: Yup.string().required("Label is required"),
  start_year: Yup.number()
    .required("Start year is required")
    .min(2000, "Start year must be after 2000")
    .max(2100, "Start year must be before 2100"),
  end_year: Yup.number()
    .required("End year is required")
    .min(2000, "End year must be after 2000")
    .max(2100, "End year must be before 2100")
    .test("is-greater", "End year must be after start year", function (value) {
      const { start_year } = this.parent;
      return !value || !start_year || value > start_year;
    }),
  description: Yup.string(),
  status: Yup.string().oneOf(["DRAFT", "ACTIVE", "ARCHIVED"]).required("Status is required"),
});

const initialValues: CreateSessionDto = {
  label: "",
  start_year: currentYear,
  end_year: currentYear + 1,
  description: "",
  status: "DRAFT",
};

export const CreateSession = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createSession, isPending } = useCreateSession();

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      createSession(values, {
        onSuccess: () => {
          toast.success("Session created successfully");
          setOpen(false);
          formik.resetForm();
        },
        onError: () => {
          toast.error("Failed to create session");
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>
            Create a new academic session. Sessions organize terms and academic years.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            label="Session Label"
            name="label"
            placeholder="e.g., 2024/2025 Academic Session"
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.label ? formik.errors.label : undefined}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Year"
              name="start_year"
              type="number"
              value={formik.values.start_year}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.start_year ? formik.errors.start_year : undefined}
              required
            />
            <Input
              label="End Year"
              name="end_year"
              type="number"
              value={formik.values.end_year}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.end_year ? formik.errors.end_year : undefined}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Status <span className="text-destructive">*</span>
            </label>
            <Select value={formik.values.status} onValueChange={(value) => formik.setFieldValue("status", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Optional description for this session..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
