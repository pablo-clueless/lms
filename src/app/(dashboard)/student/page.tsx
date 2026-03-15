"use client";

import { useUserStore } from "@/store/core";

const Page = () => {
  const { user } = useUserStore();

  return (
    <div className="space-y-6 p-6">
      <div className="from-foreground/90 to-foreground space-y-10 rounded-xl border bg-linear-to-r p-10">
        <h3 className="text-background text-3xl font-medium">Welcome back, {user?.name}</h3>
        <p className="text-background/50 font-medium">Let&apos;s see what&apos;s happening in your system today.</p>
      </div>
      <div className="grid w-full grid-cols-4 gap-6">
        <div className="rounded-lg border p-4"></div>
        <div className="rounded-lg border p-4"></div>
        <div className="rounded-lg border p-4"></div>
        <div className="rounded-lg border p-4"></div>
      </div>
      <div className="w-full rounded-lg border p-4"></div>
      <div className="grid grid-cols-2 gap-6">
        <div className="w-full rounded-lg border p-4"></div>
        <div className="w-full rounded-lg border p-4"></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="w-full rounded-lg border p-4"></div>
        <div className="w-full rounded-lg border p-4"></div>
      </div>
    </div>
  );
};

export default Page;
