"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

import { useInviteUser } from "@/lib/api/user";
import type { InviteUserDto } from "@/types";
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
  middle_name: Yup.string(),
  phone: Yup.string(),
});

const initialValues: InviteUserDto = {
  email: "",
  role: "ADMIN",
  first_name: "",
  last_name: "",
  middle_name: "",
  phone: "",
};

export const CreateAdmin = () => {
  const [open, setOpen] = useState(false);
  const { mutate: inviteUser, isPending } = useInviteUser();

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      inviteUser(values, {
        onSuccess: () => {
          toast.success("Admin invited successfully");
          setOpen(false);
          formik.resetForm();
        },
        onError: () => {
          toast.error("Failed to invite admin");
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Invite a new administrator to the platform. They will receive an email to set up their account.
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Inviting..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
