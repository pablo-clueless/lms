"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  RefreshIcon,
  Mail01Icon,
  Calendar03Icon,
  UserGroupIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

import { Breadcrumb, Loader, TabPanel } from "@/components/shared";
import { useGetEmail, useSendEmail } from "@/lib/api/communication";
import { StatusBadge } from "@/config/columns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

const tabs = ["details", "recipients", "preview"];

const Page = () => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const id = useParams().id as string;

  const { data: email, isFetching, isPending, refetch } = useGetEmail(id);
  const { mutate: sendEmail, isPending: isSending } = useSendEmail();

  const breadcrumbs = [
    { label: "Communications", href: "/admin/communications" },
    { label: email?.subject || "Email Details", href: `/admin/communications/${id}` },
  ];

  if (isPending) return <Loader />;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = () => {
    sendEmail(id, {
      onSuccess: () => {
        toast.success("Email sent successfully");
        refetch();
      },
      onError: () => {
        toast.error("Failed to send email");
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT":
        return <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4 text-green-500" />;
      case "FAILED":
        return <HugeiconsIcon icon={AlertCircleIcon} className="size-4 text-red-500" />;
      case "SCHEDULED":
      case "SENDING":
        return <HugeiconsIcon icon={Clock01Icon} className="size-4 text-yellow-500" />;
      default:
        return <HugeiconsIcon icon={Mail01Icon} className="size-4 text-gray-500" />;
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case "ALL_USERS":
        return "All Users";
      case "ALL_TUTORS":
        return "All Tutors";
      case "ALL_STUDENTS":
        return "All Students";
      case "CLASS":
        return "Specific Class";
      case "COURSE":
        return "Specific Course";
      case "SPECIFIC_USERS":
        return "Specific Users";
      default:
        return scope;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-foreground text-2xl font-semibold">{email?.subject}</h3>
            <StatusBadge status={email?.status || "DRAFT"} />
          </div>
          <p className="text-sm text-gray-600">Created {formatDate(email?.created_at)}</p>
        </div>
        <div className="flex items-center gap-x-4">
          {email?.status === "DRAFT" && (
            <Button onClick={handleSend} disabled={isSending} size="sm">
              {isSending ? "Sending..." : "Send Now"}
            </Button>
          )}
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

        <TabPanel selected={currentTab} value="details">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Email Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="max-w-[60%] truncate">{email?.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={email?.status || "DRAFT"} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient Scope</span>
                  <span>{getScopeLabel(email?.recipient_scope || "")}</span>
                </div>
                {email?.scheduled_for && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled For</span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                      {formatDate(email.scheduled_for)}
                    </span>
                  </div>
                )}
                {email?.sent_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sent At</span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-3" />
                      {formatDate(email.sent_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="font-semibold">Delivery Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={UserGroupIcon} className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{email?.total_recipients || 0}</p>
                    <p className="text-muted-foreground text-xs">Total</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600">{email?.success_count || 0}</p>
                    <p className="text-muted-foreground text-xs">Success</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-red-600">{email?.failure_count || 0}</p>
                    <p className="text-muted-foreground text-xs">Failed</p>
                  </div>
                </div>
              </div>
            </div>

            {email?.attachment_urls && email.attachment_urls.length > 0 && (
              <div className="space-y-4 rounded-lg border p-4 md:col-span-2">
                <h4 className="font-semibold">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {email.attachment_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted/50 hover:bg-muted rounded-lg px-3 py-2 text-sm"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="recipients">
          <div className="space-y-4">
            {email?.recipients && email.recipients.length > 0 ? (
              <div className="rounded-lg border">
                <div className="bg-muted/50 grid grid-cols-4 gap-4 border-b p-4 text-sm font-medium">
                  <span>Email</span>
                  <span>Status</span>
                  <span>Sent At</span>
                  <span>Opened At</span>
                </div>
                <div className="divide-y">
                  {email.recipients.map((recipient, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-4 text-sm">
                      <span>{recipient.email}</span>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(recipient.status)}
                        <span className="capitalize">{recipient.status?.toLowerCase()}</span>
                      </span>
                      <span>{recipient.sent_at ? formatDate(recipient.sent_at) : "-"}</span>
                      <span>{recipient.opened_at ? formatDate(recipient.opened_at) : "-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No recipients found</p>
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel selected={currentTab} value="preview">
          <div className="space-y-4">
            <div className="rounded-lg border p-6">
              <div className="mb-4 border-b pb-4">
                <p className="text-lg font-semibold">{email?.subject}</p>
              </div>
              {email?.html_body ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: email.html_body }} />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{email?.body}</p>
              )}
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Page;
