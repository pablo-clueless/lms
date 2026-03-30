"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { useMarkNotificationAsRead, useDeleteNotification } from "@/lib/api/notification";
import { StatusBadge, DateTimeCell, ActionCell, ActionIcons } from "./shared";
import type { Email, Notification } from "@/types";
import { cn, fromSnakeCase } from "@/lib";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Email columns
export const emailColumns: ColumnDef<Email>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span className="max-w-xs truncate font-medium">{row.original.subject}</span>,
  },
  {
    accessorKey: "recipient_scope",
    header: "Recipients",
    cell: ({ row }) => <span className="capitalize">{fromSnakeCase(row.original.recipient_scope)}</span>,
  },
  {
    accessorKey: "total_recipients",
    header: "Total",
    cell: ({ row }) => <span>{row.original.total_recipients}</span>,
  },
  {
    id: "delivery",
    header: "Delivered",
    cell: ({ row }) => (
      <span>
        {row.original.success_count}/{row.original.total_recipients}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "scheduled_for",
    header: "Scheduled For",
    cell: ({ row }) => <DateTimeCell date={row.original.scheduled_for} />,
  },
  {
    accessorKey: "sent_at",
    header: "Sent At",
    cell: ({ row }) => <DateTimeCell date={row.original.sent_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell
        actions={[
          { label: "View Details", icon: ActionIcons.View, onClick: () => console.log("View", row.original.id) },
          {
            label: "Cancel",
            icon: ActionIcons.Delete,
            onClick: () => console.log("Cancel", row.original.id),
            variant: "danger",
          },
        ]}
      />
    ),
  },
];

// Notification Actions Component
const NotificationActions = ({ notification }: { notification: Notification }) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();

  const handleView = () => {
    setViewOpen(true);
    if (!notification.is_read) {
      markAsRead(notification.id, {
        onError: () => toast.error("Failed to mark notification as read"),
      });
    }
  };

  const handleDelete = () => {
    deleteNotification(notification.id, {
      onSuccess: () => {
        toast.success("Notification deleted");
        setDeleteOpen(false);
      },
      onError: () => toast.error("Failed to delete notification"),
    });
  };

  const priorityColors: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-600",
    NORMAL: "bg-blue-100 text-blue-600",
    HIGH: "bg-orange-100 text-orange-600",
    URGENT: "bg-red-100 text-red-600",
  };

  return (
    <>
      <ActionCell
        actions={[
          { label: "View", icon: ActionIcons.View, onClick: handleView },
          { label: "Delete", icon: ActionIcons.Delete, onClick: () => setDeleteOpen(true), variant: "danger" },
        ]}
      />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>{notification.title}</DialogTitle>
              {!notification.is_read && (
                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">New</span>
              )}
            </div>
            <DialogDescription className="flex items-center gap-2 pt-1">
              <span className={cn("rounded px-2 py-0.5 text-xs", priorityColors[notification.priority])}>
                {notification.priority}
              </span>
              <span className="text-muted-foreground text-xs">{fromSnakeCase(notification.event_type)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-foreground text-sm whitespace-pre-wrap">{notification.body}</div>
            <div className="text-muted-foreground space-y-1 border-t pt-4 text-xs">
              <div className="flex justify-between">
                <span>Channels</span>
                <span>{notification.channels?.join(", ") || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Received</span>
                <span>{format(new Date(notification.created_at), "MMM d, yyyy h:mm a")}</span>
              </div>
              {notification.read_at && (
                <div className="flex justify-between">
                  <span>Read</span>
                  <span>{format(new Date(notification.read_at), "MMM d, yyyy h:mm a")}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            {notification.action_url && (
              <Button variant="outline" asChild>
                <a href={notification.action_url} target="_blank" rel="noopener noreferrer">
                  View Details
                </a>
              </Button>
            )}
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Notification columns
export const notificationColumns: ColumnDef<Notification>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {!row.original.is_read && <span className="size-2 rounded-full bg-blue-500" />}
        <span className={cn("max-w-xs truncate", row.original.is_read ? "text-muted-foreground" : "font-medium")}>
          {row.original.title}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "event_type",
    header: "Event Type",
    cell: ({ row }) => (
      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{fromSnakeCase(row.original.event_type)}</span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const colors: Record<string, string> = {
        LOW: "bg-gray-100 text-gray-600",
        NORMAL: "bg-blue-100 text-blue-600",
        HIGH: "bg-orange-100 text-orange-600",
        URGENT: "bg-red-100 text-red-600",
      };
      return (
        <span
          className={cn("rounded-full px-3 py-1 text-xs font-medium", colors[row.original.priority] || "text-gray-600")}
        >
          {row.original.priority}
        </span>
      );
    },
  },
  {
    id: "channels",
    header: "Channels",
    cell: ({ row }) => <span className="text-sm">{row.original.channels?.join(", ") || "N/A"}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => <DateTimeCell date={row.original.created_at} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <NotificationActions notification={row.original} />,
  },
];
