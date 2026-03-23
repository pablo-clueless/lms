"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCreateTerm } from "@/lib/api/term";
import type { CreateTermDto } from "@/types";
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
  name: Yup.string().oneOf(["FIRST", "SECOND", "THIRD"]).required("Term is required"),
  start_date: Yup.string().required("Start date is required"),
  end_date: Yup.string()
    .required("End date is required")
    .test("is-after", "End date must be after start date", function (value) {
      const { start_date } = this.parent;
      if (!value || !start_date) return true;
      return new Date(value) > new Date(start_date);
    }),
});

const initialValues: CreateTermDto = {
  name: "FIRST",
  start_date: "",
  end_date: "",
};

interface CreateTermProps {
  sessionId: string;
  trigger?: React.ReactNode;
}

export const CreateTerm = ({ sessionId, trigger }: CreateTermProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: createTerm, isPending } = useCreateTerm(sessionId);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      createTerm(values, {
        onSuccess: () => {
          toast.success("Term created successfully");
          setOpen(false);
          formik.resetForm();
        },
        onError: () => {
          toast.error("Failed to create term");
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Add Term</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Term</DialogTitle>
          <DialogDescription>
            Add a new term to this session. Terms organize the academic calendar within a session.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Term <span className="text-destructive">*</span>
            </label>
            <Select value={formik.values.name} onValueChange={(value) => formik.setFieldValue("name", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIRST">First Term</SelectItem>
                <SelectItem value="SECOND">Second Term</SelectItem>
                <SelectItem value="THIRD">Third Term</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.name && formik.errors.name && (
              <p className="text-destructive text-sm">{formik.errors.name}</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Date"
              name="start_date"
              type="date"
              value={formik.values.start_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.start_date ? formik.errors.start_date : undefined}
              required
            />
            <Input
              label="End Date"
              name="end_date"
              type="date"
              value={formik.values.end_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.end_date ? formik.errors.end_date : undefined}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Term"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
