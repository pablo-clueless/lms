import React from "react";

import { Header, Sidebar } from "@/components/shared";
import { WithAuth } from "@/components/providers";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <WithAuth roles={["TUTOR", "SUPER_ADMIN"]}>
      <div className="h-screen w-screen overflow-hidden">
        <Header />
        <div className="flex h-[calc(100%-64px)] w-full items-start">
          <Sidebar role="TUTOR" />
          <main className="bg-background h-full flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </WithAuth>
  );
};

export default DashboardLayout;
