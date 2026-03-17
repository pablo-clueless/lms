"use client";

import { useState } from "react";
import {
  ArrowLeft01Icon,
  Edit02Icon,
  Globe02Icon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetTenant, useUpdateTenant } from "@/lib/api/tenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TenantStatus } from "@/types";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="text-foreground text-sm font-medium">{value || "—"}</p>
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: typeof Mail01Icon; label: string; value?: string }) => (
  <div className="flex items-start gap-3">
    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
      <HugeiconsIcon icon={icon} className="text-muted-foreground size-5" />
    </div>
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-foreground text-sm font-medium">{value || "Not set"}</p>
    </div>
  </div>
);

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data, isFetching } = useGetTenant(id);
  const updateTenant = useUpdateTenant(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editSettingsOpen, setEditSettingsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    status: "" as TenantStatus,
  });
  const [settingsForm, setSettingsForm] = useState({
    max_students: 0,
    max_courses: 0,
    max_tutors: 0,
    default_timezone: "",
    allow_self_registration: false,
  });

  const breadcrumbs = [
    { label: "Tenants", href: "/superadmin/tenants" },
    { label: "Tenant Details", href: `/superadmin/tenants/${id}` },
  ];

  const openEditBasic = () => {
    if (data?.data) {
      const tenant = data.data;
      setEditForm({
        name: tenant.name || "",
        description: tenant.description || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        website: tenant.website || "",
        address: tenant.address || "",
        city: tenant.city || "",
        state: tenant.state || "",
        country: tenant.country || "",
        status: tenant.status,
      });
    }
    setEditOpen(true);
  };

  const openEditSettings = () => {
    if (data?.data?.settings) {
      const settings = data.data.settings;
      setSettingsForm({
        max_students: settings.max_students || 0,
        max_courses: settings.max_courses || 0,
        max_tutors: settings.max_tutors || 0,
        default_timezone: settings.default_timezone || "",
        allow_self_registration: settings.allow_self_registration || false,
      });
    }
    setEditSettingsOpen(true);
  };

  const handleUpdateBasic = async () => {
    await updateTenant.mutateAsync(editForm);
    setEditOpen(false);
  };

  const handleUpdateSettings = async () => {
    await updateTenant.mutateAsync({ settings: settingsForm } as never);
    setEditSettingsOpen(false);
  };

  if (isFetching) return <Loader />;

  const tenant = data?.data;
  const initials = tenant?.name?.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/superadmin/tenants")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Tenants
      </Button>

      {/* Tenant Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="border-background size-24 border-4 shadow-lg">
                <AvatarImage src={tenant?.logo} alt={tenant?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{tenant?.name}</h2>
                <p className="text-muted-foreground text-sm">{tenant?.slug}</p>
                <div className="mt-1">{tenant?.status && <StatusBadge status={tenant.status} />}</div>
              </div>
            </div>
            <Button variant="outline" onClick={openEditBasic}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Details
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {tenant?.description && (
        <div className="bg-card rounded-xl border p-6">
          <p className="text-muted-foreground text-sm">{tenant.description}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="space-y-4">
            <InfoItem icon={Mail01Icon} label="Email" value={tenant?.email} />
            <InfoItem icon={Call02Icon} label="Phone" value={tenant?.phone} />
            <InfoItem icon={Globe02Icon} label="Website" value={tenant?.website} />
            <InfoItem
              icon={Location01Icon}
              label="Address"
              value={
                [tenant?.address, tenant?.city, tenant?.state, tenant?.country].filter(Boolean).join(", ") || undefined
              }
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Settings</h3>
            <Button variant="outline" size="sm" onClick={openEditSettings}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Max Students" value={tenant?.settings?.max_students} />
            <Field label="Max Courses" value={tenant?.settings?.max_courses} />
            <Field label="Max Tutors" value={tenant?.settings?.max_tutors} />
            <Field label="Timezone" value={tenant?.settings?.default_timezone} />
            <Field
              label="Self Registration"
              value={tenant?.settings?.allow_self_registration ? "Enabled" : "Disabled"}
            />
          </div>
        </div>

        {/* Branding */}
        <div className="bg-card space-y-4 rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold">Branding</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Primary Color" value={tenant?.settings?.primary_color} />
            <Field label="Secondary Color" value={tenant?.settings?.secondary_color} />
            <Field label="Accent Color" value={tenant?.settings?.branding?.accent_color} />
          </div>
          {tenant?.settings?.branding && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Footer Text" value={tenant.settings.branding.footer_text} />
            </div>
          )}
        </div>
      </div>

      {/* Edit Basic Info Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Tenant Details</DialogTitle>
            <DialogDescription>Update tenant information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <Input
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Input
                label="Website"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
            <Input
              label="City"
              value={editForm.city}
              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
            />
            <Input
              label="State"
              value={editForm.state}
              onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
            />
            <Input
              label="Country"
              value={editForm.country}
              onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as TenantStatus })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBasic} disabled={updateTenant.isPending}>
              {updateTenant.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Settings Dialog */}
      <Dialog open={editSettingsOpen} onOpenChange={setEditSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tenant Settings</DialogTitle>
            <DialogDescription>Update tenant limits and settings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Max Students"
              type="number"
              value={settingsForm.max_students}
              onChange={(e) => setSettingsForm({ ...settingsForm, max_students: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Max Courses"
              type="number"
              value={settingsForm.max_courses}
              onChange={(e) => setSettingsForm({ ...settingsForm, max_courses: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Max Tutors"
              type="number"
              value={settingsForm.max_tutors}
              onChange={(e) => setSettingsForm({ ...settingsForm, max_tutors: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Default Timezone"
              value={settingsForm.default_timezone}
              onChange={(e) => setSettingsForm({ ...settingsForm, default_timezone: e.target.value })}
              placeholder="UTC"
            />
            <div className="bg-card flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Allow Self Registration</p>
                <p className="text-muted-foreground text-xs">Users can register without admin approval</p>
              </div>
              <Switch
                checked={settingsForm.allow_self_registration}
                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, allow_self_registration: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSettings} disabled={updateTenant.isPending}>
              {updateTenant.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
