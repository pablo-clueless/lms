"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateTenantDto } from "@/types";

interface CreateTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tenant: CreateTenantDto) => Promise<void>;
  isPending: boolean;
}

const initialTenant: CreateTenantDto = {
  name: "",
  slug: "",
  description: "",
  logo: "",
  website: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  settings: "",
  admin_name: "",
  admin_email: "",
  admin_password: "",
};

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const CreateTenantDialog = ({ open, onOpenChange, onSubmit, isPending }: CreateTenantDialogProps) => {
  const [tenant, setTenant] = useState(initialTenant);
  const [emailError, setEmailError] = useState("");

  const handleNameChange = (name: string) => {
    setTenant((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleTenantEmailChange = (email: string) => {
    setTenant((prev) => ({ ...prev, email }));
    if (email && email === tenant.admin_email) {
      setEmailError("Tenant email and admin email cannot be the same");
    } else {
      setEmailError("");
    }
  };

  const handleAdminEmailChange = (admin_email: string) => {
    setTenant((prev) => ({ ...prev, admin_email }));
    if (admin_email && admin_email === tenant.email) {
      setEmailError("Tenant email and admin email cannot be the same");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async () => {
    if (tenant.email === tenant.admin_email) {
      setEmailError("Tenant email and admin email cannot be the same");
      return;
    }
    await onSubmit(tenant);
    setTenant(initialTenant);
    setEmailError("");
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setTenant(initialTenant);
      setEmailError("");
    }
    onOpenChange(value);
  };

  const isValid =
    tenant.name && tenant.email && tenant.admin_name && tenant.admin_email && tenant.admin_password && !emailError;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>Add a new tenant to the system with an initial admin account.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-sm font-medium">Tenant Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Tenant Name"
                  value={tenant.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter tenant name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Slug"
                  value={tenant.slug}
                  onChange={(e) => setTenant({ ...tenant, slug: e.target.value })}
                  placeholder="tenant-slug"
                  helperText="URL-friendly identifier (auto-generated)"
                />
              </div>
              <Input
                label="Tenant Email"
                type="email"
                value={tenant.email}
                onChange={(e) => handleTenantEmailChange(e.target.value)}
                placeholder="contact@tenant.com"
                required
                error={emailError && tenant.email === tenant.admin_email ? emailError : undefined}
              />
              <Input
                label="Phone"
                value={tenant.phone}
                onChange={(e) => setTenant({ ...tenant, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
              <div className="sm:col-span-2">
                <Input
                  label="Website"
                  value={tenant.website}
                  onChange={(e) => setTenant({ ...tenant, website: e.target.value })}
                  placeholder="https://tenant.com"
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Logo URL"
                  value={tenant.logo}
                  onChange={(e) => setTenant({ ...tenant, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  value={tenant.description}
                  onChange={(e) => setTenant({ ...tenant, description: e.target.value })}
                  placeholder="Brief description of the tenant"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-medium">Admin Account</h4>
            <p className="text-muted-foreground mb-3 text-xs">
              Create an initial administrator account for this tenant.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Admin Name"
                  value={tenant.admin_name}
                  onChange={(e) => setTenant({ ...tenant, admin_name: e.target.value })}
                  placeholder="Enter admin name"
                  required
                />
              </div>
              <Input
                label="Admin Email"
                type="email"
                value={tenant.admin_email}
                onChange={(e) => handleAdminEmailChange(e.target.value)}
                placeholder="admin@tenant.com"
                required
                error={emailError && tenant.admin_email === tenant.email ? emailError : undefined}
              />
              <Input
                label="Admin Password"
                type="password"
                value={tenant.admin_password}
                onChange={(e) => setTenant({ ...tenant, admin_password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isValid}>
            {isPending ? "Creating..." : "Create Tenant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
