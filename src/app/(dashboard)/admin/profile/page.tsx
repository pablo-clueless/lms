"use client";

import { Camera01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetMe, useUpdateMe } from "@/lib/api/user";
import { cn } from "@/lib";
import { toast } from "sonner";

const tabs = ["profile", "security", "notifications"];

const breadcrumbs = [{ label: "Profile", href: "/admin/profile" }];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isFetching, isPending, refetch } = useGetMe();
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
  });

  const handleEdit = () => {
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      middle_name: user?.middle_name || "",
      phone: user?.phone || "",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMe(
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        phone: formData.phone,
        profile_photo: user?.profile_photo || "",
        notification_preferences: user?.notification_preferences || [],
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          setIsEditing(false);
          refetch();
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      },
    );
  };

  if (isPending) return <Loader />;

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">Profile</h3>
          <p className="text-sm text-gray-600">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Button disabled={isFetching} onClick={() => refetch()} variant="outline" size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="border-b">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  currentTab === tab
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground",
                )}
                key={tab}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <TabPanel selected={currentTab} value="profile">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.profile_photo} alt={user?.first_name} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full shadow-lg">
                  <HugeiconsIcon icon={Camera01Icon} className="size-4" />
                </button>
              </div>
              <div>
                <h4 className="text-lg font-semibold">
                  {user?.first_name} {user?.last_name}
                </h4>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                <p className="text-muted-foreground text-xs capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>

            <div className="max-w-2xl space-y-4 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Personal Information</h4>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="First Name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                  <Input
                    label="Middle Name"
                    value={formData.middle_name}
                    onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">First Name</p>
                    <p className="font-medium">{user?.first_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Last Name</p>
                    <p className="font-medium">{user?.last_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Middle Name</p>
                    <p className="font-medium">{user?.middle_name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Phone</p>
                    <p className="font-medium">{user?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Role</p>
                    <p className="font-medium capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="security">
          <div className="max-w-2xl space-y-4 rounded-lg border p-6">
            <h4 className="font-semibold">Change Password</h4>
            <div className="space-y-4">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
              <Button>Update Password</Button>
            </div>
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="notifications">
          <div className="max-w-2xl rounded-lg border p-6">
            <h4 className="font-semibold">Notification Preferences</h4>
            <p className="text-muted-foreground mt-2 text-sm">Notification settings will be available here.</p>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
