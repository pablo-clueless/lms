"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateUserDto } from "@/types";
import { useUserStore } from "@/store/core/user";

interface CreateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (student: CreateUserDto) => Promise<void>;
  isPending: boolean;
}

interface StudentFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  student_number: string;
  enrollment_date: string;
}

const initialStudent: StudentFormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  student_number: "",
  enrollment_date: "",
};

export const CreateStudentDialog = ({ open, onOpenChange, onSubmit, isPending }: CreateStudentDialogProps) => {
  const [student, setStudent] = useState(initialStudent);
  const user = useUserStore((state) => state.user);
  const tenantId = user?.tenant_id || "";

  const handleSubmit = async () => {
    const payload: CreateUserDto = {
      name: student.name,
      email: student.email,
      password: student.password,
      role: "STUDENT",
      tenant_id: tenantId,
      profile: {
        phone: student.phone || undefined,
        gender: student.gender || undefined,
      },
      student: {
        student_number: student.student_number,
        enrollment_date: student.enrollment_date,
      },
    };
    await onSubmit(payload);
    setStudent(initialStudent);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setStudent(initialStudent);
    }
    onOpenChange(value);
  };

  const isValid = student.name && student.email && student.password && student.student_number && student.enrollment_date;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
          <DialogDescription>Add a new student to the system.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={student.name}
              onChange={(e) => setStudent({ ...student, name: e.target.value })}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email"
              type="email"
              value={student.email}
              onChange={(e) => setStudent({ ...student, email: e.target.value })}
              placeholder="student@example.com"
              required
            />
          </div>
          <Input
            label="Password"
            type="password"
            value={student.password}
            onChange={(e) => setStudent({ ...student, password: e.target.value })}
            placeholder="Enter password"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone Number"
              value={student.phone}
              onChange={(e) => setStudent({ ...student, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Gender</label>
              <Select value={student.gender} onValueChange={(value) => setStudent({ ...student, gender: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Student Number"
              value={student.student_number}
              onChange={(e) => setStudent({ ...student, student_number: e.target.value })}
              placeholder="STU-001"
              required
            />
            <Input
              label="Enrollment Date"
              type="date"
              value={student.enrollment_date}
              onChange={(e) => setStudent({ ...student, enrollment_date: e.target.value })}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isValid}>
            {isPending ? "Creating..." : "Create Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
