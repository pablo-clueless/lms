"use client";

import { Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Breadcrumb } from "@/components/shared";
import { Button } from "@/components/ui/button";

const breadcrumbs = [{ label: "Settings", href: "/tutor/settings" }];

const settingsItems = [
  {
    title: "Profile Settings",
    description: "Update your personal information, profile photo, and contact details",
    href: "/tutor/profile",
  },
  {
    title: "Notification Preferences",
    description: "Manage how you receive notifications about student activities and updates",
    href: "/tutor/profile",
  },
  {
    title: "Security",
    description: "Change your password and manage account security",
    href: "/tutor/profile",
  },
];

const Page = () => {
  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <h3 className="text-foreground text-3xl">Settings</h3>
          <p className="text-sm font-medium text-gray-600">Manage your notification preferences and account settings</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="hover:bg-muted/50 group flex flex-col gap-4 rounded-lg border p-6 transition-colors"
          >
            <div className="bg-primary/10 group-hover:bg-primary/20 flex size-12 items-center justify-center rounded-lg transition-colors">
              <HugeiconsIcon icon={Settings02Icon} className="text-primary size-6" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold">{item.title}</h4>
              <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-auto w-fit">
              Manage
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
