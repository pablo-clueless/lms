"use client";

import { Breadcrumb, ProfilePage } from "@/components/shared";

const breadcrumbs = [{ label: "Profile", href: "/superadmin/profile" }];

const Page = () => {
  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Profile</h3>
          <p className="text-sm text-neutral-600">Manage your profile and settings</p>
        </div>
      </div>
      <ProfilePage role="SUPER_ADMIN" />
    </div>
  );
};

export default Page;
