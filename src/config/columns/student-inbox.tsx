"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useMarkStudentEmailAsRead } from "@/lib/api/student-inbox";
import { DateTimeCell, ActionCell, ActionIcons, UserAvatarCell } from "./shared";
import type { StudentInboxEmail } from "@/types";
import { cn } from "@/lib";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const InboxEmailActions = ({ email }: { email: StudentInboxEmail }) => {
  const [viewOpen, setViewOpen] = useState(false);
  const { mutate: markAsRead } = useMarkStudentEmailAsRead();

  const handleView = () => {
    setViewOpen(true);
    if (!email.is_read) {
      markAsRead(email.id, {
        onError: () => toast.error("Failed to mark email as read"),
      });
    }
  };

  return (
    <>
      <ActionCell actions={[{ label: "View", icon: ActionIcons.View, onClick: handleView }]} />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg">{email.subject}</DialogTitle>
              {!email.is_read && <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">New</span>}
            </div>
            <DialogDescription className="pt-2">
              <div className="flex items-center gap-3">
                <UserAvatarCell name={email.sender_name} email={email.sender_email} avatar={email.sender_avatar} />
                <span className="text-muted-foreground ml-auto text-xs">
                  {format(new Date(email.received_at), "MMM d, yyyy h:mm a")}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 border-t pt-4">
            {email.html_body ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: email.html_body }}
              />
            ) : (
              <div className="text-foreground text-sm whitespace-pre-wrap">{email.body}</div>
            )}

            {email.attachment_urls && email.attachment_urls.length > 0 && (
              <div className="border-t pt-4">
                <p className="mb-2 text-sm font-medium">Attachments</p>
                <div className="flex flex-wrap gap-2">
                  {email.attachment_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted hover:bg-muted/80 rounded-lg px-3 py-2 text-xs"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const studentInboxColumns: ColumnDef<StudentInboxEmail>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="flex max-w-md items-center gap-2">
        {!row.original.is_read && <span className="size-2 shrink-0 rounded-full bg-blue-500" />}
        <span className={cn("truncate", row.original.is_read ? "text-muted-foreground" : "font-medium")}>
          {row.original.subject}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "sender_name",
    header: "From",
    cell: ({ row }) => (
      <UserAvatarCell
        name={row.original.sender_name}
        email={row.original.sender_email}
        avatar={row.original.sender_avatar}
      />
    ),
  },
  {
    accessorKey: "received_at",
    header: "Received",
    cell: ({ row }) => <DateTimeCell date={row.original.received_at} />,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-medium",
          row.original.is_read ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600",
        )}
      >
        {row.original.is_read ? "Read" : "Unread"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <InboxEmailActions email={row.original} />,
  },
];
