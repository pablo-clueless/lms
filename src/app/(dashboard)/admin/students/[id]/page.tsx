"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  Calendar03Icon,
  UserIcon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetUser, useUpdateUser } from "@/lib/api/user";
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
import type { UserStatus } from "@/types";

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

  const { data: userData, isPending } = useGetUser(id);
  const user = userData?.data;
  const updateUser = useUpdateUser(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    status: "" as UserStatus,
  });

  const breadcrumbs = [
    { label: "Students", href: "/admin/students" },
    { label: "Student Details", href: `/admin/students/${id}` },
  ];

  const openEdit = () => {
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        status: user.status,
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateUser.mutateAsync(editForm);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/students")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Students
      </Button>

      {/* Student Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="border-background size-24 border-4 shadow-lg">
                <AvatarImage src={user?.profile?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground text-sm">Student</p>
                <div className="mt-1">{user?.status && <StatusBadge status={user.status} />}</div>
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Information */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Account Information</h3>
          <div className="space-y-4">
            <InfoItem icon={Mail01Icon} label="Email Address" value={user?.email} />
            <InfoItem icon={UserIcon} label="Role" value="Student" />
            <InfoItem
              icon={Calendar03Icon}
              label="Member Since"
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : undefined}
            />
            <InfoItem
              icon={Calendar03Icon}
              label="Last Login"
              value={user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : undefined}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="space-y-4">
            <InfoItem icon={Call02Icon} label="Phone Number" value={user?.profile?.phone} />
            <InfoItem icon={UserIcon} label="Gender" value={user?.profile?.gender} />
            <InfoItem icon={Calendar03Icon} label="Date of Birth" value={user?.profile?.date_of_birth} />
            <InfoItem
              icon={Location01Icon}
              label="Address"
              value={
                [user?.profile?.address, user?.profile?.city, user?.profile?.state, user?.profile?.country]
                  .filter(Boolean)
                  .join(", ") || undefined
              }
            />
          </div>
        </div>

        {/* Bio */}
        <div className="bg-card space-y-4 rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold">Bio</h3>
          <p className="text-muted-foreground text-sm">{user?.profile?.bio || "No bio available."}</p>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as UserStatus })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateUser.isPending}>
              {updateUser.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
