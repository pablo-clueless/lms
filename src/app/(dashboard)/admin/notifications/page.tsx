"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, RefreshIcon } from "@hugeicons/core-free-icons";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Loader, Pagination, Breadcrumb } from "@/components/shared";
import { createNotificationColumns } from "@/config/columns";
import { useGetNotifications, useCreateNotification } from "@/lib/api/communication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PaginationParams, Notification, NotificationType } from "@/types";
import { cn } from "@/lib";

const breadcrumbs = [{ label: "Notifications", href: "/admin/notifications" }];

const initialParams: PaginationParams = {
  order: "desc",
  page: 1,
  per_page: 10,
  search: "",
  status: "",
};

const STATUS = [
  { label: "All", value: "ALL" },
  { label: "Unread", value: "UNREAD" },
  { label: "Read", value: "READ" },
];

const NOTIFICATION_TYPES: { label: string; value: NotificationType }[] = [
  { label: "Info", value: "INFO" },
  { label: "Warning", value: "WARNING" },
  { label: "Success", value: "SUCCESS" },
  { label: "Error", value: "ERROR" },
  { label: "Reminder", value: "REMINDER" },
];

const RECIPIENT_TYPES = [
  { label: "All Users", value: "ALL" },
  { label: "Students", value: "STUDENTS" },
  { label: "Tutors", value: "TUTORS" },
  { label: "Admins", value: "ADMINS" },
];

interface CreateNotificationData {
  title: string;
  message: string;
  type: NotificationType;
  recipient_type: string;
}

const initialNotification: CreateNotificationData = {
  title: "",
  message: "",
  type: "INFO",
  recipient_type: "ALL",
};

const Page = () => {
  const [params, setParams] = useState(initialParams);
  const [createOpen, setCreateOpen] = useState(false);
  const [notification, setNotification] = useState(initialNotification);

  const columns = createNotificationColumns("ADMIN");
  const { data, isFetching, isPending, refetch } = useGetNotifications(params);
  const createNotification = useCreateNotification();

  const handleParamsChange = <K extends keyof PaginationParams>(field: K, value: PaginationParams[K]) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateNotification = async () => {
    await createNotification.mutateAsync({
      title: notification.title,
      message: notification.message,
      type: notification.type,
    } as Partial<Notification>);
    setNotification(initialNotification);
    setCreateOpen(false);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setNotification(initialNotification);
    }
    setCreateOpen(value);
  };

  const isValid = notification.title && notification.message && notification.type && notification.recipient_type;

  if (isPending) return <Loader />;

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-foreground text-3xl">Notifications</h3>
          <p className="text-muted-foreground text-sm">Manage system notifications</p>
        </div>
        <div className="flex items-center gap-x-4">
          <Select onValueChange={(status) => handleParamsChange("status", status)} value={params.status}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" disabled={isFetching} onClick={() => refetch()} size="sm">
            <HugeiconsIcon
              icon={RefreshIcon}
              data-icon="inline-start"
              className={cn("size-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" className="size-4" />
            New Notification
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable columns={columns} data={data?.data || []} />
        <Pagination
          onPageChange={(value) => handleParamsChange("page", value)}
          onPageSizeChange={(value) => handleParamsChange("per_page", value)}
          page={params.page || 1}
          pageSize={params.per_page || 10}
          total={data?.meta.total || 0}
        />
      </div>

      <Dialog open={createOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Notification</DialogTitle>
            <DialogDescription>Send a new notification to users in the system.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid gap-4">
              <Input
                label="Title"
                value={notification.title}
                onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                placeholder="Enter notification title"
                required
              />
              <Textarea
                label="Message"
                value={notification.message}
                onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                placeholder="Enter notification message"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={notification.type}
                    onValueChange={(value: NotificationType) => setNotification({ ...notification, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTIFICATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Type</label>
                  <Select
                    value={notification.recipient_type}
                    onValueChange={(value) => setNotification({ ...notification, recipient_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECIPIENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNotification} disabled={createNotification.isPending || !isValid}>
              {createNotification.isPending ? "Creating..." : "Create Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
