"use client";

import { Camera01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { cn, fromSnakeCase, getInitials, removeNullOrUndefined } from "@/lib";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notificationPreferencesByRole } from "@/config/notification";
import { Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { useGetMe, useUpdateMe } from "@/lib/api/user";
import type { NotificationPreferences } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const breadcrumbs = [{ label: "Profile", href: "/superadmin/profile" }];

const tabs = ["account", "notifications", "security"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isFetching, isPending, refetch } = useGetMe();
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
  });

  const notificationPreferences = useMemo(() => {
    const preferences = notificationPreferencesByRole("SUPER_ADMIN");
    if (!data?.notification_preferences?.length) return preferences;
    const allowedEventTypes = new Set(preferences.map((p) => p.event_type));
    return data.notification_preferences.filter((pref) => allowedEventTypes.has(pref.event_type));
  }, [data]);

  const [editedPreferences, setEditedPreferences] = useState<NotificationPreferences[]>([]);
  const [hasPreferencesChanged, setHasPreferencesChanged] = useState(false);

  const handleEdit = () => {
    setFormData({
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      middle_name: data?.middle_name || "",
      phone: data?.phone || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: "",
      last_name: "",
      middle_name: "",
      phone: "",
    });
  };

  const handleSave = () => {
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      middle_name: formData.middle_name,
      phone: formData.phone,
      profile_photo: data?.profile_photo || "",
      notification_preferences: data?.notification_preferences || [],
    };
    const sanitized = removeNullOrUndefined(payload);
    updateMe(sanitized, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        refetch();
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    });
  };

  const handlePreferenceChange = (
    eventType: string,
    field: "email_enabled" | "in_app_enabled" | "push_enabled",
    value: boolean,
  ) => {
    const currentPrefs = editedPreferences.length > 0 ? editedPreferences : notificationPreferences;
    const updated = currentPrefs.map((pref) => (pref.event_type === eventType ? { ...pref, [field]: value } : pref));
    setEditedPreferences(updated);
    setHasPreferencesChanged(true);
  };

  const handleSavePreferences = () => {
    const payload = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      middle_name: data?.middle_name,
      phone: data?.phone,
      profile_photo: data?.profile_photo || "",
      notification_preferences: editedPreferences,
    };
    const sanitized = removeNullOrUndefined(payload);
    updateMe(sanitized, {
      onSuccess: () => {
        toast.success("Notification preferences updated");
        setHasPreferencesChanged(false);
        refetch();
      },
      onError: () => {
        toast.error("Failed to update preferences");
      },
    });
  };

  const handleCancelPreferences = () => {
    setEditedPreferences([]);
    setHasPreferencesChanged(false);
  };

  if (isPending && !data) return <Loader />;

  const name = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();
  const displayPreferences = editedPreferences.length > 0 ? editedPreferences : notificationPreferences;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-foreground text-2xl font-semibold">Profile</h3>
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
                key={tab}
                type="button"
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  currentTab === tab
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setCurrentTab(tab)}
              >
                {fromSnakeCase(tab)}
              </button>
            ))}
          </div>
        </div>
        <TabPanel selected={currentTab} value="account">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="size-24">
                  <AvatarImage src={data?.profile_photo} alt={name} />
                  <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full shadow-lg"
                >
                  <HugeiconsIcon icon={Camera01Icon} className="size-4" />
                </button>
              </div>
              <div>
                <h4 className="text-lg font-semibold">{name || "User"}</h4>
                <p className="text-muted-foreground text-sm">{data?.email}</p>
                <p className="text-muted-foreground text-xs capitalize">{data?.role?.toLowerCase()}</p>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Personal Information</h4>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
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
                    <p className="font-medium">{data?.first_name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Last Name</p>
                    <p className="font-medium">{data?.last_name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Middle Name</p>
                    <p className="font-medium">{data?.middle_name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Phone</p>
                    <p className="font-medium">{data?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p className="font-medium">{data?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Role</p>
                    <p className="font-medium">{data?.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabPanel>
        <TabPanel selected={currentTab} value="notifications">
          <div className="space-y-4 rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Notification Preferences</h4>
                <p className="text-muted-foreground text-sm">Choose how you want to be notified</p>
              </div>
              {hasPreferencesChanged && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelPreferences}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSavePreferences} disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
            <div className="border-b pb-3">
              <div className="grid grid-cols-[1fr_80px_80px_80px] gap-4">
                <span className="text-muted-foreground text-sm font-medium">Event</span>
                <span className="text-muted-foreground text-center text-sm font-medium">Email</span>
                <span className="text-muted-foreground text-center text-sm font-medium">In-App</span>
                <span className="text-muted-foreground text-center text-sm font-medium">Push</span>
              </div>
            </div>
            <div className="space-y-1">
              {displayPreferences.map((preference) => (
                <div
                  key={preference.event_type}
                  className="grid grid-cols-[1fr_80px_80px_80px] items-center gap-4 rounded-lg py-3 transition-colors hover:bg-gray-50"
                >
                  <div>
                    <Label className="font-medium capitalize">
                      {fromSnakeCase(preference.event_type).toLowerCase()}
                    </Label>
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={preference.email_enabled}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange(preference.event_type, "email_enabled", checked)
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={preference.in_app_enabled}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange(preference.event_type, "in_app_enabled", checked)
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={preference.push_enabled}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange(preference.event_type, "push_enabled", checked)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>
        <TabPanel selected={currentTab} value="security">
          <div className="max-w-2xl space-y-4 rounded-lg border p-6">
            <h4 className="font-semibold">Change Password</h4>
            <p className="text-muted-foreground text-sm">Update your password to keep your account secure</p>
            <div className="space-y-4">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
              <Button>Update Password</Button>
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
