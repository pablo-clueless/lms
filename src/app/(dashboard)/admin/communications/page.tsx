"use client";

import { Mail01Icon, RefreshIcon, Attachment01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Breadcrumb, Loader } from "@/components/shared";
import { useGetEmails, useGetEmail } from "@/lib/api/communication";
import { Button } from "@/components/ui/button";
import { useHandler } from "@/hooks";
import type { Email } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Inbox", href: "/admin/communications" }];

const initialParams = {
  limit: 50,
  page: 1,
  status: "SENT" as const,
};

const EmailListItem = ({ email, isSelected, onClick }: { email: Email; isSelected: boolean; onClick: () => void }) => {
  const preview = email.body?.slice(0, 80) || "";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-md border p-3 text-left transition-colors",
        isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="text-xs">
            {email.recipient_scope?.slice(0, 2).toUpperCase() || "EM"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{email.subject || "No Subject"}</p>
            {email.attachment_urls && email.attachment_urls.length > 0 && (
              <HugeiconsIcon icon={Attachment01Icon} className="text-muted-foreground size-3.5 shrink-0" />
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">{preview || "No content"}</p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            {email.sent_at ? format(new Date(email.sent_at), "MMM d, h:mm a") : "Draft"}
          </p>
        </div>
      </div>
    </button>
  );
};

const EmailDetail = ({ emailId }: { emailId: string }) => {
  const { data: email, isPending } = useGetEmail(emailId);

  if (isPending) {
    return (
      <div className="grid h-full place-items-center">
        <Loader />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="grid h-full place-items-center">
        <p className="text-muted-foreground text-sm">Email not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b p-6">
        <h2 className="text-xl font-semibold">{email.subject || "No Subject"}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback>{email.recipient_scope?.slice(0, 2).toUpperCase() || "EM"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">System Administrator</p>
              <p className="text-muted-foreground text-xs">To: {email.recipient_scope?.replace(/_/g, " ") || "You"}</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            {email.sent_at ? format(new Date(email.sent_at), "MMMM d, yyyy 'at' h:mm a") : "Draft"}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {email.html_body ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: email.html_body }}
          />
        ) : (
          <div className="text-sm whitespace-pre-wrap">{email.body || "No content"}</div>
        )}
      </div>
      {email.attachment_urls && email.attachment_urls.length > 0 && (
        <div className="border-t p-6">
          <p className="mb-3 text-sm font-medium">Attachments ({email.attachment_urls.length})</p>
          <div className="flex flex-wrap gap-2">
            {email.attachment_urls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors"
              >
                <HugeiconsIcon icon={Attachment01Icon} className="size-4" />
                Attachment {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
      <div className="mt-6 grid min-h-0 flex-1 grid-cols-6 overflow-hidden border-t">
        <div className="col-span-2 flex flex-col border-r">
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {emails.length > 0 ? (
              emails.map((email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  isSelected={selected === email.id}
                  onClick={() => setSelected(email.id)}
                />
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12">
                <HugeiconsIcon icon={Mail01Icon} className="text-muted-foreground mb-3 size-10" />
                <p className="text-muted-foreground text-sm">No emails yet</p>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-4 flex flex-col overflow-hidden">
          {selected ? (
            <EmailDetail emailId={selected} />
          ) : (
            <div className="grid h-full place-items-center">
              <div className="flex flex-col items-center">
                <HugeiconsIcon icon={Mail01Icon} className="text-muted-foreground mb-3 size-12" />
                <p className="text-muted-foreground text-sm">Select an email to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
