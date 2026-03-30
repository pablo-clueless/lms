"use client";

import { Mail01Icon, Phone, RefreshIcon, Calendar03Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/config/columns";
import { useGetUser } from "@/lib/api/user";
import { cn } from "@/lib";

const tabs = ["overview", "permissions", "activity"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const id = useParams().id as string;

  const { data: admin, isFetching, isPending, refetch } = useGetUser(id);

  const breadcrumbs = [
    { label: "Admins", href: "/admin/admins" },
    { label: admin?.first_name || "Admin Details", href: `/admin/admins/${id}` },
  ];

  if (isPending) return <Loader />;

  const initials = `${admin?.first_name?.[0] || ""}${admin?.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={admin?.profile_photo} alt={admin?.first_name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-foreground text-2xl font-semibold">
              {admin?.first_name} {admin?.last_name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                {admin?.email}
              </span>
              {admin?.phone && (
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Phone} className="size-4" />
                  {admin?.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <StatusBadge status={admin?.status || "INACTIVE"} />
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

        <TabPanel selected={currentTab} value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Personal Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name</span>
                  <span>
                    {admin?.first_name} {admin?.middle_name} {admin?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{admin?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{admin?.phone || "Not provided"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={admin?.status || "INACTIVE"} />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Account Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="">{admin?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                    {admin?.last_login_at ? new Date(admin.last_login_at).toLocaleDateString() : "Never"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{admin?.created_at ? new Date(admin.created_at).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{admin?.updated_at ? new Date(admin.updated_at).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
              <h4 className="font-semibold">Statistics</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">{admin?.permissions?.length || 0}</p>
                  <p className="text-muted-foreground text-sm">Permissions</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Actions Taken</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Users Managed</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-bold">0</p>
                  <p className="text-muted-foreground text-sm">Active Sessions</p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="permissions">
          <div className="max-w-2xl space-y-4 rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Assigned Permissions</h4>
              <Button variant="outline" size="sm">
                <HugeiconsIcon icon={Shield01Icon} className="mr-2 size-4" />
                Edit Permissions
              </Button>
            </div>
            {admin?.permissions && admin.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {admin.permissions.map((permission, index) => (
                  <span key={index} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {permission}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No specific permissions assigned.</p>
            )}
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="activity">
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">Activity log will be displayed here</p>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
