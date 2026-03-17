"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (admin: CreateUserDto) => Promise<void>;
  isPending: boolean;
}

interface AdminFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  { id: "users:read", label: "View Users" },
  { id: "users:write", label: "Manage Users" },
  { id: "courses:read", label: "View Courses" },
  { id: "courses:write", label: "Manage Courses" },
  { id: "cohorts:read", label: "View Cohorts" },
  { id: "cohorts:write", label: "Manage Cohorts" },
  { id: "applications:read", label: "View Applications" },
  { id: "applications:write", label: "Manage Applications" },
  { id: "sessions:read", label: "View Sessions" },
  { id: "sessions:write", label: "Manage Sessions" },
  { id: "reports:read", label: "View Reports" },
  { id: "settings:write", label: "Manage Settings" },
];

const initialAdmin: AdminFormState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  permissions: [],
};

export const CreateAdminDialog = ({ open, onOpenChange, onSubmit, isPending }: CreateAdminDialogProps) => {
  const [admin, setAdmin] = useState(initialAdmin);
  const user = useUserStore((state) => state.user);
  const tenantId = user?.tenant_id || "";

  const handlePermissionToggle = (permissionId: string) => {
    setAdmin((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSubmit = async () => {
    const payload: CreateUserDto = {
      name: admin.name,
      email: admin.email,
      password: admin.password,
      role: "ADMIN",
      tenant_id: tenantId,
      permissions: admin.permissions,
      profile: {
        phone: admin.phone,
        gender: admin.gender,
        date_of_birth: "",
        avatar: "",
        bio: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      },
    };
    await onSubmit(payload);
    setAdmin(initialAdmin);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setAdmin(initialAdmin);
    }
    onOpenChange(value);
  };

  const isValid = admin.name && admin.email && admin.password && admin.permissions.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogDescription>Add a new administrator to the system.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={admin.name}
              onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email"
              type="email"
              value={admin.email}
              onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              placeholder="admin@example.com"
              required
            />
          </div>
          <Input
            label="Password"
            type="password"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            placeholder="Enter password"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone Number"
              value={admin.phone}
              onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Gender</label>
              <Select value={admin.gender} onValueChange={(value) => setAdmin({ ...admin, gender: value })}>
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

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Permissions <span className="text-destructive">*</span>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={admin.permissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                  <label
                    htmlFor={permission.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
            {admin.permissions.length === 0 && (
              <p className="text-destructive text-xs">Select at least one permission</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isValid}>
            {isPending ? "Creating..." : "Create Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
