import React from "react";

import { NotificationProvider, WithAuth } from "@/components/providers";
import { Header, Sidebar } from "@/components/shared";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <NotificationProvider>
      <WithAuth roles={["ADMIN", "SUPER_ADMIN"]}>
        <div className="h-screen w-screen overflow-hidden">
          <Header />
          <div className="flex h-[calc(100%-64px)] w-full items-start">
            <Sidebar role="ADMIN" />
            <main className="bg-background h-full flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </WithAuth>
    </NotificationProvider>
  );
};

export default DashboardLayout;
