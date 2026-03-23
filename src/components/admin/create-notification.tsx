"use client";

import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import type { CreateNotificationDto, NotificationChannel, NotificationPriority, RecipientScope } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCreateNotification } from "@/lib/api/notification";
import { useGetClasses } from "@/lib/api/class";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Message is required"),
  recipient_scope: Yup.string()
    .oneOf(["ALL_USERS", "ALL_TUTORS", "ALL_STUDENTS", "CLASS"])
    .required("Recipient scope is required"),
  target_class_id: Yup.string().when("recipient_scope", {
    is: "CLASS",
    then: (schema) => schema.required("Class is required when scope is CLASS"),
  }),
  channels: Yup.array()
    .of(Yup.string().oneOf(["IN_APP", "PUSH", "EMAIL", "SMS"]))
    .min(1, "At least one channel is required"),
  priority: Yup.string().oneOf(["LOW", "NORMAL", "HIGH", "URGENT"]).required("Priority is required"),
  action_url: Yup.string().url("Must be a valid URL").nullable(),
});

interface FormValues {
  title: string;
  body: string;
  recipient_scope: RecipientScope;
  target_class_id?: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  action_url: string;
}

const initialValues: FormValues = {
  title: "",
  body: "",
  recipient_scope: "ALL_USERS",
  target_class_id: undefined,
  channels: ["IN_APP"],
  priority: "NORMAL",
  action_url: "",
};

const channelOptions: { value: NotificationChannel; label: string }[] = [
  { value: "IN_APP", label: "In-App" },
  { value: "PUSH", label: "Push" },
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
];

const priorityOptions: { value: NotificationPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export const CreateNotification = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createNotification, isPending } = useCreateNotification();
  const { data: classesData } = useGetClasses();

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      const payload: CreateNotificationDto = {
        ...values,
        action_url: values.action_url || undefined,
        target_class_id: values.target_class_id || undefined,
      };
      createNotification(payload, {
        onSuccess: () => {
          toast.success("Notification sent successfully");
          setOpen(false);
          formik.resetForm();
        },
        onError: () => {
          toast.error("Failed to send notification");
        },
      });
    },
  });

  const showClassSelector = formik.values.recipient_scope === "CLASS";

  const handleChannelChange = (channel: NotificationChannel, checked: boolean) => {
    const currentChannels = formik.values.channels;
    if (checked) {
      formik.setFieldValue("channels", [...currentChannels, channel]);
    } else {
      formik.setFieldValue(
        "channels",
        currentChannels.filter((c) => c !== channel),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Notification</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Create and send a notification to users. Choose the delivery channels and priority level.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Recipients <span className="text-destructive">*</span>
              </label>
              <Select
                value={formik.values.recipient_scope}
                onValueChange={(value) => {
                  formik.setFieldValue("recipient_scope", value);
                  if (value !== "CLASS") {
                    formik.setFieldValue("target_class_id", undefined);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_USERS">All Users</SelectItem>
                  <SelectItem value="ALL_TUTORS">All Tutors</SelectItem>
                  <SelectItem value="ALL_STUDENTS">All Students</SelectItem>
                  <SelectItem value="CLASS">Specific Class</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.recipient_scope && formik.errors.recipient_scope && (
                <p className="text-destructive text-sm">{formik.errors.recipient_scope}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Priority <span className="text-destructive">*</span>
              </label>
              <Select value={formik.values.priority} onValueChange={(value) => formik.setFieldValue("priority", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.priority && formik.errors.priority && (
                <p className="text-destructive text-sm">{formik.errors.priority}</p>
              )}
            </div>
          </div>

          {showClassSelector && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Class <span className="text-destructive">*</span>
              </label>
              <Select
                value={formik.values.target_class_id || ""}
                onValueChange={(value) => formik.setFieldValue("target_class_id", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classesData?.classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.target_class_id && formik.errors.target_class_id && (
                <p className="text-destructive text-sm">{formik.errors.target_class_id}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Channels <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {channelOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`channel-${option.value}`}
                    checked={formik.values.channels.includes(option.value)}
                    onCheckedChange={(checked) => handleChannelChange(option.value, checked as boolean)}
                  />
                  <label htmlFor={`channel-${option.value}`} className="text-sm font-medium">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.channels && formik.errors.channels && (
              <p className="text-destructive text-sm">{formik.errors.channels as string}</p>
            )}
          </div>

          <Input
            label="Title"
            name="title"
            placeholder="Enter notification title..."
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title ? formik.errors.title : undefined}
            required
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Message <span className="text-destructive">*</span>
            </label>
            <Textarea
              name="body"
              placeholder="Write your notification message..."
              value={formik.values.body}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
            />
            {formik.touched.body && formik.errors.body && (
              <p className="text-destructive text-sm">{formik.errors.body}</p>
            )}
          </div>

          <Input
            label="Action URL"
            name="action_url"
            placeholder="https://example.com/page (optional)"
            value={formik.values.action_url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.action_url ? formik.errors.action_url : undefined}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
