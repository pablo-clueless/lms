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
  Clock01Icon,
  Award01Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetUser, useUpdateUser } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserStatus, TutorStatus, Availability } from "@/types";
import { formatDate } from "@/lib";

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

const TIMEZONES = [
  { label: "UTC", value: "UTC" },
  { label: "Africa/Lagos (WAT)", value: "Africa/Lagos" },
  { label: "America/New_York (EST)", value: "America/New_York" },
  { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Asia/Dubai (GST)", value: "Asia/Dubai" },
];

interface EditFormState {
  name: string;
  email: string;
  status: UserStatus;
  phone: string;
  gender: string;
  headline: string;
  bio: string;
  timezone: string;
  years_of_experience: string;
  specialities: string;
}

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data, isPending } = useGetUser(id);
  const user = data?.data;
  const updateUser = useUpdateUser(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    email: "",
    status: "ACTIVE",
    phone: "",
    gender: "",
    headline: "",
    bio: "",
    timezone: "",
    years_of_experience: "",
    specialities: "",
  });

  const breadcrumbs = [
    { label: "Tutors", href: "/admin/tutors" },
    { label: "Tutor Details", href: `/admin/tutors/${id}` },
  ];

  const openEdit = () => {
    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        status: user.status,
        phone: user.profile?.phone || "",
        gender: user.profile?.gender || "",
        headline: user.tutor?.headline || "",
        bio: user.tutor?.bio || "",
        timezone: user.tutor?.timezone || "",
        years_of_experience: user.tutor?.years_of_experience?.toString() || "",
        specialities: user.tutor?.specialities?.join(", ") || "",
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateUser.mutateAsync({
      name: editForm.name,
      email: editForm.email,
      status: editForm.status,
      profile: {
        phone: editForm.phone,
        gender: editForm.gender,
      },
      tutor: {
        headline: editForm.headline,
        bio: editForm.bio,
        timezone: editForm.timezone,
        years_of_experience: editForm.years_of_experience ? parseInt(editForm.years_of_experience, 10) : undefined,
        specialities: editForm.specialities ? editForm.specialities.split(",").map((s) => s.trim()) : [],
      },
    } as never);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const tutorStatusLabels: Record<TutorStatus, string> = {
    PENDING: "Pending",
    SUSPENDED: "Suspended",
    ACTIVE: "Active",
    ON_LEAVE: "On Leave",
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/tutors")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Tutors
      </Button>

      {/* Tutor Header */}
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
                <p className="text-muted-foreground text-sm">{user?.tutor?.headline || "Tutor"}</p>
                <div className="mt-1 flex items-center gap-2">
                  {user?.status && <StatusBadge status={user.status} />}
                  {user?.tutor?.status && (
                    <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                      {tutorStatusLabels[user.tutor.status]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {user?.tutor?.bio && (
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">About</h3>
          <p className="text-muted-foreground text-sm">{user.tutor.bio}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Account Information</h3>
          <div className="space-y-4">
            <InfoItem icon={Mail01Icon} label="Email Address" value={user?.email} />
            <InfoItem icon={UserIcon} label="Role" value="Tutor" />
            <InfoItem icon={Calendar03Icon} label="Member Since" value={formatDate(user?.created_at)} />
            <InfoItem icon={Clock01Icon} label="Last Login" value={formatDate(user?.last_login_at)} />
          </div>
        </div>
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Professional Information</h3>
          <div className="space-y-4">
            <InfoItem
              icon={Award01Icon}
              label="Years of Experience"
              value={user?.tutor?.years_of_experience ? `${user.tutor.years_of_experience} years` : undefined}
            />
            <InfoItem icon={Clock01Icon} label="Timezone" value={user?.tutor?.timezone} />
            <div className="flex items-start gap-3">
              <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={Award01Icon} className="text-muted-foreground size-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Specialities</p>
                {user?.tutor?.specialities && user.tutor.specialities.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {user.tutor.specialities.map((s: string) => (
                      <span key={s} className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground text-sm font-medium">Not set</p>
                )}
              </div>
            </div>
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

        {/* Availability */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Availability</h3>
          {user?.tutor?.availability && user.tutor.availability.length > 0 ? (
            <div className="space-y-2">
              {user.tutor.availability.map((slot: Availability) => (
                <div key={slot.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{slot.day}</span>
                  <span className="text-muted-foreground text-sm">
                    {slot.start_time} - {slot.end_time}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No availability slots configured.</p>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Tutor</DialogTitle>
            <DialogDescription>Update tutor information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Gender</label>
                <Select
                  value={editForm.gender}
                  onValueChange={(value) => setEditForm({ ...editForm, gender: value })}
                >
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
            <Input
              label="Phone Number"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
            <Input
              label="Headline"
              value={editForm.headline}
              onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
              placeholder="e.g., Senior Software Engineer"
            />
            <Textarea
              label="Bio"
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              placeholder="Brief description about the tutor..."
              className="min-h-20"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Timezone</label>
                <Select
                  value={editForm.timezone}
                  onValueChange={(value) => setEditForm({ ...editForm, timezone: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="Years of Experience"
                type="number"
                min="0"
                value={editForm.years_of_experience}
                onChange={(e) => setEditForm({ ...editForm, years_of_experience: e.target.value })}
                placeholder="5"
              />
            </div>
            <Input
              label="Specialities"
              value={editForm.specialities}
              onChange={(e) => setEditForm({ ...editForm, specialities: e.target.value })}
              placeholder="React, Node.js, Python (comma separated)"
            />
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
