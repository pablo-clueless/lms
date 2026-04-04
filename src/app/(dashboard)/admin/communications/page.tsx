"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import Link from "next/link";

import { Breadcrumb, EmailInboxLayout, Loader } from "@/components/shared";
import { useGetEmails } from "@/lib/api/communication";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Inbox", href: "/admin/communications" }];

const initialParams = {
  limit: 50,
  page: 1,
  status: "SENT" as const,
};

const Page = () => {
  const { values } = useHandler(initialParams);
  const [selected, setSelected] = useState("");

  const { data, isFetching, isPending, refetch } = useGetEmails(values);

  const emails = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);

  if (isPending) return <Loader />;

  return (
    <div className="flex h-full flex-col p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="mt-6 flex w-full items-center justify-between">
        <div className="w-fit space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-3xl">Inbox</h3>
            {emails.length > 0 && (
              <span className="text-muted-foreground rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium">
                {emails.length}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-600">View emails from your tutors and administrators</p>
        </div>
        <div className="flex items-center gap-x-3">
          <Button asChild size="sm">
            <Link href="/admin/communications/create">New Email</Link>
          </Button>
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
      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        <EmailInboxLayout
          emails={emails}
          selectedId={selected}
          onSelect={setSelected}
          defaultSenderName="System Administrator"
        />
      </div>
    </div>
  );
};

export default Page;
