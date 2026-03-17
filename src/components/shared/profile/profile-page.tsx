"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit02Icon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  Calendar03Icon,
  UserIcon,
  LockPasswordIcon,
  Camera01Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Loader } from "@/components/shared/loader";
import { useGetMe, useUpdateMe, useUpdateProfile, useUpdatePassword } from "@/lib/api/user";
import type { Role } from "@/types";
import { cn } from "@/lib";

interface ProfilePageProps {
  role: Role;
}

const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  TUTOR: "Tutor",
  STUDENT: "Student",
};

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

export const ProfilePage = ({ role }: ProfilePageProps) => {
  const { data: userData, isLoading } = useGetMe();
  const user = userData?.data;
  const updateMe = useUpdateMe();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editPersonalOpen, setEditPersonalOpen] = useState(false);
  const [editPasswordOpen, setEditPasswordOpen] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const [personalForm, setPersonalForm] = useState({
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const openEditProfile = () => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        bio: user.profile?.bio || "",
      });
    }
    setEditProfileOpen(true);
  };

  const openEditPersonal = () => {
    if (user?.profile) {
      setPersonalForm({
        phone: user.profile.phone || "",
        gender: user.profile.gender || "",
        date_of_birth: user.profile.date_of_birth || "",
        address: user.profile.address || "",
        city: user.profile.city || "",
        state: user.profile.state || "",
        country: user.profile.country || "",
        postal_code: user.profile.postal_code || "",
      });
    }
    setEditPersonalOpen(true);
  };

  const openEditPassword = () => {
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setEditPasswordOpen(true);
  };

  const handleProfileSave = async () => {
    await updateMe.mutateAsync({ name: profileForm.name, email: profileForm.email });
    if (profileForm.bio !== user?.profile?.bio) {
      await updateProfile.mutateAsync({ profile: { bio: profileForm.bio } } as never);
    }
    setEditProfileOpen(false);
  };

  const handlePersonalSave = async () => {
    await updateProfile.mutateAsync({ profile: personalForm } as never);
    setEditPersonalOpen(false);
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    await updatePassword.mutateAsync({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });
    setEditPasswordOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader />
      </div>
    );
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-32" />
        <div className="px-6 pb-6">
          <div className="-mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="group relative">
                <Avatar className="border-background size-32 border-4 shadow-lg">
                  <AvatarImage src={user?.profile?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">{initials}</AvatarFallback>
                </Avatar>
                <button className="bg-primary text-primary-foreground absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                  <HugeiconsIcon icon={Camera01Icon} className="size-4" />
                </button>
              </div>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground text-sm">{roleLabels[role]}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      user?.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600",
                    )}
                  >
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={openEditProfile} className="shrink-0">
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Information */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Account Information</h3>
          </div>
          <div className="space-y-4">
            <InfoItem icon={Mail01Icon} label="Email Address" value={user?.email} />
            <InfoItem icon={UserIcon} label="Role" value={roleLabels[role]} />
            <InfoItem
              icon={Calendar03Icon}
              label="Member Since"
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : undefined}
            />
            <InfoItem
              icon={Calendar03Icon}
              label="Last Login"
              value={user?.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : undefined}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <Button variant="outline" size="sm" onClick={openEditPersonal}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit
            </Button>
          </div>
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

        {/* Bio Section */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Bio</h3>
          <p className="text-muted-foreground text-sm">
            {user?.profile?.bio || "No bio added yet. Click Edit Profile to add one."}
          </p>
        </div>

        {/* Security */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Security</h3>
            <Button variant="outline" size="sm" onClick={openEditPassword}>
              <HugeiconsIcon icon={LockPasswordIcon} data-icon="inline-start" className="size-4" />
              Change Password
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Password last changed: {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : "Unknown"}
            </p>
            <p className="text-muted-foreground text-sm">
              Keep your account secure by using a strong, unique password.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              placeholder="Enter your full name"
            />
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="Enter your email"
            />
            <Textarea
              label="Bio"
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Tell us about yourself"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProfileSave} disabled={updateMe.isPending || updateProfile.isPending}>
              {updateMe.isPending || updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Personal Info Dialog */}
      <Dialog open={editPersonalOpen} onOpenChange={setEditPersonalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Personal Information</DialogTitle>
            <DialogDescription>Update your personal details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone Number"
              value={personalForm.phone}
              onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Gender</label>
              <Select
                value={personalForm.gender}
                onValueChange={(value) => setPersonalForm({ ...personalForm, gender: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Date of Birth"
              type="date"
              value={personalForm.date_of_birth}
              onChange={(e) => setPersonalForm({ ...personalForm, date_of_birth: e.target.value })}
            />
            <Input
              label="Postal Code"
              value={personalForm.postal_code}
              onChange={(e) => setPersonalForm({ ...personalForm, postal_code: e.target.value })}
              placeholder="Enter postal code"
            />
            <div className="sm:col-span-2">
              <Input
                label="Address"
                value={personalForm.address}
                onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
                placeholder="Enter your street address"
              />
            </div>
            <Input
              label="City"
              value={personalForm.city}
              onChange={(e) => setPersonalForm({ ...personalForm, city: e.target.value })}
              placeholder="Enter city"
            />
            <Input
              label="State"
              value={personalForm.state}
              onChange={(e) => setPersonalForm({ ...personalForm, state: e.target.value })}
              placeholder="Enter state"
            />
            <div className="sm:col-span-2">
              <Input
                label="Country"
                value={personalForm.country}
                onChange={(e) => setPersonalForm({ ...personalForm, country: e.target.value })}
                placeholder="Enter country"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPersonalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePersonalSave} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={editPasswordOpen} onOpenChange={setEditPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password"
              showPasswordStrength
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              error={passwordError}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSave} disabled={updatePassword.isPending}>
              {updatePassword.isPending ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
